# TerraCascade — Claim Boundary Cheat Sheet

> Reconciled 2026-08-14 against `frontend/02_FRONTEND.md`'s "Product language rules" and "Required screens" table, now that the frontend exists. Wording below matches the shipped UI verbatim — this is the presenter's script, not a paraphrase.

One line each: what backs it, what's demo, who holds real authority. Say this, verbatim, if a judge or user asks "is this real?"

| Feature | Data behind it | What's demo/scenario | Who retains real-world authority |
|---|---|---|---|
| Flood alert (Command overview / Impact map) | Prithvi-100M-sen1floods11 inference on a single Sentinel-2 scene per EAP state, named AOI (Idamalayar Dam–Bhoothathankettu regulator stretch) | `status: verified-demo`; limitations list `single-timestamp inference` and `not a live feed`. UI calls this a **"ViT-derived flood extent (pre-computed)"** — never "live satellite detection" or "real-time imagery" | KSEB EPM confirms and interprets the hazard before any action is taken |
| Action workflow (Action board) | `config/eap_playbook.json` mapped to Idamalayar EAP alert levels (Blue/Orange/Red), one `ActionItem` per action with owner, approver, and protocol citation | Every action is a **"recommend for approval"** — never "order evacuation" | KSEB EPM / District EOC / District Authority, per the `approverRole` on each action; Red-state actions require Collector or authorised-communicator sign-off |
| Cascade / impact view (Cascade & resources) | Modeled dependency chain + resource-readiness pools (fuel/boat/generator/team) over the demo hazard scenario | Explicitly "not validated engineering data"; releases are framed as **"rule-curve context"** — never "open gate now" | Agencies (KSEB/PWD) validate real dependency and resource data before any of it is operational |
| Budget optimiser (Budget planner) | Exact 0/1 knapsack over a configured project/cost list (population + criticality benefit within a ₹-lakh slider budget) | Every result is a **"portfolio recommendation"** — never "funding decision"; all costs are `demo scenario assumption` unless cited to an official source | Funding decisions are made by the responsible agency/authority, not by the tool |
| Alert composer | Bilingual (English/Malayalam) templated text generated from the active hazard + action state | Every draft is explicitly labeled **"draft for authorised publication"** — never "send alert"; Malayalam copy is flagged as an unreviewed translation | Only a Collector or authorised communicator can approve and publish — TerraCascade never sends an alert |
| Audit timeline (bonus — not in the original 5, included since it's claim-relevant) | Every source-received, action-created, approval, acknowledgement, override, and alert-drafted event, with required reasons on overrides | The full trail is itself demo-scenario data for this fixture run | Whoever performed the logged action in the real deployment — the timeline is a record, not an authority |

**Never say:** "live," "real-time," "predictive," "order evacuation," "open gate now," "send alert," "funding decision," "TerraCascade sent an alert," "TerraCascade ordered an evacuation," "TerraCascade opened/controls a gate," or anything about landslides.

**Always say instead (UI's exact terms):** "verified demo alert" / "advisory readiness" / "scenario assumption," "recommend for approval," "rule-curve context," "draft for authorised publication," "portfolio recommendation," "ViT-derived flood extent (pre-computed)."
