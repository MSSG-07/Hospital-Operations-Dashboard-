"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import WorkloadChart from "@/components/dashboard/WorkloadChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function WorkloadPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const workload = data.department_workload;
  const highLoad = workload.filter((w) => w.utilization_pct >= 80);
  const medLoad = workload.filter((w) => w.utilization_pct >= 60 && w.utilization_pct < 80);
  const lowLoad = workload.filter((w) => w.utilization_pct < 60);

  const totalCases = workload.reduce((sum, w) => sum + w.cases, 0);
  const avgUtilization = (workload.reduce((sum, w) => sum + w.utilization_pct, 0) / workload.length).toFixed(1);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/20">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Department Workload</h1>
            <p className="text-sm text-muted-foreground">Case distribution and capacity utilization</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{totalCases} total cases</Badge>
          <Badge variant="outline">Avg {avgUtilization}%</Badge>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highLoad.length}</p>
              <p className="text-xs text-muted-foreground">High Load (&gt;80%)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{medLoad.length}</p>
              <p className="text-xs text-muted-foreground">Medium Load (60-80%)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowLoad.length}</p>
              <p className="text-xs text-muted-foreground">Normal (&lt;60%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <WorkloadChart data={workload} />

      {/* Detailed table-like view */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-base">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workload.map((w, i) => {
              const color = w.utilization_pct >= 80 ? "bg-red-500" : w.utilization_pct >= 60 ? "bg-amber-500" : "bg-emerald-500";
              const textColor = w.utilization_pct >= 80 ? "text-red-400" : w.utilization_pct >= 60 ? "text-amber-400" : "text-emerald-400";
              return (
                <div key={w.department} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="w-28 text-sm font-medium truncate shrink-0">{w.department}</span>
                  <div className="flex-1">
                    <Progress value={w.utilization_pct} className="h-3" indicatorClassName={color} />
                  </div>
                  <span className="w-12 text-right text-sm font-medium shrink-0">{w.cases}</span>
                  <span className={`w-14 text-right text-sm font-bold shrink-0 ${textColor}`}>{w.utilization_pct}%</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border/30 px-1">
            <span>Department</span>
            <span className="ml-auto mr-16">Cases</span>
            <span>Utilization</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
