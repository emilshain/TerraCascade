"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const eap_playbook_js_1 = require("../fixtures/eap-playbook.js");
const hazard_fixtures_js_1 = require("../fixtures/hazard-fixtures.js");
const actions_fixtures_js_1 = require("../fixtures/actions-fixtures.js");
(0, vitest_1.describe)("EAP Playbook & Rules Engine Integrity", () => {
    (0, vitest_1.it)("contains valid configuration for Blue, Orange, and Red states", () => {
        const states = eap_playbook_js_1.EAP_PLAYBOOK_RULES.map((r) => r.state);
        (0, vitest_1.expect)(states).toContain("blue");
        (0, vitest_1.expect)(states).toContain("orange");
        (0, vitest_1.expect)(states).toContain("red");
    });
    (0, vitest_1.it)("ensures every hazard event contains required provenance and limitations fields", () => {
        for (const [state, event] of Object.entries(hazard_fixtures_js_1.HAZARD_EVENTS)) {
            (0, vitest_1.expect)(event.hazard).toBe("flood");
            (0, vitest_1.expect)(event.severity).toBe(state);
            (0, vitest_1.expect)(event.status).toBe("verified-demo");
            (0, vitest_1.expect)(event.source).toContain("Prithvi-100M-sen1floods11");
            (0, vitest_1.expect)(event.limitations).toContain("single-timestamp inference");
            (0, vitest_1.expect)(event.limitations).toContain("not a live feed");
            (0, vitest_1.expect)(event.affectedZones.length).toBeGreaterThan(0);
            (0, vitest_1.expect)(event.floodExtentGeoJson?.type).toBe("FeatureCollection");
        }
    });
    (0, vitest_1.it)("ensures every action specifies human authority boundaries and protocol citations", () => {
        for (const action of actions_fixtures_js_1.INITIAL_ACTIONS) {
            (0, vitest_1.expect)(action.ownerRole).toBeDefined();
            (0, vitest_1.expect)(action.approverRole).toBeDefined();
            (0, vitest_1.expect)(action.protocolSource).toBeDefined();
            (0, vitest_1.expect)(action.authorityBoundary).toBeDefined();
            (0, vitest_1.expect)(action.authorityBoundary.length).toBeGreaterThan(10);
            // Confirms that actions represent recommendations subject to human authority
            (0, vitest_1.expect)(action.title.toLowerCase()).not.toContain("open gate now");
        }
    });
});
