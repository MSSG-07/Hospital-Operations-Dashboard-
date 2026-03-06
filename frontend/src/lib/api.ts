const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Token Management ─────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hos_token");
}

export function setToken(token: string): void {
  localStorage.setItem("hos_token", token);
}

export function removeToken(): void {
  localStorage.removeItem("hos_token");
  localStorage.removeItem("hos_admin_name");
}

export function setAdminName(name: string): void {
  localStorage.setItem("hos_admin_name", name);
}

export function getAdminName(): string {
  if (typeof window === "undefined") return "Admin";
  return localStorage.getItem("hos_admin_name") || "Admin";
}

// ── API Fetch Helper ──────────────────────────────────
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return res.json();
}

// ── Auth API ──────────────────────────────────────────
export async function loginApi(email: string, password: string) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  setAdminName(data.admin_name);
  return data;
}

export async function verifyTokenApi() {
  return apiFetch("/api/auth/verify");
}

// ── Dashboard API ─────────────────────────────────────
export async function getDashboardData() {
  return apiFetch("/api/dashboard");
}

export async function getStressIndex() {
  return apiFetch("/api/dashboard/stress-index");
}

export async function getDepartments() {
  return apiFetch("/api/dashboard/departments");
}

export async function getAlerts() {
  return apiFetch("/api/dashboard/alerts");
}

export async function getWorkload() {
  return apiFetch("/api/dashboard/workload");
}

export async function getResources() {
  return apiFetch("/api/dashboard/resources");
}

export async function getBloodBank() {
  return apiFetch("/api/dashboard/blood-bank");
}

// ── Types ─────────────────────────────────────────────
export interface StressIndexData {
  score: number;
  level: "Normal" | "Busy" | "Critical";
  bed_occupancy_pct: number;
  avg_waiting_time: number;
  doctor_workload: number;
  emergency_load: number;
  trend: "up" | "down" | "stable";
}

export interface DepartmentHealthData {
  name: string;
  status: "Normal" | "Moderate" | "Overloaded";
  patients_waiting: number;
  patients_admitted: number;
  doctors_available: number;
  doctors_total: number;
  bed_occupancy_pct: number;
  avg_wait_time: number;
  cases_today: number;
}

export interface AlertData {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  department: string | null;
  timestamp: string;
  acknowledged: boolean;
}

export interface DepartmentWorkloadData {
  department: string;
  cases: number;
  capacity: number;
  utilization_pct: number;
}

export interface ResourceUtilizationData {
  total_patients_today: number;
  doctors_on_duty: number;
  appointments_today: number;
  appointments_completed: number;
  emergency_cases: number;
  bed_occupancy_rate: number;
  total_beds: number;
  occupied_beds: number;
  avg_waiting_time: number;
  patients_discharged_today: number;
}

export interface BloodBankItemData {
  blood_type: string;
  units_available: number;
  threshold: number;
  level: "Safe" | "Moderate" | "Critical";
  percentage: number;
}

export interface BloodBankStatusData {
  inventory: BloodBankItemData[];
  total_units: number;
  alerts: string[];
}

export interface DashboardDataResponse {
  stress_index: StressIndexData;
  departments: DepartmentHealthData[];
  alerts: AlertData[];
  department_workload: DepartmentWorkloadData[];
  resource_utilization: ResourceUtilizationData;
  blood_bank: BloodBankStatusData;
  last_updated: string;
}
