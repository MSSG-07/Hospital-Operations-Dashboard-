"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboard } from "./DashboardContext";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  LayoutDashboard,
  Gauge,
  Building2,
  Bell,
  BarChart3,
  HeartPulse,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Full dashboard view",
  },
  {
    label: "Stress Index",
    href: "/dashboard/stress-index",
    icon: Gauge,
    description: "Hospital pressure score",
  },
  {
    label: "Departments",
    href: "/dashboard/departments",
    icon: Building2,
    description: "Department health status",
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    description: "Emergency notifications",
  },
  {
    label: "Workload",
    href: "/dashboard/workload",
    icon: BarChart3,
    description: "Department case load",
  },
  {
    label: "Resources",
    href: "/dashboard/resources",
    icon: HeartPulse,
    description: "Utilization metrics",
  },
  {
    label: "Blood Bank",
    href: "/dashboard/blood-bank",
    icon: Droplets,
    description: "Inventory & levels",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  const alertCount = data?.alerts?.filter((a) => a.severity === "critical").length || 0;

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen flex flex-col border-r border-border/50 bg-[#0b1120] transition-all duration-300 ease-in-out z-40",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border/50 shrink-0">
        <div className="p-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 shrink-0">
          <Activity className="w-4 h-4 text-blue-400" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in">
            <h1 className="text-sm font-bold text-white leading-none whitespace-nowrap">
              Hospital Ops
            </h1>
            <p className="text-[10px] text-muted-foreground whitespace-nowrap">
              Command Center
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r" />
              )}

              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              {!collapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.href === "/dashboard/alerts" && alertCount > 0 && (
                      <Badge variant="danger" className="text-[10px] px-1.5 py-0 animate-pulse">
                        {alertCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 truncate">
                    {item.description}
                  </p>
                </div>
              )}

              {collapsed && item.href === "/dashboard/alerts" && alertCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold animate-pulse">
                  {alertCount}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border/50 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
