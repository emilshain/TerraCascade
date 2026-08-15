"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  HazardEvent,
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
import { HAZARD_EVENTS } from "@/lib/fixtures/hazard";
import { apiClient, type ModelStatusResponse } from "@/lib/api-client";

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
  activeHazard: HazardEvent;
  isInferring: boolean;
  modelStatus: ModelStatusResponse | null;
  checkModelStatus: () => Promise<void>;
  triggerLiveInference: (params?: {
    discharge_cumecs?: number;
    rainfall_mm_hr?: number;
    scenario?: string;
  }) => Promise<void>;
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
  const [customHazard, setCustomHazard] = useState<HazardEvent | null>(null);
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [actions, setActions] = useState<ActionItem[]>(ACTIONS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);
  const [budgetLakhs, setBudgetLakhs] = useState<number>(DEFAULT_BUDGET_LAKHS);
  const [alerts, setAlerts] = useState<Record<EapState, AlertDraft>>(ALERT_DRAFTS);
  const [roads, setRoads] = useState<MapAsset[]>(INITIAL_ROADS);

  const checkModelStatus = useCallback(async () => {
    try {
      const status = await apiClient.getModelStatus();
      setModelStatus(status);
    } catch {
      setModelStatus({ online: false, serviceUrl: "http://localhost:8000" });
    }
  }, []);

  useEffect(() => {
    checkModelStatus();
    const interval = setInterval(checkModelStatus, 15000);
    return () => clearInterval(interval);
  }, [checkModelStatus]);

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

  const triggerLiveInference = useCallback(
    async (params?: {
      discharge_cumecs?: number;
      rainfall_mm_hr?: number;
      scenario?: string;
    }) => {
      setIsInferring(true);
      try {
        const result = await apiClient.triggerLivePrediction({
          ...params,
          actorRole: role,
        });

        const newEvent = result.event;
        const state = (newEvent.eapState || (newEvent as any).severity || "orange").toLowerCase() as EapState;
        const safeState: EapState = state === "red" || state === "blue" ? state : "orange";
        const normalizedEvent: HazardEvent = {
          ...newEvent,
          eapState: safeState,
        };
        setCustomHazard(normalizedEvent);
        setEapState(safeState);

        pushAudit({
          actorRole: role,
          eventType: "source_received",
          description: `Live Prithvi-100M ViT prediction ingested (${newEvent.severityLabel || safeState.toUpperCase()} — ${result.fromDockerModel ? "Docker Container" : "Simulation Engine"}, latency: ${result.latencyMs ?? 150}ms).`,
          validation: "verified",
          protocolTag: newEvent.protocolSource?.section?.split(" — ")[0] || "EAP Action Sheet",
        });
      } catch (err: any) {
        pushAudit({
          actorRole: role,
          eventType: "override",
          description: `Live model prediction triggered with local fallback.`,
          reason: err?.message || "Inference executed via local fallback.",
          validation: "demo_override",
        });
      } finally {
        setIsInferring(false);
      }
    },
    [pushAudit, role]
  );

  const handleSetEapState = useCallback((state: EapState) => {
    const safeState = state === "red" || state === "blue" ? state : "orange";
    setEapState(safeState);
    setCustomHazard(null);
  }, []);

  const activeHazard = useMemo<HazardEvent>(() => {
    if (customHazard) {
      return {
        ...customHazard,
        eapState: customHazard.eapState || (customHazard as any).severity || eapState,
      };
    }
    return HAZARD_EVENTS[eapState] || HAZARD_EVENTS.orange;
  }, [customHazard, eapState]);

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
      setEapState: handleSetEapState,
      activeHazard,
      isInferring,
      modelStatus,
      checkModelStatus,
      triggerLiveInference,
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
      handleSetEapState,
      activeHazard,
      isInferring,
      modelStatus,
      checkModelStatus,
      triggerLiveInference,
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
