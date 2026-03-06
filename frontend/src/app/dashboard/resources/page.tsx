"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import ResourceUtilizationPanel from "@/components/dashboard/ResourceUtilization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  HeartPulse,
  Users,
  Stethoscope,
  CalendarCheck,
  Siren,
  Bed,
  Clock,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function ResourcesPage() {
  const { data } = useDashboard();
  if (!data) return null;

  const res = data.resource_utilization;

  const bedUtilColor = res.bed_occupancy_rate >= 85 ? "bg-red-500" : res.bed_occupancy_rate >= 65 ? "bg-amber-500" : "bg-emerald-500";
  const apptCompletionRate = res.appointments_today > 0 ? ((res.appointments_completed / res.appointments_today) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/20">
          <HeartPulse className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Resource Utilization</h1>
          <p className="text-sm text-muted-foreground">Key operational metrics snapshot</p>
        </div>
      </div>

      {/* Quick overview */}
      <ResourceUtilizationPanel data={res} />

      {/* Detailed panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bed Utilization */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bed className="w-4 h-4 text-amber-400" /> Bed Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{res.bed_occupancy_rate}%</p>
                <p className="text-xs text-muted-foreground">Occupancy Rate</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{res.occupied_beds} <span className="text-sm text-muted-foreground">/ {res.total_beds}</span></p>
                <p className="text-xs text-muted-foreground">Beds occupied</p>
              </div>
            </div>
            <Progress value={res.bed_occupancy_rate} className="h-3" indicatorClassName={bedUtilColor} />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-emerald-400">{res.total_beds - res.occupied_beds}</p>
                <p className="text-[10px] text-muted-foreground">Available</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-amber-400">{res.occupied_beds}</p>
                <p className="text-[10px] text-muted-foreground">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-400" /> Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{res.appointments_today}</p>
                <p className="text-xs text-muted-foreground">Total Today</p>
              </div>
              <div className="text-right">
                <Badge variant="success">{apptCompletionRate}% completed</Badge>
              </div>
            </div>
            <Progress value={parseFloat(apptCompletionRate as string)} className="h-3" indicatorClassName="bg-purple-500" />
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-emerald-400">{res.appointments_completed}</p>
                <p className="text-[10px] text-muted-foreground">Completed</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-blue-400">{res.appointments_today - res.appointments_completed}</p>
                <p className="text-[10px] text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" /> Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <Stethoscope className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{res.doctors_on_duty}</p>
                <p className="text-xs text-muted-foreground">Doctors On Duty</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 text-center">
                <UserCheck className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{res.patients_discharged_today}</p>
                <p className="text-xs text-muted-foreground">Discharged Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient & Emergency */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Patients & Emergencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                <p className="text-xl font-bold">{res.total_patients_today}</p>
                <p className="text-[10px] text-muted-foreground">Patients Today</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Siren className="w-5 h-5 text-red-400 mx-auto mb-1.5" />
                <p className="text-xl font-bold">{res.emergency_cases}</p>
                <p className="text-[10px] text-muted-foreground">Emergencies</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                <p className="text-xl font-bold">{res.avg_waiting_time}<span className="text-xs">m</span></p>
                <p className="text-[10px] text-muted-foreground">Avg Wait</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
