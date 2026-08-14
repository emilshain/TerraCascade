# TerraCascade EAP Command — Backend Work Package

**Owner:** Backend developer
**Goal:** Build the API and rules engine that make the product feel real.
**Hazard scope:** Flood only. No landslide component in this build.

## You own

1. Incident event creation and retrieval.
2. EAP playbook/rules engine.
3. Action workflow: approval, acknowledgement, progress, completion and override reason.
4. Cascade/impact graph API using the agreed demo fixtures.
5. Budget optimiser API using 0/1 knapsack-style dynamic programming.
6. Audit timeline API.

## Do not own

- Pixel-perfect dashboard layout.
- Running or training any ML/ViT model. You **consume** the flood fixture that Model+Pitcher hands off (see below) — you never call the model yourself.
- Sending a real SMS/siren/public alert.
- Claiming live government or satellite integrations.

## Required demo data contract

Use static JSON fixtures. Every fixture must have `source`, `status`, and `limitations` fields. The flood event's `affectedZones` geometry comes from Model+Pitcher's pre-computed Prithvi-100M-sen1floods11 inference — treat it exactly like any other fixture, with full provenance in `source`.

```ts
type HazardEvent = {
  id: string;
  hazard: 'flood';
  severity: 'blue' | 'orange' | 'red';
  source: string; // e.g. "Prithvi-100M-sen1floods11 inference, Sentinel-2 scene 2026-07-xx, Idamalayar AOI"
  status: 'verified-demo' | 'advisory-demo' | 'scenario';
  confidence?: number;
  issuedAt: string;
  affectedZones: string[]; // GeoJSON feature IDs from the flood-extent fixture
  limitations: string[]; // e.g. "single-timestamp inference", "not a live feed"
};

type Action = {
  id: string;
  eventId: string;
  title: string;
  ownerRole: string;
  approverRole?: string;
  protocolSource: string;
  status: 'drafted' | 'awaiting_approval' | 'approved' | 'acknowledged' | 'in_progress' | 'completed' | 'overridden';
  dueAt?: string;
  overrideReason?: string;
};
```

## Minimum API surface

| Endpoint / function | Required result |
|---|---|
| `GET /events/active` | The flood demo event, including the Prithvi-derived flood-extent geometry |
| `GET /events/:id/actions` | Role-specific actions with protocol citations |
| `PATCH /actions/:id` | Valid status transition and audit entry |
| `GET /events/:id/impact` | Assets, dependency edges, evidence labels and priority |
| `POST /portfolio/optimise` | Budget-feasible funded/unfunded mitigation list |
| `GET /events/:id/timeline` | Ordered audit/activity timeline |

## Playbook rules to configure

Use Idamalayar EAP as the reference configuration only, flood states only:

- **Blue:** Watch condition; observation, monitoring and internal notification tasks.
- **Orange:** Controlled-release readiness; area impact review, hourly monitoring and notification workflow.
- **Red:** Large-release/failure condition; immediate-evacuation recommendation card for the District Authority, subject to human authority.

Every action must show that it is a recommendation or configured workflow task, never an autonomous order.

## Portfolio optimiser

Input: list of mitigation projects with `cost`, `criticality`, `populationImpact`, and `evidenceLabel`; budget in rupees.
Output: selected projects, unselected projects, total cost, remaining budget, total protected impact, and a short explanation per selected project.

Use integer cost units suitable for a demo. Do not call it a government funding decision.

## Definition of done

- The frontend can load a complete flood event with actions, impact and timeline from one command.
- Status changes persist for the demo session and create audit entries.
- A ₹10 crore input returns a deterministic portfolio in under one second.
- No API calls require external government or satellite-provider credentials at runtime — the Prithvi output is a pre-baked fixture, not a live call.
- Every output visibly distinguishes demo/scenario data from live verified data.
