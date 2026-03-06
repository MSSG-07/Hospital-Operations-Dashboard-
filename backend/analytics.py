"""
Analytics Engine: Converts adapted HIS data into dashboard-ready analytics.
Adapter Layer → Analytics Engine → Dashboard API
"""
import uuid
from datetime import datetime
from typing import Dict, Any, List
from models import (
    StressIndex, HospitalStressLevel, DepartmentHealth, DepartmentStatus,
    Alert, AlertSeverity, DepartmentWorkload, ResourceUtilization,
    BloodBankItem, BloodBankStatus, BloodStockLevel, DashboardData
)
from adapter import HISAdapter
from mock_his import DEPARTMENTS


class AnalyticsEngine:
    """
    Processes adapted HIS data and produces final analytics
    models for the dashboard.
    """

    def __init__(self, adapter: HISAdapter):
        self.adapter = adapter

    def compute_stress_index(self, data: Dict[str, Any]) -> StressIndex:
        """
        Hospital Stress Index = weighted combination of:
        - Bed occupancy (30%)
        - Average waiting time (25%)
        - Doctor workload (25%)
        - Emergency load (20%)
        """
        bed_occ = data["beds"]["totals"]["occupancy_pct"]
        avg_wait = data["patients"]["avg_waiting_time"]
        doc_workload = data["doctors"]["avg_workload"]
        emergency_count = data["emergency"]["total"]

        # Normalize each component to 0-100
        bed_score = min(bed_occ, 100)
        wait_score = min((avg_wait / 120) * 100, 100)  # 120 min = max reference
        workload_score = min((doc_workload / 15) * 100, 100)  # 15 patients = max
        emergency_score = min((emergency_count / 30) * 100, 100)  # 30 cases = max

        # Weighted score
        score = round(
            bed_score * 0.30 +
            wait_score * 0.25 +
            workload_score * 0.25 +
            emergency_score * 0.20,
            1
        )

        # Determine level
        if score >= 75:
            level = HospitalStressLevel.CRITICAL
        elif score >= 50:
            level = HospitalStressLevel.BUSY
        else:
            level = HospitalStressLevel.NORMAL

        # Simple trend (random for demo, would be historical in prod)
        import random
        trend = random.choice(["up", "down", "stable"])

        return StressIndex(
            score=score,
            level=level,
            bed_occupancy_pct=bed_occ,
            avg_waiting_time=round(avg_wait, 1),
            doctor_workload=round(doc_workload, 1),
            emergency_load=emergency_count,
            trend=trend
        )

    def compute_department_health(self, data: Dict[str, Any]) -> List[DepartmentHealth]:
        """Compute health status for each department."""
        departments = []

        for dept in DEPARTMENTS:
            patient_data = data["patients"]["by_department"].get(dept, {
                "waiting": 0, "admitted": 0, "discharged": 0,
                "emergency": 0, "total": 0, "avg_wait_time": 0
            })
            
            doctor_data = data["doctors"]["by_department"].get(dept, {
                "on_duty": 0, "total": 0, "total_patients": 0
            })
            
            bed_data = data["beds"]["by_department"].get(dept, {
                "total": 0, "occupied": 0, "occupancy_pct": 0
            })
            
            appt_data = data["appointments"]["by_department"].get(dept, 0)
            
            patients_waiting = patient_data.get("waiting", 0)
            doctors_available = doctor_data.get("on_duty", 0)
            bed_occ_pct = bed_data.get("occupancy_pct", 0)
            avg_wait = patient_data.get("avg_wait_time", 0)

            # Determine status
            if bed_occ_pct >= 90 or patients_waiting >= 15 or (doctors_available <= 1 and patient_data.get("total", 0) > 5):
                status = DepartmentStatus.OVERLOADED
            elif bed_occ_pct >= 70 or patients_waiting >= 8:
                status = DepartmentStatus.MODERATE
            else:
                status = DepartmentStatus.NORMAL

            cases_today = patient_data.get("total", 0) + appt_data

            departments.append(DepartmentHealth(
                name=dept,
                status=status,
                patients_waiting=patients_waiting,
                patients_admitted=patient_data.get("admitted", 0),
                doctors_available=doctors_available,
                doctors_total=doctor_data.get("total", 0),
                bed_occupancy_pct=bed_occ_pct,
                avg_wait_time=avg_wait,
                cases_today=cases_today
            ))

        return departments

    def generate_alerts(self, data: Dict[str, Any]) -> List[Alert]:
        """Generate operational alerts based on threshold analysis."""
        alerts = []
        now = datetime.utcnow()

        # 1. ICU capacity alerts
        icu_beds = data["beds"]["by_department"].get("ICU", {})
        if icu_beds.get("occupancy_pct", 0) >= 90:
            alerts.append(Alert(
                id=str(uuid.uuid4())[:8],
                title="ICU Nearing Capacity",
                message=f"ICU bed occupancy at {icu_beds['occupancy_pct']}%. Only {icu_beds.get('available', 0)} beds remaining.",
                severity=AlertSeverity.CRITICAL,
                department="ICU",
                timestamp=now
            ))

        # 2. ER waiting time
        er_patients = data["patients"]["by_department"].get("Emergency", {})
        er_wait = er_patients.get("avg_wait_time", 0)
        if er_wait > 30:
            sev = AlertSeverity.CRITICAL if er_wait > 60 else AlertSeverity.WARNING
            alerts.append(Alert(
                id=str(uuid.uuid4())[:8],
                title="ER Wait Time High",
                message=f"Emergency room average wait time is {round(er_wait)} minutes.",
                severity=sev,
                department="Emergency",
                timestamp=now
            ))

        # 3. Staff shortage
        for dept in DEPARTMENTS:
            doc_data = data["doctors"]["by_department"].get(dept, {})
            on_duty = doc_data.get("on_duty", 0)
            total = doc_data.get("total", 0)
            if total > 0 and on_duty <= 1:
                alerts.append(Alert(
                    id=str(uuid.uuid4())[:8],
                    title=f"Staff Shortage: {dept}",
                    message=f"Only {on_duty} doctor(s) on duty in {dept}. Consider staff reallocation.",
                    severity=AlertSeverity.WARNING,
                    department=dept,
                    timestamp=now
                ))

        # 4. Blood bank alerts
        for alert_msg in data["blood_bank"]["alerts"]:
            alerts.append(Alert(
                id=str(uuid.uuid4())[:8],
                title="Blood Stock Alert",
                message=alert_msg,
                severity=AlertSeverity.CRITICAL,
                department=None,
                timestamp=now
            ))

        # 5. High overall occupancy
        total_occ = data["beds"]["totals"]["occupancy_pct"]
        if total_occ >= 85:
            alerts.append(Alert(
                id=str(uuid.uuid4())[:8],
                title="High Hospital Occupancy",
                message=f"Overall bed occupancy at {total_occ}%. Consider discharge reviews.",
                severity=AlertSeverity.WARNING if total_occ < 95 else AlertSeverity.CRITICAL,
                department=None,
                timestamp=now
            ))

        # 6. Emergency overload
        if data["emergency"]["total"] >= 20:
            alerts.append(Alert(
                id=str(uuid.uuid4())[:8],
                title="Emergency Overload",
                message=f"{data['emergency']['total']} active emergency cases. Critical: {data['emergency']['severity_counts']['critical']}.",
                severity=AlertSeverity.CRITICAL,
                department="Emergency",
                timestamp=now
            ))

        # Sort by severity
        severity_order = {AlertSeverity.CRITICAL: 0, AlertSeverity.WARNING: 1, AlertSeverity.INFO: 2}
        alerts.sort(key=lambda a: severity_order.get(a.severity, 3))

        return alerts

    def compute_department_workload(self, data: Dict[str, Any]) -> List[DepartmentWorkload]:
        """Compute workload per department for bar chart."""
        workloads = []

        for dept in DEPARTMENTS:
            patient_data = data["patients"]["by_department"].get(dept, {"total": 0})
            appt_data = data["appointments"]["by_department"].get(dept, 0)
            bed_data = data["beds"]["by_department"].get(dept, {"total": 30})

            cases = patient_data.get("total", 0) + appt_data
            capacity = bed_data.get("total", 30) * 2  # capacity = 2x beds as reference
            util_pct = round((cases / capacity * 100) if capacity > 0 else 0, 1)

            workloads.append(DepartmentWorkload(
                department=dept,
                cases=cases,
                capacity=capacity,
                utilization_pct=min(util_pct, 100)
            ))

        workloads.sort(key=lambda w: w.cases, reverse=True)
        return workloads

    def compute_resource_utilization(self, data: Dict[str, Any]) -> ResourceUtilization:
        """Compute resource utilization metrics."""
        beds = data["beds"]["totals"]
        patients = data["patients"]
        doctors = data["doctors"]
        appointments = data["appointments"]
        emergency = data["emergency"]

        return ResourceUtilization(
            total_patients_today=patients["total_today"],
            doctors_on_duty=doctors["on_duty"],
            appointments_today=appointments["total"],
            appointments_completed=appointments["completed"],
            emergency_cases=emergency["total"],
            bed_occupancy_rate=beds["occupancy_pct"],
            total_beds=beds["total"],
            occupied_beds=beds["occupied"],
            avg_waiting_time=patients["avg_waiting_time"],
            patients_discharged_today=patients["status_counts"].get("discharged", 0)
        )

    def compute_blood_bank(self, data: Dict[str, Any]) -> BloodBankStatus:
        """Compute blood bank status."""
        bb = data["blood_bank"]
        
        items = []
        for inv in bb["inventory"]:
            items.append(BloodBankItem(
                blood_type=inv["blood_type"],
                units_available=inv["units_available"],
                threshold=inv["threshold"],
                level=BloodStockLevel(inv["level"]),
                percentage=inv["percentage"]
            ))

        return BloodBankStatus(
            inventory=items,
            total_units=bb["total_units"],
            alerts=bb["alerts"]
        )

    def get_dashboard_data(self) -> DashboardData:
        """Main entry point: produce complete dashboard data."""
        raw = self.adapter.get_all_adapted_data()

        return DashboardData(
            stress_index=self.compute_stress_index(raw),
            departments=self.compute_department_health(raw),
            alerts=self.generate_alerts(raw),
            department_workload=self.compute_department_workload(raw),
            resource_utilization=self.compute_resource_utilization(raw),
            blood_bank=self.compute_blood_bank(raw),
            last_updated=datetime.utcnow()
        )
