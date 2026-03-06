"""
Adapter Layer: Converts raw HIS data into standardized analytics-ready format.
Mock HIS → Adapter Layer → Analytics Engine
"""
from datetime import datetime
from typing import Dict, List, Any
from mock_his import MockHIS, DEPARTMENTS


class HISAdapter:
    """
    Transforms raw data from the Hospital Information System
    into clean, standardized structures for the analytics engine.
    """

    def __init__(self, his: MockHIS):
        self.his = his

    def get_bed_stats(self) -> Dict[str, Any]:
        """Standardize bed data into department-wise stats."""
        beds = self.his.get_beds()
        dept_stats = {}
        totals = {"total": 0, "occupied": 0, "available": 0, "maintenance": 0}

        for bed in beds:
            dept = bed.department
            if dept not in dept_stats:
                dept_stats[dept] = {"total": 0, "occupied": 0, "available": 0, "maintenance": 0}
            
            dept_stats[dept]["total"] += 1
            dept_stats[dept][bed.status] += 1
            totals["total"] += 1
            if bed.status in totals:
                totals[bed.status] += 1

        # Add occupancy rates
        for dept in dept_stats:
            t = dept_stats[dept]["total"]
            o = dept_stats[dept]["occupied"]
            dept_stats[dept]["occupancy_pct"] = round((o / t * 100) if t > 0 else 0, 1)

        totals["occupancy_pct"] = round(
            (totals["occupied"] / totals["total"] * 100) if totals["total"] > 0 else 0, 1
        )

        return {"by_department": dept_stats, "totals": totals}

    def get_patient_stats(self) -> Dict[str, Any]:
        """Standardize patient data into department-wise and status-wise stats."""
        patients = self.his.get_patients()
        now = datetime.utcnow()

        dept_patients = {}
        status_counts = {"waiting": 0, "admitted": 0, "discharged": 0, "emergency": 0}
        total_wait_times = []
        total_today = 0

        for p in patients:
            dept = p.department
            if dept not in dept_patients:
                dept_patients[dept] = {
                    "waiting": 0, "admitted": 0, "discharged": 0,
                    "emergency": 0, "total": 0, "wait_times": []
                }

            dept_patients[dept][p.status] = dept_patients[dept].get(p.status, 0) + 1
            dept_patients[dept]["total"] += 1

            if p.status in status_counts:
                status_counts[p.status] += 1

            # Calculate waiting time for waiting patients
            if p.status == "waiting":
                wait_minutes = (now - p.admission_time).total_seconds() / 60
                dept_patients[dept]["wait_times"].append(wait_minutes)
                total_wait_times.append(wait_minutes)

            # Count today's patients
            if p.admission_time.date() == now.date():
                total_today += 1

        # Compute avg wait times per department
        for dept in dept_patients:
            wt = dept_patients[dept]["wait_times"]
            dept_patients[dept]["avg_wait_time"] = round(sum(wt) / len(wt), 1) if wt else 0
            del dept_patients[dept]["wait_times"]

        avg_wait = round(sum(total_wait_times) / len(total_wait_times), 1) if total_wait_times else 0

        return {
            "by_department": dept_patients,
            "status_counts": status_counts,
            "total_today": total_today,
            "total_active": status_counts["waiting"] + status_counts["admitted"] + status_counts["emergency"],
            "avg_waiting_time": avg_wait
        }

    def get_doctor_stats(self) -> Dict[str, Any]:
        """Standardize doctor data."""
        doctors = self.his.get_doctors()
        
        dept_doctors = {}
        on_duty_count = 0
        total_workload = 0
        active_doctors = 0

        for d in doctors:
            dept = d.department
            if dept not in dept_doctors:
                dept_doctors[dept] = {"on_duty": 0, "off_duty": 0, "on_break": 0, "total": 0, "total_patients": 0}
            
            dept_doctors[dept][d.status.replace("-", "_")] = dept_doctors[dept].get(d.status.replace("-", "_"), 0) + 1
            dept_doctors[dept]["total"] += 1

            if d.status == "on-duty":
                on_duty_count += 1
                total_workload += d.patients_assigned
                active_doctors += 1
                dept_doctors[dept]["total_patients"] += d.patients_assigned

        avg_workload = round(total_workload / active_doctors, 1) if active_doctors > 0 else 0

        return {
            "by_department": dept_doctors,
            "on_duty": on_duty_count,
            "total": len(doctors),
            "avg_workload": avg_workload
        }

    def get_appointment_stats(self) -> Dict[str, Any]:
        """Standardize appointment data."""
        appointments = self.his.get_appointments()
        
        status_counts = {"scheduled": 0, "completed": 0, "cancelled": 0, "in-progress": 0}
        dept_counts = {}

        for a in appointments:
            if a.status in status_counts:
                status_counts[a.status] += 1
            dept = a.department
            dept_counts[dept] = dept_counts.get(dept, 0) + 1

        return {
            "total": len(appointments),
            "status_counts": status_counts,
            "completed": status_counts["completed"],
            "by_department": dept_counts
        }

    def get_blood_bank_stats(self) -> Dict[str, Any]:
        """Standardize blood bank data."""
        inventory = self.his.get_blood_bank()
        
        items = []
        total = 0
        alerts = []

        for item in inventory:
            units = item.units_available
            threshold = item.threshold
            total += units
            
            pct = round((units / (threshold * 3)) * 100, 1)  # 3x threshold = max reference
            
            if units <= threshold * 0.5:
                level = "Critical"
                alerts.append(f"{item.blood_type} blood stock critically low ({units} units)")
            elif units <= threshold:
                level = "Moderate"
            else:
                level = "Safe"

            items.append({
                "blood_type": item.blood_type,
                "units_available": units,
                "threshold": threshold,
                "level": level,
                "percentage": min(pct, 100)
            })

        return {
            "inventory": items,
            "total_units": total,
            "alerts": alerts
        }

    def get_emergency_stats(self) -> Dict[str, Any]:
        """Standardize emergency data."""
        cases = self.his.get_emergency_cases()
        
        severity_counts = {"critical": 0, "severe": 0, "moderate": 0}
        total_wait = 0

        for c in cases:
            if c.severity in severity_counts:
                severity_counts[c.severity] += 1
            total_wait += c.waiting_time_minutes

        avg_wait = round(total_wait / len(cases), 1) if cases else 0

        return {
            "total": len(cases),
            "severity_counts": severity_counts,
            "avg_waiting_time": avg_wait,
            "cases": [c.model_dump() for c in cases]
        }

    def get_all_adapted_data(self) -> Dict[str, Any]:
        """Get all adapted data in one call."""
        return {
            "beds": self.get_bed_stats(),
            "patients": self.get_patient_stats(),
            "doctors": self.get_doctor_stats(),
            "appointments": self.get_appointment_stats(),
            "blood_bank": self.get_blood_bank_stats(),
            "emergency": self.get_emergency_stats(),
            "timestamp": datetime.utcnow()
        }
