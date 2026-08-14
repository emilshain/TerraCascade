# Problem Alignment Check

**Status: BLOCKED — not yet run.** This check cross-references `01_BACKEND.md` and `02_FRONTEND.md` against `00_PROBLEM_SPACE.md`'s "What TerraCascade is / is not" lists and demo success criteria. None of those three docs exist in the repo yet (only `README.md` is present). Re-run as soon as all three land.

## How to run this once the docs exist

1. Extract `00_PROBLEM_SPACE.md`'s "is" / "is not" lists and its demo success-criteria list verbatim.
2. For every feature/screen described in `01_BACKEND.md` and `02_FRONTEND.md`, map it to a specific "is" bullet. Anything with no mapping goes in the findings table below as `not yet` with a one-line note.
3. For every success criterion, mark `met` / `not yet` / `needs fixture` based on whether a corresponding backend/frontend capability actually exists (not just described).

## Findings

| Feature / screen / criterion | Status | Note |
|---|---|---|
| _(none — 00/01/02 not yet in repo)_ | blocked | Populate this table on next run |

## Owner notes
Flag to the Backend and Frontend leads: this check is the mechanism that catches scope creep (a feature that doesn't map to a stated problem) and unmet demo criteria before the hackathon deadline — run it early and often once docs exist, not just once at the end.
