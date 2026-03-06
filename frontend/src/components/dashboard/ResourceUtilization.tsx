"use client";

import { ResourceUtilizationData } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Siren,
  Bed,
  Clock,
  UserCheck,
  CalendarClock,
  Activity,
} from "lucide-react";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  delay: number;
}

function MetricCard({ icon: Icon, label, value, subtext, color, delay }: MetricCardProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
        {subtext && (
          <p className="text-[10px] text-muted-foreground/70">{subtext}</p>
        )}
      </div>
    </div>
  );
}

export default function ResourceUtilizationPanel({
  data,
}: {
  data: ResourceUtilizationData;
}) {
  const metrics: MetricCardProps[] = [
    {
      icon: Users,
      label: "Total Patients Today",
      value: data.total_patients_today,
      color: "bg-blue-500/15 text-blue-400",
      delay: 0,
    },
    {
      icon: Stethoscope,
      label: "Doctors On Duty",
      value: data.doctors_on_duty,
      color: "bg-emerald-500/15 text-emerald-400",
      delay: 50,
    },
    {
      icon: CalendarCheck,
      label: "Appointments Today",
      value: data.appointments_today,
      subtext: `${data.appointments_completed} completed`,
      color: "bg-purple-500/15 text-purple-400",
      delay: 100,
    },
    {
      icon: Siren,
      label: "Emergency Cases",
      value: data.emergency_cases,
      color: "bg-red-500/15 text-red-400",
      delay: 150,
    },
    {
      icon: Bed,
      label: "Bed Occupancy",
      value: `${data.bed_occupancy_rate}%`,
      subtext: `${data.occupied_beds}/${data.total_beds} beds`,
      color: "bg-amber-500/15 text-amber-400",
      delay: 200,
    },
    {
      icon: Clock,
      label: "Avg Waiting Time",
      value: `${data.avg_waiting_time}m`,
      color: "bg-cyan-500/15 text-cyan-400",
      delay: 250,
    },
    {
      icon: UserCheck,
      label: "Discharged Today",
      value: data.patients_discharged_today,
      color: "bg-teal-500/15 text-teal-400",
      delay: 300,
    },
    {
      icon: CalendarClock,
      label: "Appts Completed",
      value: data.appointments_completed,
      color: "bg-indigo-500/15 text-indigo-400",
      delay: 350,
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Resource Utilization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
