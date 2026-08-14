"use client";

import type { ComponentType } from "react";
import { useDemoStore } from "@/lib/store/demo-store";
import { ROLES } from "@/lib/fixtures/roles";
import { PageHeader } from "@/components/shared/PageHeader";
import { SeverityBadge } from "@/components/shared/SeverityBadge";
import { EpmDashboard } from "@/components/dashboards/EpmDashboard";
import { EocDashboard } from "@/components/dashboards/EocDashboard";
import { CollectorDashboard } from "@/components/dashboards/CollectorDashboard";
import { BudgetPlannerDashboard } from "@/components/dashboards/BudgetPlannerDashboard";
import type { Role } from "@/lib/types";

const DASHBOARD_BY_ROLE: Record<Role, ComponentType> = {
  kseb_epm: EpmDashboard,
  district_eoc: EocDashboard,
  district_collector: CollectorDashboard,
  budget_planner: BudgetPlannerDashboard,
};

export default function DashboardPage() {
  const { role, eapState } = useDemoStore();
  const roleDef = ROLES.find((r) => r.id === role) ?? ROLES[0];
  const Dashboard = DASHBOARD_BY_ROLE[role];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title={roleDef.label}
        description={roleDef.focus}
        actions={<SeverityBadge state={eapState} />}
      />
      <Dashboard />
    </div>
  );
}
