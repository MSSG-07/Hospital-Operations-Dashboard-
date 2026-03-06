"""
Hospital Operations Intelligence Dashboard - FastAPI Backend
Main application entry point.
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models import LoginRequest, TokenResponse, DashboardData
from auth import verify_admin, create_access_token, verify_token, ADMIN_NAME
from mock_his import mock_his
from adapter import HISAdapter
from analytics import AnalyticsEngine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("🏥 Hospital Operations Dashboard Backend Starting...")
    print("✅ Mock HIS initialized")
    print("✅ Adapter layer ready")
    print("✅ Analytics engine ready")
    yield
    print("🛑 Shutting down...")


app = FastAPI(
    title="Hospital Operations Intelligence Dashboard",
    description="Real-time analytics and operational insights for hospital administrators",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize layers
adapter = HISAdapter(mock_his)
engine = AnalyticsEngine(adapter)


# ── Auth Endpoints ─────────────────────────────────────
@app.post("/api/auth/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    """Admin login endpoint."""
    if not verify_admin(req.email, req.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token({"sub": req.email, "role": "admin"})
    return TokenResponse(
        access_token=token,
        admin_name=ADMIN_NAME
    )


@app.get("/api/auth/verify")
async def verify(user=Depends(verify_token)):
    """Verify if the current token is valid."""
    return {"valid": True, "email": user["sub"], "admin_name": ADMIN_NAME}


# ── Dashboard Endpoints ───────────────────────────────
@app.get("/api/dashboard", response_model=DashboardData)
async def get_dashboard(user=Depends(verify_token)):
    """Get complete dashboard data."""
    return engine.get_dashboard_data()


@app.get("/api/dashboard/stress-index")
async def get_stress_index(user=Depends(verify_token)):
    """Get hospital stress index only."""
    data = adapter.get_all_adapted_data()
    return engine.compute_stress_index(data)


@app.get("/api/dashboard/departments")
async def get_departments(user=Depends(verify_token)):
    """Get department health data."""
    data = adapter.get_all_adapted_data()
    return engine.compute_department_health(data)


@app.get("/api/dashboard/alerts")
async def get_alerts(user=Depends(verify_token)):
    """Get operational alerts."""
    data = adapter.get_all_adapted_data()
    return engine.generate_alerts(data)


@app.get("/api/dashboard/workload")
async def get_workload(user=Depends(verify_token)):
    """Get department workload data."""
    data = adapter.get_all_adapted_data()
    return engine.compute_department_workload(data)


@app.get("/api/dashboard/resources")
async def get_resources(user=Depends(verify_token)):
    """Get resource utilization data."""
    data = adapter.get_all_adapted_data()
    return engine.compute_resource_utilization(data)


@app.get("/api/dashboard/blood-bank")
async def get_blood_bank(user=Depends(verify_token)):
    """Get blood bank status."""
    data = adapter.get_all_adapted_data()
    return engine.compute_blood_bank(data)


# ── Health Check ───────────────────────────────────────
@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Hospital Ops Dashboard"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
