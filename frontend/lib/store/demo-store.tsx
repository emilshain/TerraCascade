"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  ActionItem,
  ActionStatus,
  AlertDraft,
  AuditEntry,
  EapState,
  MapAsset,
  Role,
} from "@/lib/types";
import { ACTION_STATUS_ORDER } from "@/lib/types";
import { ACTIONS } from "@/lib/fixtures/actions";
import { ALERT_DRAFTS } from "@/lib/fixtures/alerts";
import { INITIAL_AUDIT_LOG } from "@/lib/fixtures/audit";
import { DEFAULT_ROLE } from "@/lib/fixtures/roles";
import { DEFAULT_BUDGET_LAKHS } from "@/lib/fixtures/budget";
import { INITIAL_ROADS } from "@/lib/fixtures/assets";

const DEFAULT_EAP_STATE: EapState = "orange";

const ROLE_MATCH_TOKENS: Record<Role, string[]> = {
  kseb_epm: ["kseb epm", "kseb"],
  district_eoc: ["district eoc"],
  district_collector: ["district collector", "collector", "authorised communicator"],
  budget_planner: ["budget planner"],
};

export function roleCanActOn(role: Role, roleText: string): boolean {
  const haystack = roleText.toLowerCase();
  return ROLE_MATCH_TOKENS[role].some((token) => haystack.includes(token));
}

function nextAuditEventType(newStatus: ActionStatus): AuditEntry["eventType"] | null {
  switch (newStatus) {
    case "acknowledged":
      return "approval";
    case "in_progress":
    case "complete":
      return "acknowledgement";
    default:
      return null;
  }
}

interface DemoStoreValue {
  role: Role;
  setRole: (role: Role) => void;
  eapState: EapState;
  setEapState: (state: EapState) => void;
  actions: ActionItem[];
  advanceAction: (actionId: string) => void;
  overrideAction: (actionId: string, newStatus: ActionStatus, reason: string) => void;
  auditLog: AuditEntry[];
  budgetLakhs: number;
  setBudgetLakhs: (value: number) => void;
  alerts: Record<EapState, AlertDraft>;
  approveAlert: (eapState: EapState) => void;
  roads: MapAsset[];
  toggleRouteBlocked: (roadId: string) => void;
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(DEFAULT_ROLE);
  const [eapState, setEapState] = useState<EapState>(DEFAULT_EAP_STATE);
  const [actions, setActions] = useState<ActionItem[]>(ACTIONS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);
  const [budgetLakhs, setBudgetLakhs] = useState<number>(DEFAULT_BUDGET_LAKHS);
  const [alerts, setAlerts] = useState<Record<EapState, AlertDraft>>(ALERT_DRAFTS);
  const [roads, setRoads] = useState<MapAsset[]>(INITIAL_ROADS);

  const pushAudit = useCallback((entry: Omit<AuditEntry, "id" | "timestamp">) => {
    setAuditLog((prev) => [
      ...prev,
      {
        ...entry,
        id: `audit-live-${prev.length + 1}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const advanceAction = useCallback(
    (actionId: string) => {
      setActions((prev) =>
        prev.map((action) => {
          if (action.id !== actionId) return action;
          const currentIdx = ACTION_STATUS_ORDER.indexOf(action.status);
          const nextStatus = ACTION_STATUS_ORDER[currentIdx + 1];
          if (!nextStatus) return action;
          const eventType = nextAuditEventType(nextStatus);
          if (eventType) {
            pushAudit({
              actorRole: role,
              eventType,
              description: `"${action.title}" moved to ${nextStatus.replace("_", " ")}.`,
              relatedActionId: action.id,
              validation: "verified",
              protocolTag: `${action.protocolSource.document} - ${action.protocolSource.section.split(" — ")[0]}`,
            });
          }
          return { ...action, status: nextStatus, updatedAt: new Date().toISOString() };
        })
      );
    },
    [pushAudit, role]
  );

  const overrideAction = useCallback(
    (actionId: string, newStatus: ActionStatus, reason: string) => {
      setActions((prev) =>
        prev.map((action) => {
          if (action.id !== actionId) return action;
          pushAudit({
            actorRole: role,
            eventType: "override",
            description: `"${action.title}" manually set to ${newStatus.replace("_", " ")}.`,
            relatedActionId: action.id,
            reason,
            validation: "demo_override",
            protocolTag: `${action.protocolSource.document} - ${action.protocolSource.section.split(" — ")[0]}`,
          });
          return { ...action, status: newStatus, updatedAt: new Date().toISOString() };
        })
      );
    },
    [pushAudit, role]
  );

  const approveAlert = useCallback(
    (state: EapState) => {
      setAlerts((prev) => ({
        ...prev,
        [state]: { ...prev[state], approvalState: "approved" },
      }));
      pushAudit({
        actorRole: role,
        eventType: "approval",
        description: `Public-alert draft for ${state} state approved for authorised publication.`,
        validation: "verified",
      });
    },
    [pushAudit, role]
  );

  const toggleRouteBlocked = useCallback(
    (roadId: string) => {
      setRoads((prev) =>
        prev.map((road) => {
          if (road.id !== roadId) return road;
          const nextBlocked = !road.blocked;
          pushAudit({
            actorRole: role,
            eventType: "override",
            description: `"${road.name}" marked ${nextBlocked ? "blocked" : "open"} by District EOC route-blocker control.`,
            reason: `Manual route-status override: District EOC set this segment to ${nextBlocked ? "blocked" : "open"}.`,
            validation: "demo_override",
          });
          return { ...road, blocked: nextBlocked };
        })
      );
    },
    [pushAudit, role]
  );

  const value = useMemo<DemoStoreValue>(
    () => ({
      role,
      setRole,
      eapState,
      setEapState,
      actions,
      advanceAction,
      overrideAction,
      auditLog,
      budgetLakhs,
      setBudgetLakhs,
      alerts,
      approveAlert,
      roads,
      toggleRouteBlocked,
    }),
    [
      role,
      eapState,
      actions,
      advanceAction,
      overrideAction,
      auditLog,
      budgetLakhs,
      alerts,
      approveAlert,
      roads,
      toggleRouteBlocked,
    ]
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) {
    throw new Error("useDemoStore must be used within a DemoStoreProvider");
  }
  return ctx;
}
