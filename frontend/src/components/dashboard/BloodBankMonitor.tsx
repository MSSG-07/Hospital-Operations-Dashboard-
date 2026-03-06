"use client";

import { BloodBankStatusData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, AlertTriangle } from "lucide-react";

const levelConfig = {
  Safe: {
    badge: "success" as const,
    barColor: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  Moderate: {
    badge: "warning" as const,
    barColor: "bg-amber-500",
    textColor: "text-amber-400",
  },
  Critical: {
    badge: "danger" as const,
    barColor: "bg-red-500",
    textColor: "text-red-400",
  },
};

export default function BloodBankMonitor({
  data,
}: {
  data: BloodBankStatusData;
}) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Droplets className="w-4 h-4 text-red-400" />
            Blood Bank Monitor
          </CardTitle>
          <Badge variant="outline">{data.total_units} units</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Blood type grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {data.inventory.map((item, i) => {
            const config = levelConfig[item.level];
            return (
              <div
                key={item.blood_type}
                className="p-3 rounded-lg border border-border/30 bg-secondary/20 text-center animate-fade-in hover:bg-secondary/40 transition-all"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="text-lg font-bold mb-1">{item.blood_type}</div>
                <div className={`text-xl font-bold ${config.textColor} mb-1`}>
                  {item.units_available}
                </div>
                <div className="text-[10px] text-muted-foreground mb-2">
                  units available
                </div>
                <Progress
                  value={item.percentage}
                  className="h-1.5"
                  indicatorClassName={config.barColor}
                />
                <Badge
                  variant={config.badge}
                  className="mt-2 text-[10px] px-1.5 py-0"
                >
                  {item.level}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              Blood Bank Alerts
            </p>
            {data.alerts.map((alert, i) => (
              <div
                key={i}
                className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                {alert}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
