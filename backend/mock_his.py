"""
Mock Hospital Information System (HIS)
Generates realistic simulated hospital data that changes over time.
"""
import random
import uuid
from datetime import datetime, timedelta
from models import (
    HISPatient, HISDoctor, HISBed, HISAppointment,
    HISBloodBank, HISEmergencyCase
)

# ── Static Data ────────────────────────────────────────
DEPARTMENTS = [
    "Emergency", "ICU", "Cardiology", "Neurology",
    "Orthopedics", "Pediatrics", "Oncology", "General Medicine",
    "Surgery", "Obstetrics"
]

DOCTOR_NAMES = [
    "Dr. Aisha Patel", "Dr. Rajesh Kumar", "Dr. Priya Sharma",
    "Dr. Vikram Singh", "Dr. Meera Nair", "Dr. Arjun Reddy",
    "Dr. Kavitha Rajan", "Dr. Suresh Menon", "Dr. Ananya Das",
    "Dr. Rohit Gupta", "Dr. Deepa Iyer", "Dr. Karthik Subramanian",
    "Dr. Latha Krishnan", "Dr. Mohan Rao", "Dr. Neha Verma",
    "Dr. Sanjay Joshi", "Dr. Divya Nambiar", "Dr. Ganesh Pillai",
    "Dr. Revathi Sundaram", "Dr. Prasad Kulkarni", "Dr. Sneha Bhat",
    "Dr. Harish Desai", "Dr. Pooja Agarwal", "Dr. Ramesh Babu",
    "Dr. Swathi Rao", "Dr. Ajay Mishra", "Dr. Lakshmi Venkatesh",
    "Dr. Nitin Chandra", "Dr. Suma Hegde", "Dr. Vivek Saxena"
]

PATIENT_FIRST = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun",
    "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Saanvi", "Aanya", "Aadhya", "Aarohi", "Ananya",
    "Diya", "Myra", "Sara", "Ira", "Navya"
]

PATIENT_LAST = [
    "Sharma", "Verma", "Patel", "Kumar", "Singh",
    "Reddy", "Nair", "Gupta", "Das", "Iyer",
    "Joshi", "Rao", "Menon", "Pillai", "Bhat"
]

BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

SHIFTS = ["morning", "evening", "night"]


class MockHIS:
    """
    Simulates a Hospital Information System with dynamic data.
    Data changes slightly on each call to simulate real-time operations.
    """

    def __init__(self):
        self._seed_base = random.randint(1000, 9999)
        self._cycle = 0

    def _next_cycle(self):
        self._cycle += 1

    def get_patients(self) -> list[HISPatient]:
        """Generate current patient roster."""
        self._next_cycle()
        now = datetime.utcnow()
        patients = []
        
        # Base count fluctuates
        base_count = random.randint(85, 140)
        
        for i in range(base_count):
            dept = random.choice(DEPARTMENTS)
            status_weights = {
                "Emergency": ["emergency", "admitted", "waiting", "waiting"],
                "ICU": ["admitted", "admitted", "admitted", "emergency"],
            }
            
            if dept in status_weights:
                status = random.choice(status_weights[dept])
            else:
                status = random.choice(["waiting", "admitted", "discharged", "admitted", "waiting"])

            priority = random.choices([1, 2, 3, 4, 5], weights=[5, 10, 25, 35, 25])[0]
            if dept == "Emergency":
                priority = random.choices([1, 2, 3], weights=[30, 40, 30])[0]

            admission_offset = random.randint(0, 72)
            
            patients.append(HISPatient(
                patient_id=f"P-{self._seed_base}-{i:04d}",
                name=f"{random.choice(PATIENT_FIRST)} {random.choice(PATIENT_LAST)}",
                age=random.randint(1, 90),
                gender=random.choice(["Male", "Female"]),
                department=dept,
                admission_time=now - timedelta(hours=admission_offset),
                status=status,
                priority=priority,
                assigned_doctor=random.choice(DOCTOR_NAMES) if status != "waiting" else None
            ))
        
        return patients

    def get_doctors(self) -> list[HISDoctor]:
        """Generate current doctor roster."""
        doctors = []
        
        for i, name in enumerate(DOCTOR_NAMES):
            dept = DEPARTMENTS[i % len(DEPARTMENTS)]
            
            # Vary on-duty status based on time simulation
            status_roll = random.random()
            if status_roll < 0.65:
                status = "on-duty"
            elif status_roll < 0.85:
                status = "off-duty"
            else:
                status = "on-break"

            patients_assigned = random.randint(2, 12) if status == "on-duty" else 0

            doctors.append(HISDoctor(
                doctor_id=f"D-{i+1:03d}",
                name=name,
                department=dept,
                specialization=dept,
                status=status,
                patients_assigned=patients_assigned,
                shift=random.choice(SHIFTS)
            ))
        
        return doctors

    def get_beds(self) -> list[HISBed]:
        """Generate bed occupancy data."""
        beds = []
        bed_counts = {
            "Emergency": 30, "ICU": 20, "Cardiology": 25,
            "Neurology": 20, "Orthopedics": 25, "Pediatrics": 30,
            "Oncology": 20, "General Medicine": 40,
            "Surgery": 25, "Obstetrics": 20
        }
        
        bed_idx = 0
        for dept, count in bed_counts.items():
            # Occupancy varies by department
            if dept in ["Emergency", "ICU"]:
                occupancy_rate = random.uniform(0.75, 0.98)
            elif dept in ["General Medicine", "Surgery"]:
                occupancy_rate = random.uniform(0.60, 0.90)
            else:
                occupancy_rate = random.uniform(0.45, 0.85)
            
            occupied_count = int(count * occupancy_rate)
            maintenance_count = random.randint(0, max(1, int(count * 0.05)))
            
            for j in range(count):
                bed_idx += 1
                if j < occupied_count:
                    status = "occupied"
                    pid = f"P-{self._seed_base}-{random.randint(0, 140):04d}"
                elif j < occupied_count + maintenance_count:
                    status = "maintenance"
                    pid = None
                else:
                    status = "available"
                    pid = None

                beds.append(HISBed(
                    bed_id=f"BED-{bed_idx:04d}",
                    department=dept,
                    status=status,
                    patient_id=pid
                ))
        
        return beds

    def get_appointments(self) -> list[HISAppointment]:
        """Generate today's appointments."""
        appointments = []
        count = random.randint(60, 120)
        
        for i in range(count):
            dept = random.choice(DEPARTMENTS)
            hour = random.randint(8, 20)
            minute = random.choice([0, 15, 30, 45])
            
            status_roll = random.random()
            if hour < datetime.utcnow().hour:
                status = random.choices(
                    ["completed", "cancelled", "completed", "completed"],
                    weights=[50, 10, 30, 10]
                )[0]
            elif hour == datetime.utcnow().hour:
                status = "in-progress"
            else:
                status = "scheduled"

            appointments.append(HISAppointment(
                appointment_id=f"APT-{i+1:04d}",
                patient_name=f"{random.choice(PATIENT_FIRST)} {random.choice(PATIENT_LAST)}",
                doctor_name=random.choice(DOCTOR_NAMES),
                department=dept,
                time=f"{hour:02d}:{minute:02d}",
                status=status
            ))
        
        return appointments

    def get_blood_bank(self) -> list[HISBloodBank]:
        """Generate blood bank inventory."""
        now = datetime.utcnow()
        inventory = []
        
        for bt in BLOOD_TYPES:
            # O+ and A+ are more common
            if bt in ["O+", "A+"]:
                units = random.randint(15, 50)
                threshold = 15
            elif bt in ["O-", "AB-"]:
                units = random.randint(2, 20)
                threshold = 8
            else:
                units = random.randint(5, 35)
                threshold = 10
            
            inventory.append(HISBloodBank(
                blood_type=bt,
                units_available=units,
                last_updated=now - timedelta(minutes=random.randint(0, 120)),
                threshold=threshold
            ))
        
        return inventory

    def get_emergency_cases(self) -> list[HISEmergencyCase]:
        """Generate emergency case data."""
        now = datetime.utcnow()
        cases = []
        count = random.randint(8, 25)
        
        for i in range(count):
            severity = random.choices(
                ["critical", "severe", "moderate"],
                weights=[15, 35, 50]
            )[0]
            
            waiting_time = {
                "critical": random.randint(0, 10),
                "severe": random.randint(5, 45),
                "moderate": random.randint(10, 90)
            }[severity]
            
            status = random.choices(
                ["triaged", "treating", "stabilized", "discharged"],
                weights=[20, 40, 25, 15]
            )[0]

            cases.append(HISEmergencyCase(
                case_id=f"EM-{i+1:04d}",
                patient_name=f"{random.choice(PATIENT_FIRST)} {random.choice(PATIENT_LAST)}",
                severity=severity,
                department=random.choice(["Emergency", "ICU", "Surgery", "Cardiology"]),
                arrival_time=now - timedelta(minutes=random.randint(10, 360)),
                status=status,
                waiting_time_minutes=waiting_time
            ))
        
        return cases


# Singleton instance
mock_his = MockHIS()
