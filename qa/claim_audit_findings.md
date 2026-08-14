# Claim/Label Audit Findings

**Status: BLOCKED — not yet run.** This audit needs backend fixtures, frontend copy, and the Model+Pitcher `HazardEvent` fixture to exist in the repo. As of this run, the repo contains only `README.md` — no application code, no fixtures, no slides. Re-run this audit as soon as any of those land.

## Checklist to execute once content exists

- [ ] Scan every fixture/copy source for hazard event, asset, cost, population, or confidence figures lacking a `source`/`status`/`limitations` label or inline citation.
- [ ] Grep UI strings and comments for forbidden language: `live`, `real-time`, `order evacuation`, `open gate now`, `send alert`, `funding decision`, or any landslide reference.
- [ ] Locate the flood `HazardEvent` fixture and confirm:
  - `source` names `Prithvi-100M-sen1floods11`, the Sentinel-2 scene ID/date, and the AOI.
  - `status` is exactly `"verified-demo"`.
  - `limitations` includes at least `"single-timestamp inference"` and `"not a live feed"`.

## Findings

_None yet — nothing to scan. This file will be populated with `file:line / issue / suggested fix` rows on the next run once fixtures/copy exist._

## Owner notes
Ping the Product Research + Integration lead (this workstream) to re-run this audit the moment `01_BACKEND.md`'s fixtures and `02_FRONTEND.md`'s copy are committed — do not merge frontend/backend copy to a public-facing branch before this audit has run at least once.
