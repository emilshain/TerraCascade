import { describe, it, expect } from "vitest";
import { EAP_PLAYBOOK_RULES } from "../fixtures/eap-playbook.js";
import { HAZARD_EVENTS } from "../fixtures/hazard-fixtures.js";
import { INITIAL_ACTIONS } from "../fixtures/actions-fixtures.js";

describe("EAP Playbook & Rules Engine Integrity", () => {
  it("contains valid configuration for Blue, Orange, and Red states", () => {
    const states = EAP_PLAYBOOK_RULES.map((r) => r.state);
    expect(states).toContain("blue");
    expect(states).toContain("orange");
    expect(states).toContain("red");
  });

  it("ensures every hazard event contains required provenance and limitations fields", () => {
    for (const [state, event] of Object.entries(HAZARD_EVENTS)) {
      expect(event.hazard).toBe("flood");
      expect(event.severity).toBe(state);
      expect(event.status).toBe("verified-demo");
      expect(event.source).toContain("Prithvi-100M-sen1floods11");
      expect(event.limitations).toContain("single-timestamp inference");
      expect(event.limitations).toContain("not a live feed");
      expect(event.affectedZones.length).toBeGreaterThan(0);
      expect(event.floodExtentGeoJson?.type).toBe("FeatureCollection");
    }
  });

  it("ensures every action specifies human authority boundaries and protocol citations", () => {
    for (const action of INITIAL_ACTIONS) {
      expect(action.ownerRole).toBeDefined();
      expect(action.approverRole).toBeDefined();
      expect(action.protocolSource).toBeDefined();
      expect(action.authorityBoundary).toBeDefined();
      expect((action.authorityBoundary || "").length).toBeGreaterThan(10);
      // Confirms that actions represent recommendations subject to human authority
      expect(action.title.toLowerCase()).not.toContain("open gate now");
    }
  });
});
