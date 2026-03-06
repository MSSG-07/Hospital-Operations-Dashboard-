"use client";

import { AlertData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Bell,
  Clock,
} from "lucide-react";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    badge: "danger" as const,
    bg: "bg-red-500/5",
    border: "border-red-500/20",
    iconColor: "text-red-400",
  },
  warning: {
    icon: AlertCircle,
    badge: "warning" as const,
    bg: "bg-amber-500/5",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  info: {
    icon: Info,
    badge: "info" as const,
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
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

export default function EmergencyAlertPanel({
  data,
}: {
  data: AlertData[];
}) {
  const criticalCount = data.filter((a) => a.severity === "critical").length;

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className={`w-4 h-4 ${criticalCount > 0 ? "text-red-400 animate-pulse" : "text-amber-400"}`} />
            Emergency Alerts
          </CardTitle>
          <div className="flex gap-1.5">
            {criticalCount > 0 && (
              <Badge variant="danger" className="animate-pulse">
                {criticalCount} Critical
              </Badge>
            )}
            <Badge variant="outline">{data.length} Total</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No active alerts</p>
            </div>
          ) : (
            data.map((alert, i) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${config.border} ${config.bg} animate-slide-in`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${config.bg}`}>
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-sm font-medium truncate">
                          {alert.title}
                        </h4>
                        <Badge variant={config.badge} className="text-[10px] flex-shrink-0">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        {alert.department && (
                          <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                            {alert.department}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {timeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
