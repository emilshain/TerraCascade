# TerraCascade — Fallback Demo Script (zero network calls)

> **Draft status:** `02_FRONTEND.md`'s "required screens table" does not exist in the repo yet, so steps below are named generically by feature, not by exact screen/component name. Re-map each step to the real screen name once that doc lands. This script assumes static fixture data ships with the frontend build (no live API calls) — confirm that build mode exists once the frontend is implemented.

## Pre-conditions
- Frontend running in "fixture mode" — all data (hazard events, actions, cascade, budget results, alert drafts) loaded from bundled static JSON, no backend/API/network call made during the walkthrough.
- Wi-Fi can be off for the entire script.

## Script

1. **Open the dashboard.** Point out the flood-extent layer and its source/status/limitations label (`Prithvi-100M-sen1floods11`, `verified-demo`, single-timestamp/not-a-live-feed) before anything else — this sets the claim boundary for the rest of the demo. *(Maps to: flood alert / hazard overview screen.)*
2. **Open the map legend.** Show the split between verified information and assumptions. *(Maps to: map/legend component.)*
3. **Select the Orange EAP state fixture.** Walk through the action workflow list — every action shows owner, status, and its Idamalayar EAP citation from `config/eap_playbook.json`. *(Maps to: action workflow screen.)*
4. **Trigger a fixture override** on one action. Show the required reason field and the resulting timeline entry. *(Maps to: action detail / override modal.)*
5. **Open the cascade/impact view.** Narrate that dependencies shown are a modeled demo scenario, not validated engineering data. *(Maps to: cascade/impact screen.)*
6. **Open the budget optimiser.** Show both selected and excluded projects with the stated reason for exclusion. *(Maps to: budget optimiser screen.)*
7. **Open the alert composer** on the Red EAP state fixture. Point out the drafted evacuation recommendation and public-alert text, and read the "draft for authorised publication" label aloud. *(Maps to: alert composer screen.)*
8. **Close on the claim boundary.** Restate, from `docs/CLAIM_BOUNDARY_CHEAT_SHEET.md`, who holds real-world authority for each feature just shown.

## If asked to prove there's no network call
Open browser dev tools → Network tab before step 1; show it stays empty (or airplane-mode the machine before starting) through step 8.
