import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createApp } from "../app.js";
import type { Server } from "http";
import type { SafeUser } from "../models/User.js";
import type { ClusterStatus } from "../config/database.js";

describe("TerraCascade Auth & MongoDB Cluster Integration Suite", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === "object") {
          baseUrl = `http://localhost:${address.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it("GET /auth/cluster-status returns MongoDB cluster diagnostic telemetry", async () => {
    const res = await fetch(`${baseUrl}/auth/cluster-status`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as ClusterStatus;
    expect(data.readyState).toBeDefined();
    expect(typeof data.connected).toBe("boolean");
    expect(typeof data.statusText).toBe("string");
    expect(typeof data.clusterHost).toBe("string");
    expect(typeof data.dbName).toBe("string");
    expect(Array.isArray(data.collections)).toBe(true);
  });

  it("GET /auth/demo-officers returns list of verified emergency officials", async () => {
    const res = await fetch(`${baseUrl}/auth/demo-officers`);
    expect(res.status).toBe(200);

    const data = (await res.json()) as { officers: Array<{ name: string; email: string; role: string; badgeId: string }> };
    expect(data.officers.length).toBeGreaterThanOrEqual(4);
    expect(data.officers.some((o) => o.role === "kseb_epm")).toBe(true);
    expect(data.officers.some((o) => o.role === "district_collector")).toBe(true);
  });

  it("POST /auth/seed-demo triggers demo accounts population", async () => {
    const res = await fetch(`${baseUrl}/auth/seed-demo`, {
      method: "POST",
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { createdCount: number; message: string };
    expect(data.message).toBeDefined();
  });

  it("POST /auth/register creates new official account and returns JWT session token", async () => {
    const testOfficer = {
      name: "Anand Menon",
      email: `anand.menon.${Date.now()}@kerala.gov.in`,
      password: "SecureEmergencyPassword2026!",
      role: "kseb_epm",
      badgeId: `KSEB-TECH-${Date.now().toString().slice(-4)}`,
      agency: "KSEB Dam Safety Wing",
      phoneNumber: "+919876543210",
    };

    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testOfficer),
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as { user: SafeUser; token: string; message: string };
    expect(data.user.name).toBe(testOfficer.name);
    expect(data.user.email).toBe(testOfficer.email.toLowerCase());
    expect(data.user.role).toBe(testOfficer.role);
    expect(data.user.badgeId).toBe(testOfficer.badgeId);
    expect(typeof data.token).toBe("string");
    expect(data.token.length).toBeGreaterThan(20);
  });

  it("POST /auth/register rejects duplicate official emails", async () => {
    const email = `dup.officer.${Date.now()}@kerala.gov.in`;
    const officer = {
      name: "Duplicate Tester",
      email,
      password: "Password123!",
      role: "district_eoc",
      badgeId: "EOC-DUP-01",
    };

    const res1 = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(officer),
    });
    expect(res1.status).toBe(201);

    const res2 = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(officer),
    });
    expect(res2.status).toBe(400);
    const errorData = await res2.json();
    expect(errorData.message).toContain("already exists");
  });

  it("POST /auth/login authenticates demo officer with email and password", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "epm.biju@kseb.in",
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as { user: SafeUser; token: string };
    expect(data.user.name).toBe("Biju P.N");
    expect(data.user.role).toBe("kseb_epm");
    expect(typeof data.token).toBe("string");
  });

  it("POST /auth/login authenticates demo officer with Badge ID", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "IAS-KL-COL-01",
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as { user: SafeUser; token: string };
    expect(data.user.name).toContain("Dr. Renu Raj");
    expect(data.user.role).toBe("district_collector");
  });

  it("POST /auth/login rejects invalid passwords", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "epm.biju@kseb.in",
        password: "WrongPassword999!",
      }),
    });

    expect(res.status).toBe(401);
  });

  it("GET /auth/me returns current officer profile when presented with valid JWT Bearer", async () => {
    // Login first
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "eoc.salim@kerala.gov.in",
        password: "Password123!",
      }),
    });
    const loginData = (await loginRes.json()) as { token: string };

    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginData.token}`,
      },
    });

    expect(meRes.status).toBe(200);
    const meData = (await meRes.json()) as SafeUser;
    expect(meData.name).toBe("Salim M.");
    expect(meData.role).toBe("district_eoc");
    expect(meData.badgeId).toBe("DDMA-EOC-02");
  });

  it("GET /auth/me rejects unauthorized request without Bearer token", async () => {
    const res = await fetch(`${baseUrl}/auth/me`);
    expect(res.status).toBe(401);
  });
});
