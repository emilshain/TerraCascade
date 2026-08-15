import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, type IUser, type SafeUser, type OfficerRole } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import { timelineService } from "./timeline-service.js";

// Standard Verified Demo Officials
export const DEMO_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: OfficerRole;
  badgeId: string;
  agency: string;
  phoneNumber: string;
}> = [
  {
    name: "Biju P.N",
    email: "epm.biju@kseb.in",
    password: "Password123!",
    role: "kseb_epm",
    badgeId: "KSEB-EPM-04",
    agency: "Kerala State Electricity Board (Dam Safety Wing)",
    phoneNumber: "+919539367173",
  },
  {
    name: "Salim M.",
    email: "eoc.salim@kerala.gov.in",
    password: "Password123!",
    role: "district_eoc",
    badgeId: "DDMA-EOC-02",
    agency: "District Emergency Operations Centre, Kakkanad",
    phoneNumber: "+919074121510",
  },
  {
    name: "Dr. Renu Raj, IAS",
    email: "collector.ernakulam@kerala.gov.in",
    password: "Password123!",
    role: "district_collector",
    badgeId: "IAS-KL-COL-01",
    agency: "District Administration & DDMA Chairperson",
    phoneNumber: "+919539367173",
  },
  {
    name: "Priya V.",
    email: "planner.priya@kerala.gov.in",
    password: "Password123!",
    role: "budget_planner",
    badgeId: "KDMA-FIN-08",
    agency: "Disaster Mitigation & Finance Directorate",
    phoneNumber: "+919074121510",
  },
];

// Fallback in-memory user cache for offline/standalone mode
interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: OfficerRole;
  badgeId: string;
  agency: string;
  phoneNumber?: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

const inMemoryUsers = new Map<string, MemoryUser>();

// Initialize in-memory fallback users
(async () => {
  for (const u of DEMO_USERS) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(u.password, salt);
    const id = `mem-${u.badgeId.toLowerCase()}`;
    inMemoryUsers.set(u.email.toLowerCase(), {
      id,
      name: u.name,
      email: u.email.toLowerCase(),
      passwordHash: hash,
      role: u.role,
      badgeId: u.badgeId,
      agency: u.agency,
      phoneNumber: u.phoneNumber,
      isVerified: true,
      createdAt: new Date().toISOString(),
    });
  }
})();

export class AuthService {
  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async register(data: {
    name: string;
    email: string;
    password: string;
    role: OfficerRole;
    badgeId: string;
    agency?: string;
    phoneNumber?: string;
  }): Promise<{ user: SafeUser; token: string }> {
    const normalizedEmail = data.email.trim().toLowerCase();
    const agency = data.agency?.trim() || "Kerala Disaster Management Authority";

    if (this.isMongoConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        throw new Error(`An official account with email ${data.email} already exists.`);
      }

      const user = new User({
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
        role: data.role,
        badgeId: data.badgeId.trim(),
        agency,
        phoneNumber: data.phoneNumber?.trim(),
        isVerified: true,
        lastLogin: new Date(),
      });

      await user.save();

      timelineService.recordEvent({
        actorRole: user.role,
        eventType: "acknowledgement",
        description: `New emergency official registered in cluster: ${user.name} (${user.badgeId}) [${user.agency}]`,
        provenance: "MongoDB Cluster Identity Store",
      });

      const safeUser = user.toSafeObject();
      const token = generateToken(safeUser);

      return { user: safeUser, token };
    } else {
      // In-memory fallback
      if (inMemoryUsers.has(normalizedEmail)) {
        throw new Error(`An official account with email ${data.email} already exists.`);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);
      const id = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const memUser: MemoryUser = {
        id,
        name: data.name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: data.role,
        badgeId: data.badgeId.trim(),
        agency,
        phoneNumber: data.phoneNumber?.trim(),
        isVerified: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      inMemoryUsers.set(normalizedEmail, memUser);

      const safeUser: SafeUser = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        badgeId: memUser.badgeId,
        agency: memUser.agency,
        phoneNumber: memUser.phoneNumber,
        isVerified: memUser.isVerified,
        lastLogin: memUser.lastLogin,
        createdAt: memUser.createdAt,
      };

      timelineService.recordEvent({
        actorRole: safeUser.role,
        eventType: "acknowledgement",
        description: `New emergency official registered (local fallback): ${safeUser.name} (${safeUser.badgeId})`,
        provenance: "TerraCascade Identity Manager",
      });

      const token = generateToken(safeUser);
      return { user: safeUser, token };
    }
  }

  public async login(
    identifier: string,
    password: string
  ): Promise<{ user: SafeUser; token: string }> {
    const term = identifier.trim().toLowerCase();

    if (this.isMongoConnected()) {
      // Find by email or badgeId
      const user = await User.findOne({
        $or: [{ email: term }, { badgeId: { $regex: new RegExp(`^${term}$`, "i") } }],
      });

      if (!user) {
        throw new Error("Invalid official credentials. Officer record not found.");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password credentials.");
      }

      user.lastLogin = new Date();
      await user.save();

      timelineService.recordEvent({
        actorRole: user.role,
        eventType: "acknowledgement",
        description: `Emergency Officer signed in: ${user.name} (${user.badgeId})`,
        provenance: "MongoDB Cluster Authentication",
      });

      const safeUser = user.toSafeObject();
      const token = generateToken(safeUser);

      return { user: safeUser, token };
    } else {
      // In-memory fallback lookup
      let found: MemoryUser | undefined;
      for (const u of inMemoryUsers.values()) {
        if (u.email === term || u.badgeId.toLowerCase() === term) {
          found = u;
          break;
        }
      }

      if (!found) {
        throw new Error("Invalid official credentials. Officer record not found.");
      }

      const isMatch = await bcrypt.compare(password, found.passwordHash);
      if (!isMatch) {
        throw new Error("Invalid password credentials.");
      }

      found.lastLogin = new Date().toISOString();

      const safeUser: SafeUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        badgeId: found.badgeId,
        agency: found.agency,
        phoneNumber: found.phoneNumber,
        isVerified: found.isVerified,
        lastLogin: found.lastLogin,
        createdAt: found.createdAt,
      };

      timelineService.recordEvent({
        actorRole: safeUser.role,
        eventType: "acknowledgement",
        description: `Emergency Officer signed in: ${safeUser.name} (${safeUser.badgeId})`,
        provenance: "TerraCascade Identity Manager",
      });

      const token = generateToken(safeUser);
      return { user: safeUser, token };
    }
  }

  public async getUserById(id: string): Promise<SafeUser | null> {
    if (this.isMongoConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      const user = await User.findById(id);
      return user ? user.toSafeObject() : null;
    } else {
      for (const u of inMemoryUsers.values()) {
        if (u.id === id) {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            badgeId: u.badgeId,
            agency: u.agency,
            phoneNumber: u.phoneNumber,
            isVerified: u.isVerified,
            lastLogin: u.lastLogin,
            createdAt: u.createdAt,
          };
        }
      }
      return null;
    }
  }

  public async seedDemoUsers(): Promise<{ createdCount: number; message: string }> {
    let createdCount = 0;

    if (this.isMongoConnected()) {
      for (const demo of DEMO_USERS) {
        const existing = await User.findOne({ email: demo.email.toLowerCase() });
        if (!existing) {
          const user = new User({
            name: demo.name,
            email: demo.email.toLowerCase(),
            password: demo.password,
            role: demo.role,
            badgeId: demo.badgeId,
            agency: demo.agency,
            phoneNumber: demo.phoneNumber,
            isVerified: true,
          });
          await user.save();
          createdCount++;
        }
      }
      return {
        createdCount,
        message: `Successfully seeded ${createdCount} official demo accounts into MongoDB cluster.`,
      };
    } else {
      return {
        createdCount: DEMO_USERS.length,
        message: `In-memory store loaded with ${DEMO_USERS.length} demo accounts (fallback mode).`,
      };
    }
  }
}

export const authService = new AuthService();
