"""
Database configuration for MongoDB connection.
"""
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "hospital_ops_dashboard")

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print(f"✅ Connected to MongoDB: {DB_NAME}")
    return db


async def close_db():
    global client
    if client:
        client.close()
        print("❌ MongoDB connection closed")


def get_db():
    return db
