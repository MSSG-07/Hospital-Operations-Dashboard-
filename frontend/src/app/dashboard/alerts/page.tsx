"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import EmergencyAlertPanel from "@/components/dashboard/EmergencyAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ShieldAlert,
  Building2,
} from "lucide-react";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    badge: "danger" as const,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    iconColor: "text-red-400",
    label: "Critical",
  },
  warning: {
    icon: AlertCircle,
    badge: "warning" as const,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    label: "Warning",
  },
  info: {
    icon: Info,
    badge: "info" as const,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    label: "Info",
  },
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

export default function AlertsPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const alerts = data.alerts;
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const infoCount = alerts.filter((a) => a.severity === "info").length;

  // Group by department
  const deptAlerts: Record<string, typeof alerts> = {};
  alerts.forEach((alert) => {
    const key = alert.department || "General";
    if (!deptAlerts[key]) deptAlerts[key] = [];
    deptAlerts[key].push(alert);
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${criticalCount > 0 ? "bg-red-600/15 border-red-500/20" : "bg-blue-600/15 border-blue-500/20"}`}>
            <Bell className={`w-5 h-5 ${criticalCount > 0 ? "text-red-400 animate-pulse" : "text-blue-400"}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Emergency Alert Panel</h1>
            <p className="text-sm text-muted-foreground">Operational alerts & threshold notifications</p>
          </div>
        </div>
        <div className="flex gap-2">
          {criticalCount > 0 && <Badge variant="danger" className="animate-pulse">{criticalCount} Critical</Badge>}
          {warningCount > 0 && <Badge variant="warning">{warningCount} Warning</Badge>}
          {infoCount > 0 && <Badge variant="info">{infoCount} Info</Badge>}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {([
          { severity: "critical" as const, count: criticalCount, desc: "Require immediate action" },
          { severity: "warning" as const, count: warningCount, desc: "Monitor & prepare response" },
          { severity: "info" as const, count: infoCount, desc: "Informational notices" },
        ]).map((item) => {
          const config = severityConfig[item.severity];
          const Icon = config.icon;
          return (
            <Card key={item.severity} className={`card-hover border ${config.border}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${config.bg}`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{config.label} alerts</p>
                  <p className="text-[10px] text-muted-foreground/70">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compact panel */}
      <EmergencyAlertPanel data={alerts} />

      {/* Grouped by department */}
      <h2 className="text-base font-semibold text-white flex items-center gap-2">
        <Building2 className="w-4 h-4 text-blue-400" /> Alerts by Department
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(deptAlerts).map(([dept, dAlerts]) => (
          <Card key={dept} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                  {dept}
                </span>
                <Badge variant="outline">{dAlerts.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dAlerts.map((alert) => {
                const config = severityConfig[alert.severity];
                const Icon = config.icon;
                return (
                  <div key={alert.id} className={`p-2.5 rounded-lg border ${config.border} ${config.bg} flex items-start gap-2.5`}>
                    <Icon className={`w-4 h-4 ${config.iconColor} mt-0.5 shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">{alert.severity}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{timeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
