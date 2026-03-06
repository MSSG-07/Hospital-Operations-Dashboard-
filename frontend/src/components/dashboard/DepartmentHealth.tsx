"use client";

import { DepartmentHealthData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Stethoscope,
  Clock,
  Bed,
} from "lucide-react";

const statusConfig = {
  Normal: { badge: "success" as const, dotColor: "bg-emerald-400", barColor: "bg-emerald-500" },
  Moderate: { badge: "warning" as const, dotColor: "bg-amber-400", barColor: "bg-amber-500" },
  Overloaded: { badge: "danger" as const, dotColor: "bg-red-400", barColor: "bg-red-500" },
};

export default function DepartmentHealthMonitor({
  data,
}: {
  data: DepartmentHealthData[];
}) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Department Health Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {data.map((dept, i) => {
            const config = statusConfig[dept.status];
            return (
              <div
                key={dept.name}
                className="p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {dept.name}
                    </span>
                  </div>
                  <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">
                    {dept.status}
                  </Badge>
                </div>

                {/* Bed occupancy bar */}
                <Progress
                  value={dept.bed_occupancy_pct}
                  className="h-1.5 mb-2"
                  indicatorClassName={config.barColor}
                />

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{dept.patients_waiting} waiting</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    <span>{dept.doctors_available}/{dept.doctors_total}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>{dept.bed_occupancy_pct}% beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{dept.avg_wait_time}m wait</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
