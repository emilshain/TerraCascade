# TerraCascade — Judge Q&A Sheet

> **Draft status:** `03_MODEL_AND_PITCHING.md` (which should hold the three mandatory pre-drafted answers) does not exist in the repo yet. The three items below are my best guess at the mandatory questions this kind of claim-boundary-sensitive project always gets, drafted so the Model+Pitching owner can swap in their real answers without changing structure. Replace the "DRAFT — reconcile with 03" answers verbatim once that doc lands.

## Mandatory questions (reconcile with 03_MODEL_AND_PITCHING.md)

**1. Is this live / real-time?**
DRAFT — reconcile with 03: No. The flood-extent layer is a pre-computed, `verified-demo` output of Prithvi-100M-sen1floods11 run once against a single Sentinel-2 scene. It updates when we re-run inference on a new scene, not continuously — there is no live feed.

**2. Does TerraCascade replace KSEB's Emergency Action Plan or make dam-gate decisions?**
DRAFT — reconcile with 03: No. TerraCascade surfaces the existing Idamalayar EAP alert-level structure (Blue/Orange/Red) as configured triggers and turns them into a checklist of recommended actions with named owners and approvers. It never issues a public order, drafts an evacuation without human review, or has any control path to a dam gate.

**3. What happens if the model is wrong?**
DRAFT — reconcile with 03: Every hazard event carries `source`, `status`, and `limitations` labels so a reviewer can see exactly what the model saw and did not see (single-timestamp, cloud-sensitive, not ground-truthed). Every downstream action requires a named human owner/approver before anything leaves the tool, so a wrong inference is caught at the review step, not acted on automatically.

## Additional likely questions

**4. What happens if the Sentinel-2 scene is cloudy?**
Sentinel-2 optical imagery can't see through cloud cover, so a cloudy scene either fails inference or produces a low-confidence extent. In the current demo we select a known-clear scene and label its date explicitly; a production version would need a documented fallback (e.g. SAR-based flood mapping, or an explicit "no usable scene" state) rather than silently substituting an old result.

**5. How do you know the cascade/impact dependencies are correct?**
We don't claim they are validated — the cascade view is a modeled demo scenario, explicitly labeled as an assumption, not a verified engineering dependency graph. Making it real would require the relevant infrastructure and asset data from KSEB/PWD and sign-off from someone who owns that data.

**6. Why a knapsack DP for the budget optimiser instead of a heuristic?**
For a bounded set of candidate projects with a hard budget cap, exact 0/1 knapsack DP is cheap to compute and gives a provably optimal selection, which is easier to defend to a judge or an agency than a heuristic's "close enough" answer. If the project list grows large enough that DP's polynomial cost matters, a heuristic (e.g. greedy by cost-effectiveness ratio) is the natural fallback, but we haven't needed it at demo scale.

**7. What's your data source for population/impact figures?**
Every population or impact number in the demo is either sourced to a named official dataset (census, district disaster-management figures) or explicitly labeled `demo scenario assumption` — we do not present an unlabelled number anywhere. Any figure without a named source in the running app is a bug per our own audit rules (see `qa/claim_audit_findings.md`).

**8. How would this integrate with SACHET (the national common alerting protocol platform)?**
TerraCascade's alert composer produces a draft in plain text; a real integration path would be to format that draft as a CAP (Common Alerting Protocol) message and hand it to SACHET's publishing pipeline, with the actual "publish" action still gated behind the same authorised-communicator sign-off SACHET itself requires. We have not built that integration — it's a described path, not a built one.

**9. Who is the actual user of this tool, and have they seen it?**
The intended users are KSEB EPM staff, District EOC coordinators, and the District Authority — the roles named in `config/eap_playbook.json`. This is a hackathon prototype; it has not yet been reviewed or validated by any of those agencies, and we say so rather than imply otherwise.

**10. What's the single biggest risk if someone mistook this for a production tool?**
That someone treats a `verified-demo` flood extent as current ground truth, or treats a drafted alert as already sent. Every screen carries source/status/limitations labels and "draft for authorised publication" language specifically to prevent that — see `docs/CLAIM_BOUNDARY_CHEAT_SHEET.md`.
