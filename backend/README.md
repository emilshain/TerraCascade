# TerraCascade EAP Command — Backend Service

**Goal:** Provide the REST API, EAP rules engine, downstream impact graph, and 0/1 knapsack budget optimiser for the TerraCascade Incident Command system.  
**Hazard Scope:** Flood only (Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district, Kerala). No landslide component.

---

## 1. Provenance & Claim Boundaries

- **Model Data:** Pre-computed inference outputs from `Prithvi-100M-sen1floods11` over Sentinel-2 scenes.
- **Fixture Contract:** Every fixture and API payload includes `source`, `status: "verified-demo"`, and `limitations: ["single-timestamp inference", "not a live feed", ...]`.
- **Authority Boundary:** TerraCascade produces recommendations and structured workflows for authorized human decision-makers (KSEB EPM / District EOC / District Authority / Collector). It does not autonomously issue public evacuation orders, send live alerts, or actuate dam gates.
- **Budget Optimiser:** Solves exact 0/1 knapsack dynamic programming as a **"portfolio recommendation"** (never a government funding decision).

---

## 2. Getting Started

### Prerequisites
- Node.js >= 18 (v20+ recommended)
- npm >= 9

### Installation
```bash
cd backend
npm install
```

### Running in Development (Hot-Reload)
```bash
npm run dev
# Server starts on http://localhost:4000
```

### Running Tests
```bash
npm test
```

### Production Build & Start
```bash
npm run build
npm start
```

---

## 3. API Reference Catalogue

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | System health, hazard scope, and provenance tags |
| `/events/active` | `GET` | Active flood scenario with Prithvi-derived GeoJSON extent |
| `/events` | `GET` | List all flood scenarios (Blue, Orange, Red) |
| `/events/active/state` | `POST` | Switch active flood scenario (`blue` / `orange` / `red`) |
| `/events/:id` | `GET` | Specific flood event by ID |
| `/events/:id/actions` | `GET` | Actions for event with EAP citations, filtered by role |
| `/actions` | `GET` | List all actions with status/role query filters |
| `/actions/:id` | `PATCH` | Update action status or manual override with audit logging |
| `/events/:id/impact` | `GET` | Downstream critical assets, dependencies, and cascade nodes |
| `/portfolio/optimise` | `POST` | 0/1 Knapsack portfolio optimisation (sub-millisecond) |
| `/portfolio/projects` | `GET` | Default mitigation candidate projects |
| `/events/:id/timeline` | `GET` | Chronological audit/activity timeline |
| `/events/:id/resources` | `GET` | Fuel, boats, generators, and response team pools |
| `/events/:id/alerts` | `GET` | Bilingual (EN/ML) CAP-style alert preview drafts |
| `/events/:id/alerts/approve` | `POST` | Human sign-off on public-alert preview draft |

---

## 4. Example Requests & Responses

### 4.1 Get Active Event (`GET /events/active`)
```bash
curl -s http://localhost:4000/events/active | jq
```
```json
{
  "id": "hazard-orange",
  "hazard": "flood",
  "severity": "orange",
  "label": "Orange flood/EAP state — Idamalayar controlled-release scenario",
  "source": "Prithvi-100M-sen1floods11 inference, Sentinel-2 scene S2A_MSIL2A_20260714T045659_Idamalayar, Idamalayar AOI",
  "status": "verified-demo",
  "confidence": 0.74,
  "confidenceLabel": "Moderate-high — clear scene over AOI core",
  "issuedAt": "2026-07-14T11:42:00+05:30",
  "affectedZones": ["extent-orange-1"],
  "limitations": [
    "single-timestamp inference",
    "not a live feed",
    "cloud-sensitive optical input; not ground-truthed"
  ],
  "floodExtentGeoJson": { ... }
}
```

### 4.2 Switch Active Scenario (`POST /events/active/state`)
```bash
curl -X POST http://localhost:4000/events/active/state \
  -H "Content-Type: application/json" \
  -d '{"state": "red", "actorRole": "district_authority"}'
```

### 4.3 Update Action with Override Reason (`PATCH /actions/:id`)
```bash
curl -X PATCH http://localhost:4000/actions/act-orange-3 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "actorRole": "district_eoc",
    "overrideReason": "Manual override: emergency liaison staged early."
  }'
```

### 4.4 Run Portfolio Optimisation (`POST /portfolio/optimise`)
```bash
curl -X POST http://localhost:4000/portfolio/optimise \
  -H "Content-Type: application/json" \
  -d '{"budget": 150}'
```
```json
{
  "selectedProjects": [ ... ],
  "unselectedProjects": [ ... ],
  "totalCost": 147,
  "remainingBudget": 3,
  "totalProtectedImpact": 105600,
  "explanations": {
    "selected": [
      {
        "projectId": "bp-siren-network",
        "name": "Early-warning siren network, Periyar downstream panchayats",
        "cost": 35,
        "criticality": 8.8,
        "populationImpact": 65000,
        "benefitScore": 57200,
        "explanation": "Selected: Allocates ₹35L to protect ~65,000 residents..."
      }
    ],
    "unselected": [ ... ]
  },
  "provenance": {
    "algorithm": "0/1 Knapsack Dynamic Programming (Exact)",
    "runtimeMs": 0.082,
    "status": "portfolio recommendation",
    "disclaimer": "Portfolio recommendation only — not a government funding decision."
  }
}
```

---

## 5. Architecture & Project Layout

```
backend/
├── src/
│   ├── fixtures/           # GeoJSON extents, EAP rules, actions, assets, budget
│   ├── middleware/         # Logging, error handling
│   ├── routes/             # REST endpoints (/events, /actions, /portfolio, /health)
│   ├── services/           # Business logic, state management, DP knapsack, audit logger
│   ├── tests/              # Vitest test suites (100% passing)
│   ├── types/              # Domain models matching 01_BACKEND.md
│   ├── app.ts              # Express configuration & CORS
│   └── index.ts            # Server bootstrapper
├── package.json
├── tsconfig.json
└── README.md
```
