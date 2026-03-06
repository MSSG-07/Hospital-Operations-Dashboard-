"use client";

import { StressIndexData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Bed,
  Clock,
  Stethoscope,
  Siren,
} from "lucide-react";

const levelConfig = {
  Normal: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "success" as const },
  Busy: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "warning" as const },
  Critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", badge: "danger" as const },
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export default function StressIndexPanel({ data }: { data: StressIndexData }) {
  const config = levelConfig[data.level];
  const TrendIcon = trendIcons[data.trend];

  // Calculate the arc for circular gauge
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <Card className={`card-hover ${config.border} border`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className={`w-4 h-4 ${config.color}`} />
            Hospital Stress Index
          </CardTitle>
          <Badge variant={config.badge}>{data.level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" className="-rotate-90">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${config.color} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${config.color}`}>
                {data.score}
              </span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Bed className="w-3.5 h-3.5" /> Bed Occupancy
              </span>
              <span className="font-medium">{data.bed_occupancy_pct}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> Avg Wait
              </span>
              <span className="font-medium">{data.avg_waiting_time}m</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Stethoscope className="w-3.5 h-3.5" /> Doc Workload
              </span>
              <span className="font-medium">{data.doctor_workload}p</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Siren className="w-3.5 h-3.5" /> Emergencies
              </span>
              <span className="font-medium">{data.emergency_load}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
              <TrendIcon className="w-3 h-3" />
              Trend: {data.trend}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
