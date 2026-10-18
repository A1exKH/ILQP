from fastapi import APIRouter, HTTPException, status, Query
from app.database import db_instance
from app.models import AttemptCreate
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any

router = APIRouter()

# Helper function to format attempt documents for JSON serialization
def attempt_helper(attempt) -> dict:
    return {
        "id": str(attempt["_id"]),
        "deckId": str(attempt["deckId"]),
        "userId": attempt.get("userId", "guest_user"),
        "score": attempt.get("score"),
        "totalQuestions": attempt.get("totalQuestions"),
        "percentage": attempt.get("percentage"),
        "completionTimeMs": attempt.get("completionTimeMs"),
        "createdAt": attempt.get("createdAt")
    }

# ========================================================
# 1. POST: SUBMIT COMPLETED QUIZ ATTEMPT & CALCULATE SCORE
# ========================================================
@router.post("", status_code=status.HTTP_201_CREATED, response_model=dict)
async def submit_quiz_attempt(attempt_data: AttemptCreate):
    # Validate deck ID format
    if not ObjectId.is_valid(attempt_data.deckId):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deck ID format")

    # Fetch the target deck to check correct answers
    deck = await db_instance.db["decks"].find_one({"_id": ObjectId(attempt_data.deckId)})
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz deck not found")

    questions = deck.get("questions", [])
    total_questions = len(questions)
    user_answers = attempt_data.answers

    # Automatically calculate score server-side for security and integrity
    correct_count = 0
    for index, question in enumerate(questions):
        if index < len(user_answers) and user_answers[index] == question.get("correctOptionIndex"):
            correct_count += 1

    percentage = round((correct_count / total_questions) * 100, 2) if total_questions > 0 else 0.0

    # Build document to insert into MongoDB 'attempts' collection
    attempt_dict = {
        "deckId": ObjectId(attempt_data.deckId),
        "userId": attempt_data.userId,
        "answers": user_answers,
        "score": correct_count,
        "totalQuestions": total_questions,
        "percentage": percentage,
        "completionTimeMs": attempt_data.completionTimeMs,
        "createdAt": datetime.utcnow()
    }

    result = await db_instance.db["attempts"].insert_one(attempt_dict)
    created_attempt = await db_instance.db["attempts"].find_one({"_id": result.inserted_id})

    return attempt_helper(created_attempt)

# ========================================================
# 2. GET: FULL QUIZ HISTORY FOR A SPECIFIC USER
# ========================================================
@router.get("/user/{userId}", response_model=List[dict])
async def get_user_attempts(
    userId: str,
    limit: int = Query(10, ge=1, le=50, description="Max number of history items to return")
):
    cursor = db_instance.db["attempts"].find({"userId": userId}).sort("createdAt", -1).limit(limit)
    attempts = await cursor.to_list(length=limit)
    return [attempt_helper(att) for att in attempts]

# ========================================================
# 3. GET: HISTORICAL RESULTS FOR A SPECIFIC DECK
# ========================================================
@router.get("/deck/{deckId}", response_model=List[dict])
async def get_deck_attempts(deckId: str):
    if not ObjectId.is_valid(deckId):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deck ID format")

    cursor = db_instance.db["attempts"].find({"deckId": ObjectId(deckId)}).sort("createdAt", -1)
    attempts = await cursor.to_list(length=100)
    return [attempt_helper(att) for att in attempts]