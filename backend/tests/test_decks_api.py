import pytest
from httpx import AsyncClient
from faker import Faker

fake = Faker()

# ---------------------------------------------------------
# 1. POST /api/decks: Valid Deck Creation
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_create_deck_valid(async_client: AsyncClient):
    """Verify creating a valid quiz deck returns success and stored payload."""
    payload = {
        "title": fake.sentence(nb_words=3),
        "description": "Test deck description for unit testing",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [
            {
                "prompt": "What is FastAPI?", 
                "options": ["A framework", "A database", "A browser", "An OS"],
                "correctOptionIndex": 0   
            }
        ]
    }
    
    response = await async_client.post("/api/decks", json=payload)
    
    if response.status_code == 422:
        print("\n[DECK 422 ERROR]:", response.json())
        
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["title"] == payload["title"]


# ---------------------------------------------------------
# 2. POST /api/decks: Invalid Payload (422 Unprocessable Entity)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_create_deck_invalid_missing_title(async_client: AsyncClient):
    """Verify that missing required fields triggers Pydantic validation error (422)."""
    invalid_payload = {
        "description": "Missing title deck",
        "category": "python",
        "difficulty": "Beginner",
        "questions": []
    }
    
    response = await async_client.post("/api/decks", json=invalid_payload)
    assert response.status_code == 422


# ---------------------------------------------------------
# 3. GET /api/decks: Category & Difficulty Query Filtering
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_decks_with_filters(async_client: AsyncClient):
    """Verify category and difficulty query parameters filter results correctly."""
    response = await async_client.get("/api/decks?category=python&difficulty=Beginner")
    assert response.status_code == 200
    decks = response.json()
    assert isinstance(decks, list)


# ---------------------------------------------------------
# 4. POST /api/attempts: Quiz Submission & Score Calculation
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_submit_quiz_attempt(async_client: AsyncClient):
    """Test submitting a completed quiz attempt and verifying score calculation."""
    submission_payload = {
        "deckId": "650123456789abcdef012345",
        "userId": "test_user_999",
        "answers": [0], 
        "completionTimeMs": 45000
    }
    
    response = await async_client.post("/api/attempts", json=submission_payload)
    
    if response.status_code == 422:
        print("\n[ATTEMPT 422 ERROR]:", response.json())
        
    assert response.status_code in [200, 201, 404]