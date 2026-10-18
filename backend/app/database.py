import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_Name", "quizapp")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(MONGO_URI)
    db_instance.db = db_instance.client[DB_NAME]
    print(f"Connected to MongoDB Atlas: {DB_NAME}")

async def close_mongo_connection():
    db_instance.client.close()
    print("Closed MongoDB connection")