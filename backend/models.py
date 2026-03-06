"""
Pydantic models for the Hospital Operations Intelligence Dashboard.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime


# ── Enums ──────────────────────────────────────────────
class DepartmentStatus(str, Enum):
    NORMAL = "Normal"
    MODERATE = "Moderate"
    OVERLOADED = "Overloaded"


class HospitalStressLevel(str, Enum):
    NORMAL = "Normal"
    BUSY = "Busy"
    CRITICAL = "Critical"


class AlertSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class BloodStockLevel(str, Enum):
    SAFE = "Safe"
    MODERATE = "Moderate"
    CRITICAL = "Critical"


# ── Auth Models ────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_name: str


# ── HIS Raw Data Models ───────────────────────────────
class HISPatient(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    department: str
    admission_time: datetime
    status: str  # waiting, admitted, discharged, emergency
    priority: int  # 1=critical, 5=routine
    assigned_doctor: Optional[str] = None


class HISDoctor(BaseModel):
    doctor_id: str
    name: str
    department: str
    specialization: str
    status: str  # on-duty, off-duty, on-break
    patients_assigned: int
    shift: str  # morning, evening, night


class HISBed(BaseModel):
    bed_id: str
    department: str
    status: str  # occupied, available, maintenance
    patient_id: Optional[str] = None


class HISAppointment(BaseModel):
    appointment_id: str
    patient_name: str
    doctor_name: str
    department: str
    time: str
    status: str  # scheduled, completed, cancelled, in-progress


class HISBloodBank(BaseModel):
    blood_type: str
    units_available: int
    last_updated: datetime
    threshold: int = 10


class HISEmergencyCase(BaseModel):
    case_id: str
    patient_name: str
    severity: str  # critical, severe, moderate
    department: str
    arrival_time: datetime
    status: str  # triaged, treating, stabilized, discharged
    waiting_time_minutes: int


# ── Dashboard Analytics Models ─────────────────────────
class StressIndex(BaseModel):
    score: float = Field(..., ge=0, le=100)
    level: HospitalStressLevel
    bed_occupancy_pct: float
    avg_waiting_time: float
    doctor_workload: float
    emergency_load: float
    trend: str  # up, down, stable


class DepartmentHealth(BaseModel):
    name: str
    status: DepartmentStatus
    patients_waiting: int
    patients_admitted: int
    doctors_available: int
    doctors_total: int
    bed_occupancy_pct: float
    avg_wait_time: float
    cases_today: int


class Alert(BaseModel):
    id: str
    title: str
    message: str
    severity: AlertSeverity
    department: Optional[str] = None
    timestamp: datetime
    acknowledged: bool = False


class DepartmentWorkload(BaseModel):
    department: str
    cases: int
    capacity: int
    utilization_pct: float


class ResourceUtilization(BaseModel):
    total_patients_today: int
    doctors_on_duty: int
    appointments_today: int
    appointments_completed: int
    emergency_cases: int
    bed_occupancy_rate: float
    total_beds: int
    occupied_beds: int
    avg_waiting_time: float
    patients_discharged_today: int


class BloodBankItem(BaseModel):
    blood_type: str
    units_available: int
    threshold: int
    level: BloodStockLevel
    percentage: float


class BloodBankStatus(BaseModel):
    inventory: List[BloodBankItem]
    total_units: int
    alerts: List[str]


class DashboardData(BaseModel):
    stress_index: StressIndex
    departments: List[DepartmentHealth]
    alerts: List[Alert]
    department_workload: List[DepartmentWorkload]
    resource_utilization: ResourceUtilization
    blood_bank: BloodBankStatus
    last_updated: datetime
