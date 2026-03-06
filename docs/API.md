# Hospital Operations Intelligence Dashboard — API Documentation

## Base URL

```
http://localhost:8000
```

All endpoints return `application/json` responses. Protected endpoints require a valid JWT token in the `Authorization` header.

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Health Check](#2-health-check)
3. [Dashboard — Full Payload](#3-dashboard--full-payload)
4. [Stress Index](#4-stress-index)
5. [Department Health](#5-department-health)
6. [Alerts](#6-alerts)
7. [Department Workload](#7-department-workload)
8. [Resource Utilization](#8-resource-utilization)
9. [Blood Bank](#9-blood-bank)
10. [Error Responses](#10-error-responses)
11. [Data Models](#11-data-models)

---

## 1. Authentication

### POST `/api/auth/login`

Authenticate an administrator and receive a JWT access token.

**Request**

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "admin@hospital.com",
  "password": "admin123"
}
```

| Field      | Type   | Required | Description         |
| ---------- | ------ | -------- | ------------------- |
| `email`    | string | Yes      | Admin email address |
| `password` | string | Yes      | Admin password      |

**Response** — `200 OK`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBob3NwaXRhbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDk5MzI4MDB9.abc123",
  "token_type": "bearer",
  "admin_name": "Hospital Administrator"
}
```

| Field          | Type   | Description                              |
| -------------- | ------ | ---------------------------------------- |
| `access_token` | string | JWT token (valid for 24 hours)           |
| `token_type`   | string | Always `"bearer"`                        |
| `admin_name`   | string | Display name of the authenticated admin  |

**Error** — `401 Unauthorized`

```json
{
  "detail": "Invalid email or password"
}
```

### GET `/api/auth/verify`

Verify the validity of the current access token.

**Request**

```http
GET /api/auth/verify HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
{
  "valid": true,
  "email": "admin@hospital.com",
  "admin_name": "Hospital Administrator"
}
```

---

## 2. Health Check

### GET `/api/health`

Returns the service health status. No authentication required.

**Request**

```http
GET /api/health HTTP/1.1
```

**Response** — `200 OK`

```json
{
  "status": "healthy",
  "service": "Hospital Ops Dashboard"
}
```

---

## 3. Dashboard — Full Payload

### GET `/api/dashboard`

Returns the complete dashboard data including all six analytics modules in a single response.

**Request**

```http
GET /api/dashboard HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
{
  "stress_index": { ... },
  "departments": [ ... ],
  "alerts": [ ... ],
  "department_workload": [ ... ],
  "resource_utilization": { ... },
  "blood_bank": { ... },
  "last_updated": "2026-03-06T14:30:00.000Z"
}
```

See individual sections below for the schema of each nested object.

| Field                   | Type                  | Description                          |
| ----------------------- | --------------------- | ------------------------------------ |
| `stress_index`          | `StressIndex`         | Hospital stress score and breakdown  |
| `departments`           | `DepartmentHealth[]`  | Per-department health status         |
| `alerts`                | `Alert[]`             | Active operational alerts            |
| `department_workload`   | `DepartmentWorkload[]`| Cases and utilization by department  |
| `resource_utilization`  | `ResourceUtilization` | Hospital-wide resource metrics       |
| `blood_bank`            | `BloodBankStatus`     | Blood inventory and alerts           |
| `last_updated`          | `datetime`            | ISO 8601 timestamp of data snapshot  |

---

## 4. Stress Index

### GET `/api/dashboard/stress-index`

Returns the composite hospital stress index with factor breakdown.

**Request**

```http
GET /api/dashboard/stress-index HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
{
  "score": 68.4,
  "level": "Busy",
  "bed_occupancy_pct": 82.3,
  "avg_waiting_time": 34.5,
  "doctor_workload": 8.2,
  "emergency_load": 15.0,
  "trend": "up"
}
```

| Field               | Type   | Range/Values                     | Description                              |
| ------------------- | ------ | -------------------------------- | ---------------------------------------- |
| `score`             | float  | 0.0 – 100.0                     | Composite stress score                   |
| `level`             | string | `Normal` / `Busy` / `Critical`  | Severity classification                  |
| `bed_occupancy_pct` | float  | 0.0 – 100.0                     | Current bed occupancy percentage         |
| `avg_waiting_time`  | float  | ≥ 0                             | Average patient wait time (minutes)      |
| `doctor_workload`   | float  | ≥ 0                             | Average patients per on-duty doctor      |
| `emergency_load`    | float  | ≥ 0                             | Active emergency case count              |
| `trend`             | string | `up` / `down` / `stable`        | Score direction compared to previous     |

---

## 5. Department Health

### GET `/api/dashboard/departments`

Returns health status for all 10 hospital departments.

**Request**

```http
GET /api/dashboard/departments HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
[
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
  },
  {
    "name": "ICU",
    "status": "Overloaded",
    "patients_waiting": 4,
    "patients_admitted": 14,
    "doctors_available": 2,
    "doctors_total": 3,
    "bed_occupancy_pct": 93.3,
    "avg_wait_time": 15.0,
    "cases_today": 18
  }
]
```

| Field               | Type   | Description                              |
| ------------------- | ------ | ---------------------------------------- |
| `name`              | string | Department name                          |
| `status`            | string | `Normal` / `Moderate` / `Overloaded`     |
| `patients_waiting`  | int    | Currently waiting patient count          |
| `patients_admitted` | int    | Currently admitted patient count         |
| `doctors_available` | int    | Doctors currently on duty                |
| `doctors_total`     | int    | Total doctors assigned to department     |
| `bed_occupancy_pct` | float  | Bed utilization percentage               |
| `avg_wait_time`     | float  | Average wait time in minutes             |
| `cases_today`       | int    | Total cases handled today                |

---

## 6. Alerts

### GET `/api/dashboard/alerts`

Returns active operational alerts sorted by severity.

**Request**

```http
GET /api/dashboard/alerts HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "ICU Capacity Warning",
    "message": "ICU bed occupancy at 94% — consider patient transfers",
    "severity": "critical",
    "department": "ICU",
    "timestamp": "2026-03-06T14:30:00.000Z",
    "acknowledged": false
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "title": "ER Wait Time Elevated",
    "message": "Emergency department average wait time exceeds 30 minutes",
    "severity": "warning",
    "department": "Emergency",
    "timestamp": "2026-03-06T14:28:00.000Z",
    "acknowledged": false
  }
]
```

| Field          | Type     | Description                                |
| -------------- | -------- | ------------------------------------------ |
| `id`           | string   | UUID — unique alert identifier             |
| `title`        | string   | Short alert title                          |
| `message`      | string   | Descriptive alert message                  |
| `severity`     | string   | `info` / `warning` / `critical`            |
| `department`   | string?  | Associated department (null if global)     |
| `timestamp`    | datetime | ISO 8601 alert generation timestamp        |
| `acknowledged` | boolean  | Whether the alert has been acknowledged    |

---

## 7. Department Workload

### GET `/api/dashboard/workload`

Returns case distribution and utilization percentage for each department.

**Request**

```http
GET /api/dashboard/workload HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
[
  {
    "department": "Emergency",
    "cases": 35,
    "capacity": 40,
    "utilization_pct": 87.5
  },
  {
    "department": "ICU",
    "cases": 18,
    "capacity": 15,
    "utilization_pct": 120.0
  }
]
```

| Field              | Type   | Description                                |
| ------------------ | ------ | ------------------------------------------ |
| `department`       | string | Department name                            |
| `cases`            | int    | Cases handled today                        |
| `capacity`         | int    | Estimated daily case capacity              |
| `utilization_pct`  | float  | `(cases / capacity) × 100`                |

---

## 8. Resource Utilization

### GET `/api/dashboard/resources`

Returns aggregated hospital-wide operational metrics.

**Request**

```http
GET /api/dashboard/resources HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
{
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
}
```

| Field                       | Type  | Description                        |
| --------------------------- | ----- | ---------------------------------- |
| `total_patients_today`      | int   | Total patients across departments  |
| `doctors_on_duty`           | int   | Currently active medical staff     |
| `appointments_today`        | int   | Total scheduled appointments       |
| `appointments_completed`    | int   | Completed appointments count       |
| `emergency_cases`           | int   | Active emergency cases             |
| `bed_occupancy_rate`        | float | Overall bed utilization (%)        |
| `total_beds`                | int   | Hospital-wide bed count            |
| `occupied_beds`             | int   | Currently occupied beds            |
| `avg_waiting_time`          | float | Mean patient wait (minutes)        |
| `patients_discharged_today` | int   | Patients discharged today          |

---

## 9. Blood Bank

### GET `/api/dashboard/blood-bank`

Returns blood inventory status for all 8 blood types with alerts.

**Request**

```http
GET /api/dashboard/blood-bank HTTP/1.1
Authorization: Bearer <access_token>
```

**Response** — `200 OK`

```json
{
  "inventory": [
    {
      "blood_type": "A+",
      "units_available": 22,
      "threshold": 15,
      "level": "Safe",
      "percentage": 146.7
    },
    {
      "blood_type": "A-",
      "units_available": 4,
      "threshold": 10,
      "level": "Critical",
      "percentage": 40.0
    },
    {
      "blood_type": "B+",
      "units_available": 18,
      "threshold": 12,
      "level": "Safe",
      "percentage": 150.0
    },
    {
      "blood_type": "B-",
      "units_available": 8,
      "threshold": 8,
      "level": "Moderate",
      "percentage": 100.0
    },
    {
      "blood_type": "AB+",
      "units_available": 12,
      "threshold": 8,
      "level": "Safe",
      "percentage": 150.0
    },
    {
      "blood_type": "AB-",
      "units_available": 3,
      "threshold": 5,
      "level": "Critical",
      "percentage": 60.0
    },
    {
      "blood_type": "O+",
      "units_available": 25,
      "threshold": 15,
      "level": "Safe",
      "percentage": 166.7
    },
    {
      "blood_type": "O-",
      "units_available": 9,
      "threshold": 10,
      "level": "Moderate",
      "percentage": 90.0
    }
  ],
  "total_units": 101,
  "alerts": [
    "A- stock critical: 4 units remaining (threshold: 10)",
    "AB- stock critical: 3 units remaining (threshold: 5)"
  ]
}
```

**BloodBankStatus Fields**

| Field         | Type             | Description                               |
| ------------- | ---------------- | ----------------------------------------- |
| `inventory`   | BloodBankItem[]  | Per-type inventory details                |
| `total_units` | int              | Sum of all available units                |
| `alerts`      | string[]         | Human-readable critical stock alert texts |

**BloodBankItem Fields**

| Field              | Type   | Description                                  |
| ------------------ | ------ | -------------------------------------------- |
| `blood_type`       | string | Blood group identifier (A+, A−, B+, etc.)   |
| `units_available`  | int    | Current unit count in stock                  |
| `threshold`        | int    | Minimum safe stock level                     |
| `level`            | string | `Safe` / `Moderate` / `Critical`             |
| `percentage`       | float  | `(units_available / threshold) × 100`        |

---

## 10. Error Responses

All endpoints return standard HTTP error codes with JSON bodies.

### 401 Unauthorized

Returned when authentication fails or the token is invalid/expired.

```json
{
  "detail": "Invalid email or password"
}
```

```json
{
  "detail": "Invalid or expired token"
}
```

### 403 Forbidden

Returned when the token is valid but the user lacks permissions.

```json
{
  "detail": "Invalid credentials"
}
```

### 422 Unprocessable Entity

Returned when request body validation fails.

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

---

## 11. Data Models

### Enumerations

| Enum                  | Values                            | Used In                  |
| --------------------- | --------------------------------- | ------------------------ |
| `DepartmentStatus`    | Normal, Moderate, Overloaded      | DepartmentHealth         |
| `HospitalStressLevel` | Normal, Busy, Critical            | StressIndex              |
| `AlertSeverity`       | info, warning, critical           | Alert                    |
| `BloodStockLevel`     | Safe, Moderate, Critical          | BloodBankItem            |

### Request Models

| Model          | Endpoint            | Fields                  |
| -------------- | ------------------- | ----------------------- |
| `LoginRequest` | POST /api/auth/login | email (str), password (str) |

### Response Models

| Model                 | Endpoint                       | Description                    |
| --------------------- | ------------------------------ | ------------------------------ |
| `TokenResponse`       | POST /api/auth/login            | JWT token + admin name         |
| `DashboardData`       | GET /api/dashboard              | Complete dashboard payload     |
| `StressIndex`         | GET /api/dashboard/stress-index | Score + factor breakdown       |
| `DepartmentHealth`    | GET /api/dashboard/departments  | Per-department status + stats  |
| `Alert`               | GET /api/dashboard/alerts       | Alert with severity + metadata |
| `DepartmentWorkload`  | GET /api/dashboard/workload     | Cases, capacity, utilization   |
| `ResourceUtilization` | GET /api/dashboard/resources    | Hospital-wide metrics          |
| `BloodBankStatus`     | GET /api/dashboard/blood-bank   | Inventory + alerts             |

---

## Quick Reference

```bash
# Health check
curl http://localhost:8000/api/health

# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"admin123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# Fetch full dashboard
curl -s http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Fetch individual modules
curl -s http://localhost:8000/api/dashboard/stress-index -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8000/api/dashboard/departments  -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8000/api/dashboard/alerts        -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8000/api/dashboard/workload      -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8000/api/dashboard/resources     -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:8000/api/dashboard/blood-bank    -H "Authorization: Bearer $TOKEN"
```
