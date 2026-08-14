import type { RoleDefinition } from "@/lib/types";

export const ROLES: RoleDefinition[] = [
  {
    id: "kseb_epm",
    label: "KSEB Emergency Preparedness Manager",
    shortLabel: "KSEB EPM",
    description:
      "Owns Blue-state monitoring and inspection actions; approves Orange-state readiness actions.",
    canSeeRestricted: true,
  },
  {
    id: "district_eoc",
    label: "District Emergency Operations Centre",
    shortLabel: "District EOC",
    description:
      "Co-owns Orange-state coordination actions; receives KSEB hourly updates.",
    canSeeRestricted: true,
  },
  {
    id: "district_authority",
    label: "District Authority",
    shortLabel: "District Authority",
    description:
      "Owns Red-state escalation; the Collector or an authorised communicator signs off on any public alert.",
    canSeeRestricted: true,
  },
  {
    id: "public_observer",
    label: "Public / Observer view",
    shortLabel: "Observer",
    description:
      "Shared status only — sees hazard state, action progress and alert drafts, not internal authority-boundary text or override reasons.",
    canSeeRestricted: false,
  },
];

export const DEFAULT_ROLE = "kseb_epm";
