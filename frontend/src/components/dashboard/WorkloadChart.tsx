"use client";

import { DepartmentWorkloadData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

function getBarColor(utilization: number): string {
  if (utilization >= 80) return "#ef4444";
  if (utilization >= 60) return "#f59e0b";
  return "#22c55e";
}

interface TooltipPayloadItem {
  payload?: DepartmentWorkloadData;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-1">
          {data.department}
        </p>
        <div className="space-y-0.5 text-xs text-muted-foreground">
          <p>Cases: <span className="text-foreground font-medium">{data.cases}</span></p>
          <p>Capacity: <span className="text-foreground font-medium">{data.capacity}</span></p>
          <p>Utilization: <span className="text-foreground font-medium">{data.utilization_pct}%</span></p>
        </div>
      </div>
    );
  }
  return null;
}

export default function WorkloadChart({
  data,
}: {
  data: DepartmentWorkloadData[];
}) {
  // Shorten department names for x-axis
  const chartData = data.map((d) => ({
    ...d,
    shortName:
      d.department.length > 8
        ? d.department.substring(0, 7) + "."
        : d.department,
  }));

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Department Workload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 20, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="shortName"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} />
              <Bar dataKey="cases" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.utilization_pct)}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> &lt;60%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 60-80%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500" /> &gt;80%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
