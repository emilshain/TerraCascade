import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { authService, DEMO_USERS } from "../services/auth-service.js";
import { getClusterStatus } from "../config/database.js";
import { authenticateJWT, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// Validation Schemas
const RegisterSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid official email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["kseb_epm", "district_eoc", "district_collector", "budget_planner"], {
    errorMap: () => ({ message: "Invalid emergency command role selected" }),
  }),
  badgeId: z.string().min(2, "Badge / Officer ID is required"),
  agency: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const LoginSchema = z.object({
  identifier: z.string().min(1, "Email or Officer Badge ID is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * POST /auth/register (or /auth/signup)
 * Register a new emergency official and issue a session JWT
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const validated = RegisterSchema.parse(req.body);
    const result = await authService.register(validated);

    res.status(201).json({
      message: "Official registered successfully.",
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation Failed",
        details: err.errors.map((e) => e.message),
      });
      return;
    }
    res.status(400).json({
      error: "Registration Failed",
      message: err.message || "Unable to register official credentials.",
    });
  }
});

// Alias for /signup
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const validated = RegisterSchema.parse(req.body);
    const result = await authService.register(validated);

    res.status(201).json({
      message: "Official registered successfully.",
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation Failed",
        details: err.errors.map((e) => e.message),
      });
      return;
    }
    res.status(400).json({
      error: "Registration Failed",
      message: err.message || "Unable to register official credentials.",
    });
  }
});

/**
 * POST /auth/login (or /auth/signin)
 * Authenticate with email/badgeId and password
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const identifier = req.body.identifier || req.body.email;
    const validated = LoginSchema.parse({
      identifier,
      password: req.body.password,
    });

    const result = await authService.login(validated.identifier, validated.password);

    res.status(200).json({
      message: "Authenticated successfully.",
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation Failed",
        details: err.errors.map((e) => e.message),
      });
      return;
    }
    res.status(401).json({
      error: "Authentication Failed",
      message: err.message || "Invalid credentials provided.",
    });
  }
});

// Alias for /signin
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const identifier = req.body.identifier || req.body.email;
    const validated = LoginSchema.parse({
      identifier,
      password: req.body.password,
    });

    const result = await authService.login(validated.identifier, validated.password);

    res.status(200).json({
      message: "Authenticated successfully.",
      user: result.user,
      token: result.token,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      res.status(400).json({
        error: "Validation Failed",
        details: err.errors.map((e) => e.message),
      });
      return;
    }
    res.status(401).json({
      error: "Authentication Failed",
      message: err.message || "Invalid credentials provided.",
    });
  }
});

/**
 * GET /auth/me
 * Return profile of current authenticated officer
 */
router.get("/me", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      // Return JWT payload if direct DB lookup fails
      res.json({
        id: req.user.userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        badgeId: req.user.badgeId,
        agency: "Emergency Command Official",
        isVerified: true,
      });
      return;
    }

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve officer profile", message: err.message });
  }
});

/**
 * GET /auth/cluster-status
 * Check MongoDB cluster health and connection telemetry
 */
router.get("/cluster-status", async (_req: Request, res: Response) => {
  try {
    const status = await getClusterStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      readyState: 0,
      statusText: "Error checking cluster status",
      error: err.message,
    });
  }
});

/**
 * POST /auth/seed-demo
 * Pre-populate official demo accounts in MongoDB cluster
 */
router.post("/seed-demo", async (_req: Request, res: Response) => {
  try {
    const result = await authService.seedDemoUsers();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to seed demo accounts", message: err.message });
  }
});

/**
 * GET /auth/demo-officers
 * Return list of pre-configured demo officer profiles for 1-click test signin
 */
router.get("/demo-officers", (_req: Request, res: Response) => {
  const officers = DEMO_USERS.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    badgeId: u.badgeId,
    agency: u.agency,
    phoneNumber: u.phoneNumber,
  }));
  res.json({ officers });
});

export default router;
