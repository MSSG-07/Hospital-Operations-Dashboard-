"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getDashboardData,
  getAdminName,
  removeToken,
  getToken,
  type DashboardDataResponse,
} from "@/lib/api";
import StressIndexPanel from "@/components/dashboard/StressIndex";
import DepartmentHealthMonitor from "@/components/dashboard/DepartmentHealth";
import EmergencyAlertPanel from "@/components/dashboard/EmergencyAlerts";
import WorkloadChart from "@/components/dashboard/WorkloadChart";
import ResourceUtilizationPanel from "@/components/dashboard/ResourceUtilization";
import BloodBankMonitor from "@/components/dashboard/BloodBankMonitor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  RefreshCw,
  LogOut,
  Clock,
  Wifi,
  Shield,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [adminName, setAdminName] = useState("Admin");

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const result = await getDashboardData();
      setData(result);
      setLastRefresh(new Date());
    } catch {
      // If unauthorized, redirect to login
      router.push("/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    // Check auth
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setAdminName(getAdminName());
    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData, router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4 animate-pulse-glow">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">
                  Hospital Ops
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  Command Center
                </p>
              </div>
            </div>
            <Badge variant="success" className="hidden sm:flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5" /> Live
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {lastRefresh.toLocaleTimeString()}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="h-8 px-2"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
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
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Row 1: Resources overview */}
        <ResourceUtilizationPanel data={data.resource_utilization} />

        {/* Row 2: Stress Index + Alerts + Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StressIndexPanel data={data.stress_index} />
          <EmergencyAlertPanel data={data.alerts} />
          <DepartmentHealthMonitor data={data.departments} />
        </div>

        {/* Row 3: Workload Chart + Blood Bank */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WorkloadChart data={data.department_workload} />
          <BloodBankMonitor data={data.blood_bank} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground/50 py-4 border-t border-border/20">
          Hospital Operations Intelligence Dashboard • Data refreshes every 30s •
          Last updated: {new Date(data.last_updated).toLocaleString()}
        </div>
      </main>
    </div>
  );
}
