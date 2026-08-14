# TerraCascade — Fallback Demo Script (zero network calls)

> Reconciled 2026-08-14 against the real `frontend/` app and `frontend/02_FRONTEND.md`'s required-screens table. All data is bundled fixture data under `frontend/lib/fixtures/*` — no backend, no external API calls, confirmed by reading `demo-store.tsx` (everything lives in an in-memory React context seeded from static fixtures). The map (`/map`) does fetch zero tiles by design ("No basemap tiles are fetched — this view is fully offline" — its own page copy) and draws only bundled GeoJSON/marker data via Leaflet.

## Pre-conditions
- `cd frontend && npm install && npm run build && npm run start` (or `npm run dev`), then open the local URL.
- Wi-Fi/network can be off for the entire walkthrough — nothing here calls out.

## Script

1. **Command overview (`/`).** Point at the `HazardSummaryCard`: severity badge, the `ProvenanceTag` ("Prithvi-100M-sen1floods11, Sentinel-2, [date]"), the Received/Confidence/Status row, and the Limitations list. This sets the claim boundary before anything else. Switch the EAP-state selector (Blue → Orange → Red) in the top bar to show the hazard escalating.
2. **Action board (`/actions`).** Walk through the action list for the current EAP state — every card shows Owner, Approver, a status stepper (Drafted → Approval → Acknowledged → In progress → Complete), and an expandable "Idamalayar EAP — protocol citation" drawer.
3. **Trigger an override.** On any action card, click **Override**, set a new status, and try submitting with an empty reason (it's blocked — the button stays disabled). Type a reason and submit; then jump to **Audit timeline (`/audit`)** and show the new "Override" entry with the typed reason attached.
4. **Impact map (`/map`).** Point out the "No basemap tiles are fetched — this view is fully offline" line, the flood-extent polygon (colour-coded per EAP state), and hover it to show the Leaflet tooltip: "Prithvi-100M-sen1floods11 flood extent — verified-demo, single-timestamp, not a live feed." Open the **Map Legend** panel and show the verified-assets vs scenario-assumption split. Click a hospital/shelter/road marker to show its rationale popup.
5. **Cascade & resources (`/cascade`).** Narrate the dependency chain (dam release → regulator inflow → bridge route → shelter/hospital access) as a modeled demo scenario, not validated engineering data. Point at the resource-readiness tiles (fuel/boats/generators/teams) — all `demo scenario assumption`.
6. **Budget planner (`/budget`).** Move the ₹-lakh slider and show the Selected/Excluded project lists updating live (client-side knapsack recompute) — point out every excluded project shows its specific exclusion reason, and the slider's own caption: "Portfolio recommendation only — funding decisions are made by the responsible agency."
7. **Alert composer (`/alerts`).** Switch the EAP state to Red, show the bilingual (English/Malayalam) draft, and read the banner aloud: "Draft for authorised publication — not sent." Switch role to District Authority to show the Approve button becomes enabled; approve it and note the Malayalam-translation caveat.
8. **Audit timeline (`/audit`).** Close by scrolling the full trail — source received, actions created, approvals, acknowledgements, overrides — as the single source of truth for what actually happened in this demo session.
9. **Close on the claim boundary.** Restate, from `docs/CLAIM_BOUNDARY_CHEAT_SHEET.md`, who holds real-world authority for each screen just shown.

## If asked to prove there's no network call
Open browser dev tools → Network tab before step 1 (or airplane-mode the machine before starting); it stays empty through step 9 except for the one-time page-bundle loads on first navigation to each route (no data/API calls).
