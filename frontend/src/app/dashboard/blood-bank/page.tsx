"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import BloodBankMonitor from "@/components/dashboard/BloodBankMonitor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const levelConfig = {
  Safe: { bar: "bg-emerald-500", text: "text-emerald-400", badge: "success" as const },
  Moderate: { bar: "bg-amber-500", text: "text-amber-400", badge: "warning" as const },
  Critical: { bar: "bg-red-500", text: "text-red-400", badge: "danger" as const },
};

export default function BloodBankPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const bb = data.blood_bank;
  const safe = bb.inventory.filter((i) => i.level === "Safe").length;
  const moderate = bb.inventory.filter((i) => i.level === "Moderate").length;
  const critical = bb.inventory.filter((i) => i.level === "Critical").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${critical > 0 ? "bg-red-600/15 border-red-500/20" : "bg-blue-600/15 border-blue-500/20"}`}>
            <Droplets className={`w-5 h-5 ${critical > 0 ? "text-red-400" : "text-blue-400"}`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Blood Bank Monitor</h1>
            <p className="text-sm text-muted-foreground">Inventory levels by blood type</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">{bb.total_units} total units</Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{safe}</p>
              <p className="text-xs text-muted-foreground">Safe level types</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <TrendingDown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{moderate}</p>
              <p className="text-xs text-muted-foreground">Moderate level types</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{critical}</p>
              <p className="text-xs text-muted-foreground">Critical level types</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monitor widget */}
      <BloodBankMonitor data={bb} />

      {/* Detailed table view */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-base">Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bb.inventory.map((item, i) => {
              const config = levelConfig[item.level];
              return (
                <div key={item.blood_type} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 border border-border/30 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold">{item.blood_type}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.units_available} units</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Threshold: {item.threshold}</span>
                        <Badge variant={config.badge} className="text-[10px]">{item.level}</Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" indicatorClassName={config.bar} />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts section */}
      {bb.alerts.length > 0 && (
        <Card className="card-hover border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" /> Active Blood Bank Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {bb.alerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{alert}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
