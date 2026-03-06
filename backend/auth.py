"""
Authentication module with JWT tokens.
"""
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.getenv("JWT_SECRET", "hospital-ops-dashboard-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Predefined admin credentials
ADMIN_EMAIL = "admin@hospital.com"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME = "Hospital Administrator"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pre-hash the admin password
ADMIN_PASSWORD_HASH = pwd_context.hash(ADMIN_PASSWORD)


def verify_admin(email: str, password: str) -> bool:
    """Verify admin credentials."""
    if email != ADMIN_EMAIL:
        return False
    return pwd_context.verify(password, ADMIN_PASSWORD_HASH)


def create_access_token(data: dict) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    """Verify JWT token from Authorization header."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email != ADMIN_EMAIL:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
