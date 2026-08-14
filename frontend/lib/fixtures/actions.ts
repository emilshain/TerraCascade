import type { ActionItem, EapState } from "@/lib/types";

// Mirrors config/eap_playbook.json's productAction lists, expanded into
// individually trackable ActionItem records. 01_BACKEND.md's canonical Action
// type does not exist yet — reconcile field names once it lands.

const BLUE_PROTOCOL = {
  document: "Idamalayar EAP",
  section:
    "Alert Level 1 / Blue (Watch) — exact section/clause number not yet verified against the source document",
  status: "agency validation required" as const,
};

const ORANGE_PROTOCOL = {
  document: "Idamalayar EAP",
  section:
    "Alert Level 2 / Orange (Warning) — exact section/clause number not yet verified against the source document",
  status: "agency validation required" as const,
};

const RED_PROTOCOL = {
  document: "Idamalayar EAP",
  section:
    "Alert Level 3 / Red (Danger/Emergency) — exact section/clause number not yet verified against the source document",
  status: "agency validation required" as const,
};

export const ACTIONS: ActionItem[] = [
  // Blue — eap-blue — owner/approver: KSEB EPM
  {
    id: "act-blue-1",
    eapState: "blue",
    title: "Display flood-extent layer for the configured watch scenario",
    description:
      "Surface the flood-extent layer with its source/status/limitations label so the watch scenario is visible on the command overview and map.",
    status: "complete",
    ownerRole: "KSEB EPM",
    approverRole: "KSEB EPM",
    authorityBoundary:
      "No external or public order may be issued at Blue. Product surfaces monitoring and an internal checklist only; it does not notify anyone outside KSEB.",
    protocolSource: BLUE_PROTOCOL,
    attentionRequired: false,
    createdAt: "2026-06-02T05:20:00+05:30",
    updatedAt: "2026-06-02T05:32:00+05:30",
    restricted: false,
  },
  {
    id: "act-blue-2",
    eapState: "blue",
    title: "Run internal inspection checklist (KSEB EPM)",
    description:
      "Work through the standing gate, spillway and instrumentation inspection checklist for the watch scenario.",
    status: "in_progress",
    ownerRole: "KSEB EPM",
    approverRole: "KSEB EPM",
    authorityBoundary:
      "No external or public order may be issued at Blue. Product surfaces monitoring and an internal checklist only; it does not notify anyone outside KSEB.",
    protocolSource: BLUE_PROTOCOL,
    attentionRequired: false,
    createdAt: "2026-06-02T05:25:00+05:30",
    updatedAt: "2026-06-02T09:10:00+05:30",
    restricted: false,
  },
  {
    id: "act-blue-3",
    eapState: "blue",
    title: "Log internal-notification entry to EOC duty officer",
    description:
      "Record a duty-officer notification entry. Internal-only — no external or public communication is authorised at this state.",
    status: "drafted",
    ownerRole: "KSEB EPM",
    approverRole: "KSEB EPM",
    authorityBoundary:
      "No external or public order may be issued at Blue. Product surfaces monitoring and an internal checklist only; it does not notify anyone outside KSEB.",
    protocolSource: BLUE_PROTOCOL,
    attentionRequired: false,
    createdAt: "2026-06-02T05:30:00+05:30",
    updatedAt: "2026-06-02T05:30:00+05:30",
    restricted: true,
  },

  // Orange — eap-orange — owner: KSEB + District EOC / approver: KSEB EPM or authorised chain
  {
    id: "act-orange-1",
    eapState: "orange",
    title: "Run impact review against the controlled-release scenario",
    description:
      "Review projected impact for the configured rule-curve / controlled-release scenario against assets downstream of the regulator.",
    status: "in_progress",
    ownerRole: "KSEB + District EOC",
    approverRole: "KSEB EPM / authorised chain",
    authorityBoundary:
      "Product surfaces impact-review data and a readiness checklist only. EPM or the authorised chain decides any coordination or release action — TerraCascade does not decide or trigger releases.",
    protocolSource: ORANGE_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-07-14T11:50:00+05:30",
    updatedAt: "2026-07-14T13:05:00+05:30",
    restricted: false,
  },
  {
    id: "act-orange-2",
    eapState: "orange",
    title: "Publish hourly internal update to KSEB and District EOC",
    description:
      "Push the hourly rule-curve-context update to the KSEB duty desk and District EOC channel. Internal distribution only.",
    status: "pending_approval",
    ownerRole: "KSEB + District EOC",
    approverRole: "KSEB EPM / authorised chain",
    authorityBoundary:
      "Product surfaces impact-review data and a readiness checklist only. EPM or the authorised chain decides any coordination or release action — TerraCascade does not decide or trigger releases.",
    protocolSource: ORANGE_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-07-14T12:00:00+05:30",
    updatedAt: "2026-07-14T12:00:00+05:30",
    restricted: true,
  },
  {
    id: "act-orange-3",
    eapState: "orange",
    title: "Surface coordination-readiness checklist for review",
    description:
      "Compile contact lists and staging status (fuel, boats, generators, teams) into a readiness checklist for District EOC review.",
    status: "drafted",
    ownerRole: "KSEB + District EOC",
    approverRole: "KSEB EPM / authorised chain",
    authorityBoundary:
      "Product surfaces impact-review data and a readiness checklist only. EPM or the authorised chain decides any coordination or release action — TerraCascade does not decide or trigger releases.",
    protocolSource: ORANGE_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-07-14T12:10:00+05:30",
    updatedAt: "2026-07-14T12:10:00+05:30",
    restricted: true,
  },

  // Red — eap-red — owner: District Authority / approver: Collector or authorised communicator
  {
    id: "act-red-1",
    eapState: "red",
    title: "Immediate-evacuation recommendation for District Authority review",
    description:
      "Recommend for approval: immediate evacuation of the mapped Red-state flood extent. Requires District Authority review before any downstream step proceeds.",
    status: "pending_approval",
    ownerRole: "District Authority",
    approverRole: "Collector / authorised communicator",
    authorityBoundary:
      "Product drafts a recommendation and alert text only. Publication and any evacuation order require Collector or authorised-communicator sign-off. TerraCascade does not send alerts, order evacuations, or control gates.",
    protocolSource: RED_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-08-09T19:10:00+05:30",
    updatedAt: "2026-08-09T19:10:00+05:30",
    restricted: true,
  },
  {
    id: "act-red-2",
    eapState: "red",
    title: "Draft public-alert content (draft for authorised publication)",
    description:
      "Generate the bilingual public-alert draft for the affected zone. Explicitly marked draft for authorised publication — see Alert Composer.",
    status: "drafted",
    ownerRole: "District Authority",
    approverRole: "Collector / authorised communicator",
    authorityBoundary:
      "Product drafts a recommendation and alert text only. Publication and any evacuation order require Collector or authorised-communicator sign-off. TerraCascade does not send alerts, order evacuations, or control gates.",
    protocolSource: RED_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-08-09T19:15:00+05:30",
    updatedAt: "2026-08-09T19:15:00+05:30",
    restricted: false,
  },
  {
    id: "act-red-3",
    eapState: "red",
    title: "Flag scenario for District Authority escalation",
    description:
      "Escalate the Red-state scenario to the District Authority and keep the override/approval trail visible on the audit timeline.",
    status: "acknowledged",
    ownerRole: "District Authority",
    approverRole: "Collector / authorised communicator",
    authorityBoundary:
      "Product drafts a recommendation and alert text only. Publication and any evacuation order require Collector or authorised-communicator sign-off. TerraCascade does not send alerts, order evacuations, or control gates.",
    protocolSource: RED_PROTOCOL,
    attentionRequired: true,
    createdAt: "2026-08-09T19:20:00+05:30",
    updatedAt: "2026-08-09T19:32:00+05:30",
    restricted: true,
  },
];

export function actionsForState(state: EapState): ActionItem[] {
  return ACTIONS.filter((a) => a.eapState === state);
}
