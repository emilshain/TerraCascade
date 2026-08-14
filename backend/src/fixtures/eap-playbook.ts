export interface PlaybookRule {
  id: string;
  state: "blue" | "orange" | "red";
  label: string;
  trigger: {
    description: string;
    status: string;
  };
  productAction: string[];
  ownerRole: string;
  approverRole: string;
  authorityBoundary: string;
  protocolSource: {
    document: string;
    frameworkBasis: string;
    section: string;
    status: string;
  };
}

export const EAP_PLAYBOOK_RULES: PlaybookRule[] = [
  {
    id: "eap-blue",
    state: "blue",
    label: "Blue flood/EAP state",
    trigger: {
      description: "Configured watch scenario",
      status: "demo scenario assumption",
    },
    productAction: [
      "Display flood-extent layer with source/status/limitations label for the configured watch scenario",
      "Run internal inspection checklist (KSEB EPM)",
      "Log internal-notification entry to EOC duty officer — no external or public communication",
    ],
    ownerRole: "KSEB EPM",
    approverRole: "KSEB EPM",
    authorityBoundary:
      "No external or public order may be issued at Blue. Product surfaces monitoring and an internal checklist only; it does not notify anyone outside KSEB.",
    protocolSource: {
      document: "Emergency Action Plan (Tier-I) — Idamalayar Dam, KSEB Dam Safety Organisation (2020-06-03)",
      frameworkBasis:
        "National definition (CWC, Emergency Action Planning for Dams, 2016): 'Internal Alert for BLUE level emergency (monitor and repair)'",
      section:
        "Blue / Internal Alert — exact clause number within the Idamalayar-specific PDF not yet verified; only the national framework definition above is confirmed",
      status: "agency validation required for the dam-specific clause number; framework definition is source-confirmed",
    },
  },
  {
    id: "eap-orange",
    state: "orange",
    label: "Orange flood/EAP state",
    trigger: {
      description: "Rule-curve / controlled-release scenario",
      status: "demo scenario assumption",
    },
    productAction: [
      "Run impact review against the configured controlled-release scenario",
      "Publish hourly internal update to KSEB and District EOC",
      "Surface coordination-readiness checklist (contact lists, staging status) for review",
    ],
    ownerRole: "KSEB + District EOC",
    approverRole: "KSEB EPM / authorised chain",
    authorityBoundary:
      "Product surfaces impact-review data and a readiness checklist only. EPM or the authorised chain decides any coordination or release action — TerraCascade does not decide or trigger releases.",
    protocolSource: {
      document: "Emergency Action Plan (Tier-I) — Idamalayar Dam, KSEB Dam Safety Organisation (2020-06-03)",
      frameworkBasis:
        "National definition (CWC, Emergency Action Planning for Dams, 2016): 'External Alert for ORANGE (prepare to evacuate)'. In Kerala practice an Orange Alert is issued before opening dam shutters, ahead of a Red Alert to the public.",
      section:
        "Orange / External Alert (prepare to evacuate) — exact clause number within the Idamalayar-specific PDF not yet verified; only the national framework definition above is confirmed",
      status: "agency validation required for the dam-specific clause number; framework definition is source-confirmed",
    },
  },
  {
    id: "eap-red",
    state: "red",
    label: "Red flood/EAP state",
    trigger: {
      description: "Large-release / failure scenario",
      status: "demo scenario assumption",
    },
    productAction: [
      "Generate an immediate-evacuation recommendation for District Authority review",
      "Draft public-alert content marked 'draft for authorised publication'",
      "Flag the scenario for District Authority escalation and log the override/approval trail",
    ],
    ownerRole: "District Authority",
    approverRole: "Collector / authorised communicator",
    authorityBoundary:
      "Product drafts a recommendation and alert text only. Publication and any evacuation order require Collector or authorised-communicator sign-off. TerraCascade does not send alerts, order evacuations, or control gates.",
    protocolSource: {
      document: "Emergency Action Plan (Tier-I) — Idamalayar Dam, KSEB Dam Safety Organisation (2020-06-03)",
      frameworkBasis:
        "National definition (CWC, Emergency Action Planning for Dams, 2016): 'External Alert for RED (evacuate immediately)'. In Kerala practice, Red Alert is the final public warning, issued after Orange.",
      section:
        "Red / External Alert (evacuate immediately) — exact clause number within the Idamalayar-specific PDF not yet verified; only the national framework definition above is confirmed",
      status: "agency validation required for the dam-specific clause number; framework definition is source-confirmed",
    },
  },
];
