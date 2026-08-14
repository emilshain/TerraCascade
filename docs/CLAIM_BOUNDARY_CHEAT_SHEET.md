# TerraCascade — Claim Boundary Cheat Sheet

> **Draft status:** `02_FRONTEND.md` (the source of the canonical "Product language rules" and screen names) does not exist in the repo yet. Wording below uses the terminology fixed in `04_MODEL_RESEARCH_AND_INTEGRATION.md`'s hard constraints. Re-check every line against `02_FRONTEND.md` once it lands and correct any mismatch.

One line each: what backs it, what's demo, who holds real authority. Say this, verbatim, if a judge or user asks "is this real?"

| Feature | Data behind it | What's demo/scenario | Who retains real-world authority |
|---|---|---|---|
| Flood alert (flood-extent layer) | Prithvi-100M-sen1floods11 inference on a single Sentinel-2 scene | Status is `verified-demo`; single-timestamp inference, not a live feed | KSEB EPM confirms and interprets the hazard before any action is taken |
| Action workflow (owner/status/citation per action) | Configured EAP playbook (`config/eap_playbook.json`) mapped to Idamalayar EAP alert levels | Trigger scenarios (Blue/Orange/Red) are `demo scenario assumption`; actions are recommendations, not executed orders | KSEB EPM / District EOC / District Authority, per the `approverRole` on each action |
| Cascade / impact view | Modeled dependency and impact-propagation logic over the demo hazard scenario | Entire cascade is a scenario built for the demo — no live sensor or asset-damage feed | Agencies validate real dependency data before any of it is operational |
| Budget optimiser | Knapsack-style selection over a configured project/cost list | All costs and selection outcomes are `demo scenario assumption` unless individually cited to an official source | Funding decisions are made by the responsible agency/authority, not by the tool |
| Alert composer | Templated text generated from the active hazard + action state | Every draft is explicitly labeled "draft for authorised publication" | Only a Collector or authorised communicator can approve and publish |

**Never say:** "live," "real-time," "predictive," "TerraCascade sent an alert," "TerraCascade ordered an evacuation," "TerraCascade opened/controls a gate," or anything about landslides.

**Always say instead:** "pre-computed, verified-demo flood layer from a single Sentinel-2 scene," "recommendation for [role] to review," "draft for authorised publication."
