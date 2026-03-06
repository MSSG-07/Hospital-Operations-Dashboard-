"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import DepartmentHealthMonitor from "@/components/dashboard/DepartmentHealth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Stethoscope, Bed, Clock, Activity } from "lucide-react";

export default function DepartmentsPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const departments = data.departments;
  const overloaded = departments.filter((d) => d.status === "Overloaded").length;
  const moderate = departments.filter((d) => d.status === "Moderate").length;
  const normal = departments.filter((d) => d.status === "Normal").length;

  const statusConfig = {
    Normal: { dot: "bg-emerald-400", bar: "bg-emerald-500", text: "text-emerald-400", badge: "success" as const },
    Moderate: { dot: "bg-amber-400", bar: "bg-amber-500", text: "text-amber-400", badge: "warning" as const },
    Overloaded: { dot: "bg-red-400", bar: "bg-red-500", text: "text-red-400", badge: "danger" as const },
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/20">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Department Health Monitor</h1>
            <p className="text-sm text-muted-foreground">Live status of all hospital departments</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">{normal} Normal</Badge>
          <Badge variant="warning">{moderate} Moderate</Badge>
          <Badge variant="danger">{overloaded} Overloaded</Badge>
        </div>
      </div>

      {/* Compact overview at top */}
      <DepartmentHealthMonitor data={departments} />

      {/* Detailed cards per department */}
      <h2 className="text-base font-semibold text-white flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-400" /> Detailed View
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept, i) => {
          const config = statusConfig[dept.status];
          return (
            <Card key={dept.name} className="card-hover animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.dot} animate-pulse`} />
                    {dept.name}
                  </CardTitle>
                  <Badge variant={config.badge}>{dept.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Bed occupancy bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> Bed Occupancy</span>
                    <span className={`font-medium ${config.text}`}>{dept.bed_occupancy_pct}%</span>
                  </div>
                  <Progress value={dept.bed_occupancy_pct} className="h-2" indicatorClassName={config.bar} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-secondary/30 rounded-lg p-2.5 text-center">
                    <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{dept.patients_waiting}</p>
                    <p className="text-[10px] text-muted-foreground">Waiting</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2.5 text-center">
                    <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{dept.patients_admitted}</p>
                    <p className="text-[10px] text-muted-foreground">Admitted</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2.5 text-center">
                    <Stethoscope className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{dept.doctors_available}<span className="text-xs text-muted-foreground">/{dept.doctors_total}</span></p>
                    <p className="text-[10px] text-muted-foreground">Doctors</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2.5 text-center">
                    <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <p className="text-lg font-bold">{dept.avg_wait_time}<span className="text-xs text-muted-foreground">m</span></p>
                    <p className="text-[10px] text-muted-foreground">Avg Wait</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center pt-1 border-t border-border/30">
                  {dept.cases_today} cases today
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
