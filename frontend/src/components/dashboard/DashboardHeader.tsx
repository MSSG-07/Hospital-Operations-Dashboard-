"use client";

import { removeToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useDashboard } from "./DashboardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  LogOut,
  Clock,
  Wifi,
  Shield,
} from "lucide-react";

export default function DashboardHeader() {
  const router = useRouter();
  const { refreshing, lastRefresh, adminName, refresh } = useDashboard();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-border/50 h-14 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Badge variant="success" className="flex items-center gap-1">
          <Wifi className="w-2.5 h-2.5" /> Live
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Auto-refreshes every 30s
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {lastRefresh.toLocaleTimeString()}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={refreshing}
          className="h-8 px-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3 text-blue-400" />
          {adminName}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 px-2 text-muted-foreground hover:text-red-400"
        >
          <LogOut className="w-3.5 h-3.5" />
        </Button>
      </div>
    </header>
  );
}
