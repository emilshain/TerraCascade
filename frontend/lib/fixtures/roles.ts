import type { RoleDefinition } from "@/lib/types";

export const ROLES: RoleDefinition[] = [
  {
    id: "kseb_epm",
    label: "KSEB Emergency Preparedness Manager",
    shortLabel: "KSEB EPM",
    focus: "Dam safety monitoring, gate operational logic, and technical EAP execution.",
    description:
      "Owns Blue-state monitoring and inspection actions; approves Orange-state readiness actions; escalates Red-state technical findings.",
  },
  {
    id: "district_eoc",
    label: "District Emergency Operations Centre Coordinator",
    shortLabel: "District EOC",
    focus: "Inter-agency resource management, downstream asset protection, and logistics.",
    description:
      "Co-owns Orange-state coordination actions; tracks the cascade dependency chain, resource readiness, and route status.",
  },
  {
    id: "district_collector",
    label: "District Collector (Authorised Communicator)",
    shortLabel: "District Collector",
    focus: "Public alerting and community-level hazard warning.",
    description:
      "Owns Red-state escalation; the only role that may approve a public-alert draft for authorised publication.",
  },
  {
    id: "budget_planner",
    label: "Disaster Mitigation Budget Planner",
    shortLabel: "Budget Planner",
    focus: "Turning a fixed regional mitigation budget into an explainable, optimized project portfolio.",
    description:
      "Owns the mitigation budget portfolio — reviews the optimizer's selected/excluded project lists and rationale.",
  },
];

export const DEFAULT_ROLE = "kseb_epm";
