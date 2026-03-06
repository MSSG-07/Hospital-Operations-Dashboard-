"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getDashboardData,
  getAdminName,
  getToken,
  type DashboardDataResponse,
} from "@/lib/api";

interface DashboardContextType {
  data: DashboardDataResponse | null;
  loading: boolean;
  refreshing: boolean;
  lastRefresh: Date;
  adminName: string;
  refresh: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  refreshing: false,
  lastRefresh: new Date(),
  adminName: "Admin",
  refresh: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
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
      router.push("/login");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setAdminName(getAdminName());
    fetchData();

    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData, router]);

  return (
    <DashboardContext.Provider
      value={{ data, loading, refreshing, lastRefresh, adminName, refresh: () => fetchData(true) }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
