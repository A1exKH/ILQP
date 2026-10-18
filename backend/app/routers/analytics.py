from fastapi import APIRouter, Query
from app.database import db_instance
from typing import Optional

router = APIRouter()

# ========================================================
# 1. GET: AGGREGATED USER STATS & DASHBOARD ANALYTICS
# ========================================================
@router.get("/dashboard", response_model=dict)
async def get_dashboard_analytics(
    userId: Optional[str] = Query("guest_user", description="Filter analytics for a specific user ID")
):
    # MongoDB Aggregation Pipeline utilizing $facet for simultaneous global & category metrics
    pipeline = [
        # Stage 1: Filter by user
        {"$match": {"userId": userId}},
        # Stage 2: Join with 'decks' collection to retrieve category metadata
        {
            "$lookup": {
                "from": "decks",
                "localField": "deckId",
                "foreignField": "_id",
                "as": "deckInfo"
            }
        },
        # Unwind the array returned by lookup
        {"$unwind": "$deckInfo"},
        # Stage 3: Split into two parallel processing branches using $facet
        {
            "$facet": {
                # Branch A: Overall global summary statistics
                "overall": [
                    {
                        "$group": {
                            "_id": None,
                            "totalQuizzesTaken": {"$sum": 1},
                            "averageScore": {"$avg": "$percentage"},
                            "totalTimeSpentMs": {"$sum": "$completionTimeMs"}
                        }
                    }
                ],
                # Branch B: Mastery breakdown grouped by category
                "byCategory": [
                    {
                        "$group": {
                            "_id": "$deckInfo.category",
                            "quizzesTaken": {"$sum": 1},
                            "averagePercentage": {"$avg": "$percentage"}
                        }
                    }
                ]
            }
        }
    ]

    # Execute aggregation cursor
    cursor = db_instance.db["attempts"].aggregate(pipeline)
    result_list = await cursor.to_list(length=1)

    # Default fallback if user has zero quiz attempts recorded yet
    if not result_list or not result_list[0]["overall"]:
        return {
            "userId": userId,
            "totalQuizzesTaken": 0,
            "averageScore": 0.0,
            "totalTimeSpentSeconds": 0,
            "categoryMastery": []
        }

    raw_overall = result_list[0]["overall"][0]
    raw_categories = result_list[0]["byCategory"]

    # Format category breakdown list
    category_mastery = []
    for cat in raw_categories:
        category_mastery.append({
            "category": cat["_id"] or "uncategorized",
            "quizzesTaken": cat["quizzesTaken"],
            "averagePercentage": round(cat["averagePercentage"], 2)
        })

    total_ms = raw_overall.get("totalTimeSpentMs", 0)

    return {
        "userId": userId,
        "totalQuizzesTaken": raw_overall.get("totalQuizzesTaken", 0),
        "averageScore": round(raw_overall.get("averageScore", 0.0), 2),
        "totalTimeSpentSeconds": round(total_ms / 1000, 1),
        "categoryMastery": category_mastery
    }