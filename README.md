<div align="center">

# Hospital Operations Intelligence Dashboard

**Real-Time Analytics & Command Center for Hospital Administrators**

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade, full-stack dashboard application that provides hospital administrators with real-time operational intelligence, automated alerting, and resource monitoring — built on a layered architecture with a simulated Hospital Information System (HIS).

[Getting Started](#getting-started) · [Architecture](#system-architecture) · [API Docs](#api-reference) · [Modules](#dashboard-modules) · [Contributing](CONTRIBUTING.md)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [Configuration](#configuration)
8. [Authentication](#authentication)
9. [Dashboard Modules](#dashboard-modules)
10. [API Reference](#api-reference)
11. [Backend Design](#backend-design)
12. [Frontend Design](#frontend-design)
13. [Data Models](#data-models)
14. [Troubleshooting](#troubleshooting)
15. [Contributing](#contributing)
16. [License](#license)

---

## Overview

The Hospital Operations Intelligence Dashboard is a unified monitoring platform that consolidates critical hospital metrics into a single, real-time command center. It ingests operational data from a Hospital Information System, processes it through an analytics pipeline, and presents actionable insights through an interactive web interface.

### Problem Statement

Hospital administrators face fragmented visibility across departments, delayed awareness of critical situations, and lack of centralized operational metrics. Manual monitoring of bed occupancy, staff workload, blood inventory, and emergency throughput introduces response latency in time-sensitive healthcare operations.

### Solution

This dashboard provides:

- **Composite Stress Index** — a single, weighted KPI (0–100) reflecting overall hospital operational pressure
- **Department-level health monitoring** — real-time status for 10 departments with threshold-based classification
- **Automated alert generation** — rule-based alerts triggered when operational metrics breach defined thresholds
- **Resource tracking** — bed occupancy, doctor workload, appointment throughput, and patient flow metrics
- **Blood bank surveillance** — inventory monitoring for 8 blood types with critical-level notifications

---

## Key Features

| Category             | Feature                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| **Monitoring**       | Real-time stress index with weighted multi-factor scoring              |
| **Alerting**         | Automated threshold-based alerts (Critical / Warning / Info)           |
| **Departments**      | Live health status for 10 departments with occupancy and workload data |
| **Visualization**    | Interactive bar charts, SVG gauges, and progress indicators            |
| **Blood Bank**       | Inventory levels for 8 blood types with critical-stock detection       |
| **Authentication**   | JWT-based admin login with 24-hour token expiry                        |
| **Auto-Refresh**     | Dashboard polls the backend every 30 seconds for latest data           |
| **Navigation**       | Collapsible sidebar with deep-link routing to each module              |
| **Dark Theme**       | Professional dark UI with glass-morphism and gradient accents          |
| **Responsive**       | Adaptive layout from mobile (1 column) to desktop (4 columns)         |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              System Architecture                                │
│                                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │              │    │              │    │              │    │              │  │
│  │   Mock HIS   │───▶│   Adapter    │───▶│  Analytics   │───▶│   FastAPI    │  │
│  │   (Data      │    │   Layer      │    │   Engine     │    │   REST API   │  │
│  │   Source)    │    │              │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────┬───────┘  │
│       Python              Python              Python               │          │
│                                                                    │ HTTP/JWT │
│                                                                    │          │
│  ┌─────────────────────────────────────────────────────────────────▼───────┐  │
│  │                        Next.js Frontend (React)                         │  │
│  │                                                                         │  │
│  │  ┌──────────┐  ┌──────────────────────────────────────────────────┐    │  │
│  │  │ Sidebar  │  │               Dashboard Content                  │    │  │
│  │  │ Nav      │  │  ┌─────────┐ ┌──────┐ ┌────────┐ ┌──────────┐  │    │  │
│  │  │          │  │  │ Stress  │ │ Dept │ │ Alerts │ │ Workload │  │    │  │
│  │  │          │  │  │ Index   │ │Health│ │ Panel  │ │ Chart    │  │    │  │
│  │  │          │  │  └─────────┘ └──────┘ └────────┘ └──────────┘  │    │  │
│  │  │          │  │  ┌───────────────┐ ┌────────────────────────┐   │    │  │
│  │  │          │  │  │  Resources    │ │  Blood Bank Monitor    │   │    │  │
│  │  │          │  │  └───────────────┘ └────────────────────────┘   │    │  │
│  │  └──────────┘  └──────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│       TypeScript / React / Tailwind CSS                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. Mock HIS          → Generates realistic hospital operational data (patients, doctors,
                        beds, appointments, blood bank, emergency cases)

2. Adapter Layer     → Aggregates raw HIS data into department-wise statistics,
                        computes averages, percentages, and normalized metrics

3. Analytics Engine  → Applies scoring algorithms, threshold rules, and alert logic
                        to produce dashboard-ready analytics models

4. FastAPI Server    → Exposes authenticated REST endpoints serving JSON responses

5. Next.js Frontend  → Fetches, renders, and auto-refreshes data every 30 seconds
                        via shared React Context
```

---

## Tech Stack

### Backend

| Component       | Technology          | Version  | Purpose                              |
| --------------- | ------------------- | -------- | ------------------------------------ |
| Runtime         | Python              | 3.12+    | Server-side language                 |
| Web Framework   | FastAPI             | 0.104.1  | Async REST API framework             |
| ASGI Server     | Uvicorn             | 0.24.0   | Production-grade ASGI server         |
| Validation      | Pydantic            | 2.5.2    | Request/response schema validation   |
| Authentication  | python-jose         | 3.3.0    | JWT token encoding/decoding          |
| Password Hashing| passlib + bcrypt    | 1.7.4    | Secure password verification         |
| Database Driver | Motor (async)       | 3.3.2    | MongoDB async driver (future use)    |
| Database Client | PyMongo             | 4.6.1    | MongoDB sync driver (future use)     |

### Frontend

| Component       | Technology                  | Version  | Purpose                              |
| --------------- | --------------------------- | -------- | ------------------------------------ |
| Framework       | Next.js (App Router)        | 16.1.6   | React meta-framework with SSR        |
| UI Library      | React                       | 19.2.3   | Component-based UI                   |
| Language        | TypeScript                  | 5.x      | Type-safe JavaScript                 |
| Styling         | Tailwind CSS                | 4.x      | Utility-first CSS framework          |
| Charts          | Recharts                    | 3.7.0    | Composable React chart library       |
| Icons           | Lucide React                | 0.577.0  | SVG icon library                     |
| Variants        | class-variance-authority    | 0.7.1    | Component variant management         |
| Class Merging   | tailwind-merge + clsx       | 3.5.0    | Conditional class composition        |
| Primitives      | Radix UI                    | Various  | Accessible headless UI components    |

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version | Verification Command     |
| ----------- | --------------- | ------------------------ |
| Node.js     | 18.x            | `node --version`         |
| npm         | 9.x             | `npm --version`          |
| Python      | 3.10            | `python3 --version`      |
| Git         | 2.x             | `git --version`          |

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd vit2
```

#### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # Linux / macOS
# venv\Scripts\activate           # Windows (Command Prompt)
# venv\Scripts\Activate.ps1       # Windows (PowerShell)

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
python main.py
```

The API server starts at `http://localhost:8000`. Verify with:

```bash
curl http://localhost:8000/api/health
# Expected: {"status":"healthy","service":"Hospital Ops Dashboard"}
```

#### 3. Frontend setup

```bash
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

The frontend starts at `http://localhost:3000`.

#### 4. Verify the full stack

1. Navigate to `http://localhost:3000` in a browser
2. Log in with the credentials below
3. The dashboard should load with live hospital data

> **Note:** Both the backend (port 8000) and frontend (port 3000) must be running simultaneously.

---

## Project Structure

```
vit2/
├── README.md                                 # Project documentation
├── CONTRIBUTING.md                           # Contribution guidelines
├── LICENSE                                   # MIT License
│
├── backend/                                  # Python FastAPI backend
│   ├── main.py                               # Application entry point, route definitions
│   ├── mock_his.py                           # Simulated Hospital Information System
│   ├── adapter.py                            # Raw HIS data → standardized statistics
│   ├── analytics.py                          # KPI computation, alert rules, scoring
│   ├── auth.py                               # JWT authentication and authorization
│   ├── models.py                             # Pydantic schemas (request/response models)
│   ├── database.py                           # MongoDB connection configuration
│   ├── requirements.txt                      # Python dependency manifest
│   └── venv/                                 # Python virtual environment (git-ignored)
│
└── frontend/                                 # Next.js 16 frontend application
    ├── package.json                          # Node.js dependency manifest and scripts
    ├── tsconfig.json                         # TypeScript compiler configuration
    ├── postcss.config.mjs                    # PostCSS / Tailwind CSS configuration
    ├── next.config.ts                        # Next.js framework configuration
    │
    └── src/
        ├── app/
        │   ├── layout.tsx                    # Root layout (fonts, metadata)
        │   ├── page.tsx                      # Root page (redirects to /login)
        │   ├── globals.css                   # Global styles, CSS variables, animations
        │   │
        │   ├── login/
        │   │   └── page.tsx                  # Authentication page
        │   │
        │   └── dashboard/
        │       ├── layout.tsx                # Dashboard shell (sidebar + header + context)
        │       ├── page.tsx                  # Overview — all modules combined
        │       ├── stress-index/page.tsx     # Stress Index detail view
        │       ├── departments/page.tsx      # Department Health detail view
        │       ├── alerts/page.tsx           # Emergency Alerts detail view
        │       ├── workload/page.tsx         # Workload Distribution detail view
        │       ├── resources/page.tsx        # Resource Utilization detail view
        │       └── blood-bank/page.tsx       # Blood Bank Inventory detail view
        │
        ├── components/
        │   ├── dashboard/
        │   │   ├── DashboardContext.tsx       # React Context provider (shared state)
        │   │   ├── DashboardHeader.tsx        # Top navigation bar
        │   │   ├── Sidebar.tsx                # Collapsible side navigation
        │   │   ├── StressIndex.tsx            # Stress Index gauge component
        │   │   ├── DepartmentHealth.tsx       # Department status cards
        │   │   ├── EmergencyAlerts.tsx        # Alert list component
        │   │   ├── WorkloadChart.tsx          # Recharts bar chart
        │   │   ├── ResourceUtilization.tsx    # Resource metric cards
        │   │   └── BloodBankMonitor.tsx       # Blood inventory display
        │   │
        │   └── ui/                            # Reusable UI primitives (shadcn/ui pattern)
        │       ├── badge.tsx                  # Status badge (success/warning/danger)
        │       ├── button.tsx                 # Button with variant support
        │       ├── card.tsx                   # Card container components
        │       ├── input.tsx                  # Form input component
        │       └── progress.tsx               # Progress bar component
        │
        └── lib/
            ├── api.ts                         # HTTP client, token management, type defs
            └── utils.ts                       # Utility functions (cn class merger)
```

---

## Configuration

### Environment Variables

The application uses sensible defaults for development. Override these for production deployments.

#### Backend (`backend/`)

| Variable     | Default                                    | Description                        |
| ------------ | ------------------------------------------ | ---------------------------------- |
| `JWT_SECRET` | `hospital-ops-dashboard-secret-key-2024`   | Secret key for signing JWT tokens. **Change in production.** |
| `MONGO_URL`  | `mongodb://localhost:27017`                | MongoDB connection URI             |
| `DB_NAME`    | `hospital_ops_dashboard`                   | MongoDB database name              |

#### Frontend (`frontend/`)

| Variable              | Default                  | Description                  |
| --------------------- | ------------------------ | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000`  | Backend API base URL         |

### Example `.env` Files

<details>
<summary><strong>backend/.env</strong></summary>

```env
JWT_SECRET=your-production-secret-key-here
MONGO_URL=mongodb://localhost:27017
DB_NAME=hospital_ops_dashboard
```

</details>

<details>
<summary><strong>frontend/.env.local</strong></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

</details>

---

## Authentication

### Mechanism

The application implements **JWT (JSON Web Token)** authentication using the `HS256` algorithm.

| Property         | Value                          |
| ---------------- | ------------------------------ |
| Algorithm        | HS256                          |
| Token Expiry     | 24 hours                       |
| Password Hashing | bcrypt (via passlib)           |
| Header Format    | `Authorization: Bearer <token>`|

### Demo Credentials

| Field        | Value                |
| ------------ | -------------------- |
| Email        | `admin@hospital.com` |
| Password     | `admin123`           |

### Authentication Flow

```
Client                              Server
  │                                    │
  │  POST /api/auth/login              │
  │  { email, password }               │
  │───────────────────────────────────▶│
  │                                    │  Validate credentials against bcrypt hash
  │                                    │  Generate JWT with 24h expiry
  │  { access_token, admin_name }      │
  │◀───────────────────────────────────│
  │                                    │
  │  GET /api/dashboard                │
  │  Authorization: Bearer <token>     │
  │───────────────────────────────────▶│
  │                                    │  Decode and verify JWT
  │                                    │  Return dashboard data
  │  { stress_index, departments, ... }│
  │◀───────────────────────────────────│
```

Token management is handled client-side via `localStorage`. Expired or invalid tokens trigger an automatic redirect to the login page.

---

## Dashboard Modules

### 1. Hospital Stress Index

**Route:** `/dashboard/stress-index`

A composite score (0–100) representing overall hospital operational pressure, computed from four weighted factors.

#### Scoring Formula

$$\text{Stress Index} = (B \times 0.30) + (W \times 0.25) + (D \times 0.25) + (E \times 0.20)$$

Where each factor is normalized to a 0–100 scale:

| Factor                  | Symbol | Normalization                            | Weight |
| ----------------------- | ------ | ---------------------------------------- | ------ |
| Bed Occupancy Rate      | B      | Actual percentage (capped at 100)        | 30%    |
| Average Waiting Time    | W      | `min(avg_wait / 120 × 100, 100)`        | 25%    |
| Doctor Workload         | D      | `min(avg_patients / 15 × 100, 100)`     | 25%    |
| Emergency Case Load     | E      | `min(emergency_count / 30 × 100, 100)`  | 20%    |

#### Status Classification

| Level      | Range  | Interpretation                                        |
| ---------- | ------ | ----------------------------------------------------- |
| Normal     | 0–49   | Operations within acceptable limits                   |
| Busy       | 50–74  | Elevated pressure; proactive resource allocation advised |
| Critical   | 75–100 | Immediate administrative intervention required        |

**UI Components:** Circular SVG gauge, factor breakdown bars, trend indicator (up/down/stable), interpretation guide.

---

### 2. Department Health Monitor

**Route:** `/dashboard/departments`

Real-time health classification for 10 hospital departments.

#### Departments

Emergency · ICU · Cardiology · Neurology · Orthopedics · Pediatrics · Oncology · General Medicine · Surgery · Obstetrics

#### Per-Department Metrics

- Patients waiting / admitted
- Doctors available vs. total assigned
- Bed occupancy percentage (with progress bar)
- Average wait time (minutes)
- Total cases handled today

#### Status Thresholds

| Status      | Condition                                                           |
| ----------- | ------------------------------------------------------------------- |
| Normal      | Bed occupancy < 70% **and** patients waiting < 8                    |
| Moderate    | Bed occupancy ≥ 70% **or** patients waiting ≥ 8                    |
| Overloaded  | Bed occupancy ≥ 90%, **or** patients waiting ≥ 15, **or** ≤ 1 doctor on duty |

---

### 3. Emergency Alert Panel

**Route:** `/dashboard/alerts`

Automated operational alerts generated by rule-based evaluation of current metrics.

#### Alert Rules

| Rule                            | Trigger Condition               | Severity |
| ------------------------------- | ------------------------------- | -------- |
| ICU Capacity Warning            | ICU bed occupancy ≥ 90%         | Critical |
| ER Wait Time (Critical)         | ER average wait > 60 minutes    | Critical |
| ER Wait Time (Elevated)         | ER average wait > 30 minutes    | Warning  |
| Staff Shortage                  | ≤ 1 doctor on duty in any dept  | Warning  |
| Blood Stock Depletion           | Any blood type < 50% threshold  | Critical |
| Hospital-Wide Occupancy (High)  | Overall bed occupancy ≥ 95%     | Critical |
| Hospital-Wide Occupancy (Watch) | Overall bed occupancy ≥ 85%     | Warning  |
| Emergency Overload              | ≥ 20 active emergency cases     | Critical |

**UI Components:** Severity-coded alert cards, department-grouped view, summary counters (critical/warning/info), timestamps.

---

### 4. Department Workload Chart

**Route:** `/dashboard/workload`

Visual distribution of cases handled across departments with utilization-based color coding.

| Utilization Band | Color  | Range       |
| ---------------- | ------ | ----------- |
| Normal           | Green  | < 60%       |
| Moderate         | Yellow | 60% – 80%   |
| High             | Red    | > 80%       |

**UI Components:** Interactive Recharts `BarChart` with tooltips, summary cards (high/medium/normal counts), detailed breakdown with progress bars.

---

### 5. Resource Utilization Panel

**Route:** `/dashboard/resources`

Aggregated snapshot of hospital-wide operational metrics.

| Metric                    | Description                                |
| ------------------------- | ------------------------------------------ |
| Total Patients Today      | All patients across departments             |
| Doctors On Duty           | Currently active medical staff              |
| Appointments Today        | Total scheduled appointments                |
| Appointments Completed    | Completed appointment count                 |
| Emergency Cases           | Active emergency department cases           |
| Bed Occupancy Rate        | Percentage of occupied beds                 |
| Average Waiting Time      | Mean patient wait across departments (min)  |
| Patients Discharged Today | Discharge count for the current day         |

**UI Components:** Metric cards grid, bed utilization gauge, appointment completion progress, staff overview panel.

---

### 6. Blood Bank Monitor

**Route:** `/dashboard/blood-bank`

Real-time inventory monitoring for 8 blood types with threshold-based alerting.

#### Blood Types Tracked

A+ · A− · B+ · B− · AB+ · AB− · O+ · O−

#### Stock Level Classification

| Level    | Condition                          | Action Required                   |
| -------- | ---------------------------------- | --------------------------------- |
| Safe     | Units > threshold                  | No action needed                  |
| Moderate | Units ≤ threshold                  | Schedule replenishment            |
| Critical | Units ≤ 50% of threshold          | Immediate procurement required    |

**UI Components:** Blood type cards with level indicators, progress bars, alerts panel for critical stocks, total unit count.

---

## API Reference

**Base URL:** `http://localhost:8000`

All responses use `application/json` content type.

### Public Endpoints

#### Health Check

```http
GET /api/health
```

**Response** `200 OK`

```json
{
  "status": "healthy",
  "service": "Hospital Ops Dashboard"
}
```

#### Admin Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body**

```json
{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

**Response** `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "admin_name": "Hospital Administrator"
}
```

**Error** `401 Unauthorized`

```json
{
  "detail": "Invalid email or password"
}
```

---

### Protected Endpoints

All protected endpoints require the following header:

```
Authorization: Bearer <access_token>
```

Unauthorized requests return `401` with `{"detail": "Invalid or expired token"}`.

| Method | Endpoint                      | Response Model        | Description                         |
| ------ | ----------------------------- | --------------------- | ----------------------------------- |
| GET    | `/api/auth/verify`            | `VerifyResponse`      | Validate current token              |
| GET    | `/api/dashboard`              | `DashboardData`       | Complete dashboard payload          |
| GET    | `/api/dashboard/stress-index` | `StressIndex`         | Stress index score and breakdown    |
| GET    | `/api/dashboard/departments`  | `DepartmentHealth[]`  | Per-department health status        |
| GET    | `/api/dashboard/alerts`       | `Alert[]`             | Active operational alerts           |
| GET    | `/api/dashboard/workload`     | `DepartmentWorkload[]`| Workload distribution by department |
| GET    | `/api/dashboard/resources`    | `ResourceUtilization` | Hospital-wide resource metrics      |
| GET    | `/api/dashboard/blood-bank`   | `BloodBankStatus`     | Blood inventory and alerts          |

#### Full Dashboard Response

```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Response** `200 OK`

```json
{
  "stress_index": {
    "score": 68.4,
    "level": "Busy",
    "bed_occupancy_pct": 82.3,
    "avg_waiting_time": 34.5,
    "doctor_workload": 8.2,
    "emergency_load": 15,
    "trend": "up"
  },
  "departments": [
    {
      "name": "Emergency",
      "status": "Moderate",
      "patients_waiting": 12,
      "patients_admitted": 18,
      "doctors_available": 3,
      "doctors_total": 5,
      "bed_occupancy_pct": 88.0,
      "avg_wait_time": 42.5,
      "cases_today": 35
    }
  ],
  "alerts": [
    {
      "id": "a1b2c3d4",
      "title": "ICU Capacity Warning",
      "message": "ICU bed occupancy at 94% — consider patient transfers",
      "severity": "critical",
      "department": "ICU",
      "timestamp": "2026-03-06T14:30:00",
      "acknowledged": false
    }
  ],
  "department_workload": [
    {
      "department": "Emergency",
      "cases": 35,
      "capacity": 40,
      "utilization_pct": 87.5
    }
  ],
  "resource_utilization": {
    "total_patients_today": 127,
    "doctors_on_duty": 22,
    "appointments_today": 95,
    "appointments_completed": 67,
    "emergency_cases": 15,
    "bed_occupancy_rate": 82.3,
    "total_beds": 255,
    "occupied_beds": 210,
    "avg_waiting_time": 34.5,
    "patients_discharged_today": 18
  },
  "blood_bank": {
    "inventory": [
      {
        "blood_type": "O+",
        "units_available": 18,
        "threshold": 15,
        "level": "Safe",
        "percentage": 120.0
      }
    ],
    "total_units": 112,
    "alerts": ["A- stock critical: 4 units remaining (threshold: 10)"]
  },
  "last_updated": "2026-03-06T14:30:00"
}
```

---

## Backend Design

### Layer Responsibilities

```
┌────────────────────────────────────────────────────────────────┐
│                     backend/main.py                            │
│  FastAPI application, CORS config, route handlers, lifespan    │
├────────────────────────────────────────────────────────────────┤
│                     backend/analytics.py                       │
│  AnalyticsEngine class — scoring, thresholds, alert rules      │
├────────────────────────────────────────────────────────────────┤
│                     backend/adapter.py                         │
│  HISAdapter class — aggregates raw → department statistics     │
├────────────────────────────────────────────────────────────────┤
│                     backend/mock_his.py                        │
│  MockHIS class — simulated data generation (singleton)         │
├────────────────────────────────────────────────────────────────┤
│                     backend/auth.py                            │
│  JWT creation, verification, password hashing                  │
├────────────────────────────────────────────────────────────────┤
│                     backend/models.py                          │
│  Pydantic V2 schemas — all request/response types              │
└────────────────────────────────────────────────────────────────┘
```

### Mock HIS — Data Generation (`mock_his.py`)

Simulates a realistic Hospital Information System with stochastic, time-varying data:

| Entity          | Volume         | Key Attributes                                                        |
| --------------- | -------------- | --------------------------------------------------------------------- |
| Patients        | 85–140         | Department, status (waiting/admitted/discharged/emergency), priority (1–5) |
| Doctors         | 30             | Department, status (on-duty/off-duty/on-break), patient count         |
| Beds            | 255            | Department, status (occupied/available/maintenance)                   |
| Appointments    | 60–120/day     | Department, time slot, status (scheduled/completed/cancelled/in-progress) |
| Blood Bank      | 8 types        | Units available, threshold, last updated                              |
| Emergency Cases | 8–25           | Severity (critical/severe/moderate), wait time, treatment status      |

Occupancy rates are department-specific: ICU and Emergency target 75–98%, other departments 45–85%.

### Adapter Layer (`adapter.py`)

Transforms raw HIS entities into department-aggregated statistics:

- **`get_bed_stats()`** — Total/occupied/available beds per department + overall occupancy rate
- **`get_patient_stats()`** — Per-department patient counts by status, average waiting time
- **`get_doctor_stats()`** — On-duty/off-duty breakdown, average workload per doctor
- **`get_appointment_stats()`** — Scheduled/completed/cancelled counts
- **`get_blood_bank_stats()`** — Stock levels with threshold comparison
- **`get_emergency_stats()`** — Active cases, severity distribution, average wait

### Analytics Engine (`analytics.py`)

Applies business logic to adapted data:

| Method                          | Output Model           | Logic                                              |
| ------------------------------- | ---------------------- | -------------------------------------------------- |
| `compute_stress_index()`        | `StressIndex`          | Weighted multi-factor score (bed/wait/workload/ER)  |
| `compute_department_health()`   | `DepartmentHealth[]`   | Threshold-based status per department               |
| `generate_alerts()`             | `Alert[]`              | Rule evaluation against 8 predefined conditions     |
| `compute_department_workload()` | `DepartmentWorkload[]` | Cases vs. capacity with utilization percentage      |
| `compute_resource_utilization()`| `ResourceUtilization`  | Aggregated hospital-wide metrics                    |
| `compute_blood_bank()`          | `BloodBankStatus`      | Inventory with level classification + alert strings |
| `get_dashboard_data()`          | `DashboardData`        | Orchestrates all above into a single response       |

---

## Frontend Design

### Routing Architecture

The application uses the **Next.js App Router** with nested layouts.

```
/                          → Redirect to /login
/login                     → Authentication page (public)
/dashboard                 → Overview — all 6 modules (protected)
/dashboard/stress-index    → Stress Index detail (protected)
/dashboard/departments     → Department Health detail (protected)
/dashboard/alerts          → Emergency Alerts detail (protected)
/dashboard/workload        → Workload Distribution detail (protected)
/dashboard/resources       → Resource Utilization detail (protected)
/dashboard/blood-bank      → Blood Bank Inventory detail (protected)
```

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
  ├── LoginPage (app/login/page.tsx)
  └── DashboardLayout (app/dashboard/layout.tsx)
        ├── DashboardProvider (React Context)
        ├── Sidebar (collapsible navigation)
        ├── DashboardHeader (top bar)
        └── {children} (routed page content)
```

### State Management Strategy

| Concern          | Method              | Scope                                |
| ---------------- | ------------------- | ------------------------------------ |
| Dashboard data   | React Context       | All `/dashboard/*` routes            |
| Auth token       | `localStorage`      | Persistent across browser sessions   |
| Auto-refresh     | `setInterval`       | 30-second polling cycle              |
| UI state         | Component `useState` | Local to individual components       |

### Component Architecture

UI components follow the [shadcn/ui](https://ui.shadcn.com) design pattern:

1. **Headless behavior** via Radix UI primitives (`@radix-ui/react-*`)
2. **Visual variants** via `class-variance-authority` (CVA)
3. **Class composition** via `cn()` utility (`clsx` + `tailwind-merge`)

### Visual Design System

| Property             | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| Color Mode           | Dark theme exclusively                                  |
| Background           | `#0a0f1c` (deep navy)                                   |
| Accent Palette       | Blue (`#3b82f6`) / Purple / Cyan gradients              |
| Surface Treatment    | Glass-morphism (`backdrop-filter: blur`)                 |
| Card Interaction     | `translateY(-2px)` + shadow elevation on hover          |
| Animations           | `fadeIn`, `slideInLeft`, `pulse-glow` keyframes         |
| Scrollbar            | Custom styled (thin, dark track, blue thumb)             |
| Grid Breakpoints     | 1 col (mobile) → 2 col (md) → 3 col (lg) → 4 col (xl) |

---

## Data Models

### Enumerations

```
DepartmentStatus  : Normal | Moderate | Overloaded
HospitalStressLevel : Normal | Busy | Critical
AlertSeverity     : info | warning | critical
BloodStockLevel   : Safe | Moderate | Critical
```

### Core Response Schemas

<details>
<summary><strong>StressIndex</strong></summary>

| Field               | Type   | Description                          |
| ------------------- | ------ | ------------------------------------ |
| `score`             | float  | Composite score (0–100)              |
| `level`             | enum   | Normal / Busy / Critical             |
| `bed_occupancy_pct` | float  | Current bed occupancy percentage     |
| `avg_waiting_time`  | float  | Average patient wait (minutes)       |
| `doctor_workload`   | float  | Average patients per on-duty doctor  |
| `emergency_load`    | float  | Active emergency case count          |
| `trend`             | string | `up` / `down` / `stable`            |

</details>

<details>
<summary><strong>DepartmentHealth</strong></summary>

| Field               | Type   | Description                           |
| ------------------- | ------ | ------------------------------------- |
| `name`              | string | Department name                       |
| `status`            | enum   | Normal / Moderate / Overloaded        |
| `patients_waiting`  | int    | Patients currently waiting            |
| `patients_admitted` | int    | Patients currently admitted           |
| `doctors_available` | int    | Doctors currently on duty             |
| `doctors_total`     | int    | Total doctors assigned to department  |
| `bed_occupancy_pct` | float  | Bed utilization percentage            |
| `avg_wait_time`     | float  | Average wait time (minutes)           |
| `cases_today`       | int    | Total cases handled today             |

</details>

<details>
<summary><strong>Alert</strong></summary>

| Field           | Type     | Description                    |
| --------------- | -------- | ------------------------------ |
| `id`            | string   | Unique alert identifier        |
| `title`         | string   | Alert title                    |
| `message`       | string   | Descriptive alert message      |
| `severity`      | enum     | info / warning / critical      |
| `department`    | string?  | Associated department (if any) |
| `timestamp`     | datetime | Alert generation time          |
| `acknowledged`  | bool     | Whether alert has been acked   |

</details>

<details>
<summary><strong>ResourceUtilization</strong></summary>

| Field                       | Type  | Description                      |
| --------------------------- | ----- | -------------------------------- |
| `total_patients_today`      | int   | Total patient count              |
| `doctors_on_duty`           | int   | Active medical staff             |
| `appointments_today`        | int   | Total scheduled appointments     |
| `appointments_completed`    | int   | Completed appointments           |
| `emergency_cases`           | int   | Active emergency cases           |
| `bed_occupancy_rate`        | float | Overall bed utilization (%)      |
| `total_beds`                | int   | Total hospital bed count         |
| `occupied_beds`             | int   | Currently occupied beds          |
| `avg_waiting_time`          | float | Mean patient wait (minutes)      |
| `patients_discharged_today` | int   | Discharged patient count         |

</details>

<details>
<summary><strong>BloodBankStatus</strong></summary>

| Field         | Type             | Description                          |
| ------------- | ---------------- | ------------------------------------ |
| `inventory`   | BloodBankItem[]  | Per-type inventory details           |
| `total_units` | int              | Sum of all available units           |
| `alerts`      | string[]         | Critical stock alert messages        |

**BloodBankItem:**

| Field             | Type   | Description                            |
| ----------------- | ------ | -------------------------------------- |
| `blood_type`      | string | Blood group (A+, A−, B+, etc.)         |
| `units_available`  | int    | Current unit count                     |
| `threshold`       | int    | Minimum safe stock level               |
| `level`           | enum   | Safe / Moderate / Critical             |
| `percentage`      | float  | `(units / threshold) × 100`            |

</details>

---

## Troubleshooting

### Common Issues

<details>
<summary><strong>Backend: <code>ModuleNotFoundError</code> when running <code>python main.py</code></strong></summary>

Ensure the virtual environment is activated:

```bash
cd backend
source venv/bin/activate    # Linux/macOS
python main.py
```

If dependencies are missing, reinstall:

```bash
pip install -r requirements.txt
```

</details>

<details>
<summary><strong>Backend: <code>externally-managed-environment</code> error (PEP 668)</strong></summary>

Do **not** install packages into the system Python. Use the virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

</details>

<details>
<summary><strong>Frontend: CORS errors in the browser console</strong></summary>

Ensure the backend is running on port 8000. The FastAPI server is configured to allow requests from `http://localhost:3000` and `http://127.0.0.1:3000` only. If running the frontend on a different port, update the `allow_origins` list in `backend/main.py`.

</details>

<details>
<summary><strong>Frontend: Login succeeds but dashboard shows "Loading..."</strong></summary>

1. Verify the backend is running: `curl http://localhost:8000/api/health`
2. Check the browser console for network errors
3. Ensure the API URL in `frontend/src/lib/api.ts` matches the backend address

</details>

<details>
<summary><strong>Frontend: <code>npm install</code> fails with dependency conflicts</strong></summary>

Try installing with the legacy peer dependency resolution:

```bash
npm install --legacy-peer-deps
```

</details>

---

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development workflow
- Code style and conventions
- Pull request process
- Issue reporting

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for the full text.
