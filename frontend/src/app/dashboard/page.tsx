"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import StressIndexPanel from "@/components/dashboard/StressIndex";
import DepartmentHealthMonitor from "@/components/dashboard/DepartmentHealth";
import EmergencyAlertPanel from "@/components/dashboard/EmergencyAlerts";
import WorkloadChart from "@/components/dashboard/WorkloadChart";
import ResourceUtilizationPanel from "@/components/dashboard/ResourceUtilization";
import BloodBankMonitor from "@/components/dashboard/BloodBankMonitor";

export default function DashboardPage() {
  const { data } = useDashboard();

  if (!data) return null;

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Row 1: Resources overview */}
      <ResourceUtilizationPanel data={data.resource_utilization} />

      {/* Row 2: Stress Index + Alerts + Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StressIndexPanel data={data.stress_index} />
        <EmergencyAlertPanel data={data.alerts} />
        <DepartmentHealthMonitor data={data.departments} />
      </div>

      {/* Row 3: Workload Chart + Blood Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WorkloadChart data={data.department_workload} />
        <BloodBankMonitor data={data.blood_bank} />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground/50 py-4 border-t border-border/20">
        Hospital Operations Intelligence Dashboard • Data refreshes every 30s •
        Last updated: {new Date(data.last_updated).toLocaleString()}
      </div>
    </div>
  );
}
