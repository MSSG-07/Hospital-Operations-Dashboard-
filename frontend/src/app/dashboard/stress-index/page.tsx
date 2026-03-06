"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import StressIndexPanel from "@/components/dashboard/StressIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gauge, TrendingUp, TrendingDown, Minus, Bed, Clock, Stethoscope, Siren, Info } from "lucide-react";

export default function StressIndexPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const si = data.stress_index;

  const factors = [
    {
      label: "Bed Occupancy",
      value: si.bed_occupancy_pct,
      max: 100,
      unit: "%",
      icon: Bed,
      weight: "30%",
      color: si.bed_occupancy_pct > 85 ? "bg-red-500" : si.bed_occupancy_pct > 65 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      label: "Avg Waiting Time",
      value: Math.min(si.avg_waiting_time, 120),
      max: 120,
      unit: "min",
      icon: Clock,
      weight: "25%",
      color: si.avg_waiting_time > 60 ? "bg-red-500" : si.avg_waiting_time > 30 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      label: "Doctor Workload",
      value: Math.min(si.doctor_workload, 15),
      max: 15,
      unit: "patients/doc",
      icon: Stethoscope,
      weight: "25%",
      color: si.doctor_workload > 10 ? "bg-red-500" : si.doctor_workload > 6 ? "bg-amber-500" : "bg-emerald-500",
    },
    {
      label: "Emergency Load",
      value: Math.min(si.emergency_load, 30),
      max: 30,
      unit: "cases",
      icon: Siren,
      weight: "20%",
      color: si.emergency_load > 20 ? "bg-red-500" : si.emergency_load > 10 ? "bg-amber-500" : "bg-emerald-500",
    },
  ];

  const TrendIcon = si.trend === "up" ? TrendingUp : si.trend === "down" ? TrendingDown : Minus;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/20">
          <Gauge className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Hospital Stress Index</h1>
          <p className="text-sm text-muted-foreground">Overall operational pressure assessment</p>
        </div>
      </div>

      {/* Main panel */}
      <StressIndexPanel data={si} />

      {/* Detailed breakdown */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            Factor Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {factors.map((f) => {
            const pct = (f.value / f.max) * 100;
            return (
              <div key={f.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <f.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{f.label}</span>
                    <Badge variant="outline" className="text-[10px]">Weight: {f.weight}</Badge>
                  </div>
                  <span className="text-sm font-bold">
                    {f.label === "Avg Waiting Time" ? si.avg_waiting_time.toFixed(1) : f.value} {f.unit}
                  </span>
                </div>
                <Progress value={pct} className="h-2.5" indicatorClassName={f.color} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Trend + Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Current Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${si.trend === "up" ? "bg-red-500/15 text-red-400" : si.trend === "down" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                <TrendIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold capitalize">{si.trend}</p>
                <p className="text-xs text-muted-foreground">
                  {si.trend === "up" ? "Stress is increasing — monitor closely" : si.trend === "down" ? "Stress is decreasing — situation improving" : "Stress level is stable"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="text-emerald-400 font-medium">0-49 Normal:</span> Hospital operating within safe limits.</p>
              <p><span className="text-amber-400 font-medium">50-74 Busy:</span> Elevated pressure — proactive resource allocation recommended.</p>
              <p><span className="text-red-400 font-medium">75-100 Critical:</span> Immediate attention required — activate contingency plans.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
