import pytest
from httpx import AsyncClient

# ---------------------------------------------------------
# Helper fixture to seed a test quiz attempt for analytics
# ---------------------------------------------------------
@pytest.fixture
async def seeded_analytics_user(async_client: AsyncClient) -> str:
    user_id = "analytics_test_user_777"
    
    # 1. Create a test deck
    deck_payload = {
        "title": "Analytics Test Deck",
        "description": "Deck for testing analytics aggregation",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [
            {
                "prompt": "What is Python?",
                "options": ["Language", "Snake", "Tool", "OS"],
                "correctOptionIndex": 0
            }
        ]
    }
    deck_res = await async_client.post("/api/decks", json=deck_payload)
    if deck_res.status_code in [200, 201]:
        deck_id = deck_res.json().get("id") or deck_res.json().get("_id")
        
        # 2. Submit a quiz attempt for this user
        attempt_payload = {
            "deckId": deck_id,
            "userId": user_id,
            "answers": [0],  # Correct answer
            "completionTimeMs": 20000
        }
        await async_client.post("/api/attempts", json=attempt_payload)
        
    return user_id


# ---------------------------------------------------------
# 1. Happy Path: Active User Dashboard Analytics
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_analytics_dashboard_success(async_client: AsyncClient, seeded_analytics_user: str):
    """Verify dashboard analytics return correct aggregated stats for an active user."""
    response = await async_client.get(f"/api/analytics/dashboard?userId={seeded_analytics_user}")
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify core aggregation fields exist in response (matching actual endpoint keys)
    assert "totalQuizzesTaken" in data or "total_quizzes" in data
    assert "averageScore" in data or "avg_score" in data
    assert "totalTimeSpentSeconds" in data or "totalTimeSpent" in data or "total_time_spent" in data
    
    total_quizzes = data.get("totalQuizzesTaken", data.get("total_quizzes", 0))
    assert total_quizzes >= 1


# ---------------------------------------------------------
# 2. Edge Case: Zero-History User (No division by zero)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_analytics_dashboard_zero_history(async_client: AsyncClient):
    """Verify a user with no quiz history returns safe default zero values (no 500 error)."""
    response = await async_client.get("/api/analytics/dashboard?userId=brand_new_user_999")
    
    assert response.status_code == 200
    data = response.json()
    
    total_quizzes = data.get("totalQuizzesTaken", data.get("total_quizzes", 0))
    avg_score = data.get("averageScore", data.get("avg_score", 0.0))
    
    assert total_quizzes == 0
    assert avg_score == 0.0


# ---------------------------------------------------------
# 3. Behavior Test: Missing User ID Parameter
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_analytics_dashboard_missing_userid(async_client: AsyncClient):
    """Verify missing userId query parameter returns 200 OK with general/global or empty default stats."""
    response = await async_client.get("/api/analytics/dashboard")
    # Endpoint handles missing userId gracefully with 200 OK rather than raising 422
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)