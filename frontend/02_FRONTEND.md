# TerraCascade EAP Command — Frontend Work Package

**Owner:** Frontend developer
**Goal:** Create a polished incident-command product, not a collection of charts.
**Hazard scope:** Flood only. No landslide component in this build.

## You own

1. Main command-centre layout and navigation.
2. Role-based views and action status interactions.
3. Hazard/impact map and cascade panel.
4. Resource-readiness board.
5. Budget-planning interface.
6. CAP-style bilingual public-alert draft preview.
7. Demo-mode and evidence/limitation labels.

## Required screens

| Screen | Must show |
|---|---|
| Command overview | Active flood hazard, severity, source, timestamp, confidence, pending actions and attention-required count |
| Action board | Drafted -> approval -> acknowledged -> in progress -> complete states, owner, approver and EAP source |
| Impact map | Flood extent (from Prithvi-100M-sen1floods11 inference), roads, hospital, shelter, critical assets and impact legend |
| Cascade/resource view | Dependency chain, risk label, fuel/boat/generator/team availability and blocked route state |
| Budget planner | ₹ budget slider, selected/unselected mitigation projects, cost, population/criticality benefit and rationale |
| Alert composer | English/Malayalam preview, affected zone, approval state and explicit "draft only" label |
| Audit timeline | Source received, actions created, approvals, acknowledgements and overrides |

## Product language rules

Use these terms exactly:

- "Verified demo alert", "advisory readiness", or "scenario assumption" — never a fake live alert.
- "Recommend for approval" — never "order evacuation".
- "Rule-curve context" — never "open gate now".
- "Draft for authorised publication" — never "send alert".
- "Portfolio recommendation" — never "funding decision".
- "ViT-derived flood extent (pre-computed)" — never "live satellite detection" or "real-time imagery".

## Design direction

- Make the **attention-required** and **pending approval** states visually prominent.
- Use a calm control-room aesthetic: dark/neutral base, accessible severity colours, no red used merely as decoration.
- The map needs a legend that distinguishes flood extent, verified assets and scenario assumptions.
- Show protocol citations in an expandable detail drawer, e.g. "Idamalayar EAP - Orange Alert action sheet."
- On the flood-extent layer specifically, include a small provenance tag (e.g. "Prithvi-100M-sen1floods11, Sentinel-2, [date]") so the map never reads as a live feed.
- Let users switch roles, but hide restricted details by role. Everyone can see shared status.

## Backend integration contract

Consume the endpoints and types described in `01_BACKEND.md`. If integration is delayed, use the same fixture shape locally so swapping to the API is trivial.

## Definition of done

- A judge can understand the incident state in 10 seconds.
- A judge can approve/acknowledge an action and see it update in the timeline.
- A judge can move the budget slider and see the portfolio change.
- A judge can see why an asset is P1 and whether that claim is verified or scenario-based.
- The app works with a fixed demo scenario even with no internet connection.
