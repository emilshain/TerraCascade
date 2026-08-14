# Claim/Label Audit Findings

**Status: RUN — 2026-08-14.** `frontend/` (full Next.js app + fixtures + `02_FRONTEND.md`) has landed. `00_PROBLEM_SPACE.md`, `01_BACKEND.md`, and `03_MODEL_AND_PITCHING.md` still do not exist — this audit covers everything that currently exists in the repo (`config/`, `docs/`, `frontend/`). Re-run `bash qa/scripts/run_claim_audit.sh` whenever fixtures/copy change; treat this file as the human-reviewed record of that script's output.

## Method
Ran `qa/scripts/run_claim_audit.sh` (forbidden-language grep + HazardEvent required-field check + numeric-field label heuristic) across the full repo, then manually reviewed every hit — the script flags candidates, it doesn't judge them.

## Findings

| # | File:line | What's wrong | Suggested fix | Severity |
|---|---|---|---|---|
| 1 | `frontend/app/cascade/page.tsx:15` | Page description reads *"Modeled dependency chain for the demo scenario — not validated engineering data — alongside **live resource-readiness levels**."* The resource pools it refers to (`RESOURCE_POOLS` in `lib/fixtures/cascade.ts`) are all `status: "demo scenario assumption"` — static fixture numbers, not a live feed. Calling them "live" contradicts the hard constraint and the page's own first half of the sentence. | Change "live resource-readiness levels" to "resource-readiness levels" or "modeled resource-readiness levels" — matches the fixture's actual `status` field and the rest of the app's language. | Real, needs fix — flagging to Frontend owner (this is a `.tsx` component file, outside my scoped fixture/doc edit exception). |

## Reviewed and cleared (no fix needed)

| Location | Text | Why it's not a violation |
|---|---|---|
| `frontend/lib/fixtures/budget.ts:42` | Project name: *"Real-time gauge telemetry, Idamalayar–Bhoothathankettu stretch"* | This names a *candidate future hardware project* (installing continuous river-gauge telemetry) in the budget optimiser's project list, not a claim about TerraCascade's own data being real-time. Its own `rationale` field says it "would let a future version replace single-timestamp satellite inference" — i.e. it's explicitly framed as not-yet-built. Real-world dam telemetry networks legitimately use "real-time" in their names (e.g. CWC's RTDAS). Left as-is. |
| `frontend/lib/store/demo-store.tsx:83` | Internal ID prefix: `` `audit-live-${prev.length + 1}` `` | Internal identifier distinguishing runtime-appended audit entries from seeded fixture ones (`audit-1`, `audit-2`, …) — never rendered to the user, not a claim about data freshness. Not a violation; optional future cleanup could rename to `audit-runtime-` to avoid tripping future greps, but not required. |
| Every other `live`/`real-time` hit across `config/`, `docs/`, `frontend/02_FRONTEND.md`, and all frontend components/fixtures | e.g. "not a live feed", "No live feed, no dispatched alerts", "never reads as a live feed" | All are negations correctly stating the *absence* of live/real-time behaviour — these are the claim-boundary language doing its job, not violations. |

## HazardEvent fixture — required-field check (`frontend/lib/fixtures/hazard.ts`)

| Requirement | Result |
|---|---|
| `source` names `Prithvi-100M-sen1floods11` | ✅ Pass — `source.model: "Prithvi-100M-sen1floods11"` |
| `source` names the Sentinel-2 scene/date | ✅ Pass — `source.scene: "Sentinel-2 L2A, single scene"`, plus per-state `sceneId` (e.g. `S2B_MSIL2A_20260602T045701_Idamalayar`) and `sceneDate` |
| `source` names the AOI | ✅ Pass — `"Idamalayar Dam – Bhoothathankettu regulator stretch, Periyar river system, Ernakulam district"` |
| `status` is exactly `"verified-demo"` | ✅ Pass |
| `limitations` includes `"single-timestamp inference"` | ✅ Pass |
| `limitations` includes `"not a live feed"` | ✅ Pass (fixture also adds a third, uninstructed-but-welcome limitation: `"cloud-sensitive optical input; not ground-truthed"`) |

## Other data-label spot checks (all pass)

- `BudgetProject` fixtures (`lib/fixtures/budget.ts`): every entry carries `status: "demo scenario assumption"` **and** an explicit `sourceCitation: "demo scenario assumption — not individually cited to an official source"` — stronger than the hard constraint requires (it names its own lack of citation rather than leaving it implicit).
- `MapAsset` fixtures (`lib/fixtures/assets.ts`): every entry has `status` + `verified` + a `rationale` explaining what is/isn't confirmed (e.g. hospital "coordinates are an illustrative placement, not a surveyed asset record").
- `ResourcePool` fixtures (`lib/fixtures/cascade.ts`): all `status: "demo scenario assumption"` — consistent with each other, **except** for the page-level wording caught in Finding #1 above.
- `ProtocolSource` on every `HazardEvent`/`ActionItem`: consistently `{document: "Idamalayar EAP", section: ..., status: "agency validation required"}` — see the note below on reconciling this with `config/eap_playbook.json`'s updated research.

## Note for Frontend/Model+Pitching owners
`config/eap_playbook.json` (this workstream) was updated after `frontend/lib/fixtures/actions.ts` and `hazard.ts` mirrored the original version — the fixtures still carry the original placeholder `protocolSource.section` text ("exact section/clause number not yet verified against the source document"). The playbook now cites a real, confirmed source: the national CWC Blue/Orange/Red framework (2016, DRIP) and a confirmed real "Emergency Action Plan (Tier-I) — Idamalayar Dam" PDF on KSEB's dam-safety portal (exact clause numbers still unconfirmed — portal's download link is JS-driven, no direct URL to fetch). Recommend Frontend pull the updated `protocolSource` fields from `config/eap_playbook.json` into `hazard.ts`/`actions.ts` next update — not done by me since that's frontend application code.

## Owner notes
Re-run `bash qa/scripts/run_claim_audit.sh` after any fixture/copy change, before every demo rehearsal, and immediately before the final submission. Fix #1 above before demo day — it's a one-line wording change in `frontend/app/cascade/page.tsx`.
