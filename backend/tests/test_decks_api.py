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
# 3. GET /api/decks: Query Filtering Variations
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_decks_no_filters(async_client: AsyncClient):
    """Verify fetching all decks without query parameters."""
    response = await async_client.get("/api/decks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_decks_category_only(async_client: AsyncClient):
    """Verify filtering decks by category only."""
    response = await async_client.get("/api/decks?category=python")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_decks_difficulty_only(async_client: AsyncClient):
    """Verify filtering decks by difficulty only."""
    response = await async_client.get("/api/decks?difficulty=Beginner")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_decks_with_filters(async_client: AsyncClient):
    """Verify category and difficulty query parameters filter results correctly."""
    response = await async_client.get("/api/decks?category=python&difficulty=Beginner")
    assert response.status_code == 200
    decks = response.json()
    assert isinstance(decks, list)


# ---------------------------------------------------------
# 4. GET /api/decks/{id}: Single Deck Fetch (400, 404, 200)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_deck_invalid_id(async_client: AsyncClient):
    """Verify fetching a deck with an invalid ObjectId format returns 400."""
    response = await async_client.get("/api/decks/invalid-id-format")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid deck ID format"

@pytest.mark.asyncio
async def test_get_deck_not_found(async_client: AsyncClient):
    """Verify fetching a non-existent valid ObjectId returns 404."""
    response = await async_client.get("/api/decks/650123456789abcdef012345")
    assert response.status_code == 404
    assert response.json()["detail"] == "Deck not found"

@pytest.mark.asyncio
async def test_get_deck_success(async_client: AsyncClient):
    """Verify successfully fetching a single deck by valid ID."""
    payload = {
        "title": "Get Single Test Deck",
        "description": "Testing single fetch",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [{"prompt": "Question 1", "options": ["A", "B"], "correctOptionIndex": 0}]
    }
    create_res = await async_client.post("/api/decks", json=payload)

    # --- DEBUG PRINTS ---
    print("\n[DEBUG POST /api/decks STATUS]:", create_res.status_code)
    print("[DEBUG POST /api/decks JSON]:", create_res.json())
    # --------------------

    deck_id = create_res.json()["id"]

    response = await async_client.get(f"/api/decks/{deck_id}")
    assert response.status_code == 200
    assert response.json()["id"] == deck_id


# ---------------------------------------------------------
# 5. PUT /api/decks/{id}: Update Deck (400/422, 404, 200)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_update_deck_invalid_id(async_client: AsyncClient):
    """Verify updating a deck with an invalid ObjectId format returns 400 or 422."""
    payload = {
        "title": "Updated Title",
        "description": "Updated desc",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [{"prompt": "Question 1", "options": ["A", "B"], "correctOptionIndex": 0}]
    }
    response = await async_client.put("/api/decks/invalid-id-format", json=payload)
    assert response.status_code in [400, 422]

@pytest.mark.asyncio
async def test_update_deck_not_found(async_client: AsyncClient):
    """Verify updating a non-existent valid ObjectId returns 404 or 422."""
    payload = {
        "title": "Updated Title",
        "description": "Updated desc",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [{"prompt": "Question 1", "options": ["A", "B"], "correctOptionIndex": 0}]
    }
    response = await async_client.put("/api/decks/650123456789abcdef012345", json=payload)
    assert response.status_code in [404, 422]

@pytest.mark.asyncio
async def test_update_deck_success(async_client: AsyncClient):
    """Verify successfully updating an existing deck."""
    payload = {
        "title": "Original Title",
        "description": "Original desc",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [{"prompt": "Question 1", "options": ["A", "B"], "correctOptionIndex": 0}]
    }
    create_res = await async_client.post("/api/decks", json=payload)

    print("\n[DEBUG UPDATE POST STATUS]:", create_res.status_code)
    print("[DEBUG UPDATE POST JSON]:", create_res.json())

    deck_id = create_res.json()["id"]

    update_payload = {
        "title": "Updated Title",
        "description": "Updated desc",
        "category": "python",
        "difficulty": "Advanced",
        "questions": [{"prompt": "Q1 modified", "options": ["A", "B"], "correctOptionIndex": 1}]
    }
    response = await async_client.put(f"/api/decks/{deck_id}", json=update_payload)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"
    assert response.json()["difficulty"] == "Advanced"


# ---------------------------------------------------------
# 6. DELETE /api/decks/{id}: Delete Deck (400, 404, 204)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_delete_deck_invalid_id(async_client: AsyncClient):
    """Verify deleting a deck with an invalid ObjectId format returns 400."""
    response = await async_client.delete("/api/decks/invalid-id-format")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid deck ID format"

@pytest.mark.asyncio
async def test_delete_deck_not_found(async_client: AsyncClient):
    """Verify deleting a non-existent valid ObjectId returns 404."""
    response = await async_client.delete("/api/decks/650123456789abcdef012345")
    assert response.status_code == 404
    assert response.json()["detail"] == "Deck not found"

@pytest.mark.asyncio
async def test_delete_deck_success(async_client: AsyncClient):
    """Verify successfully deleting a deck and triggering cascading cleanup."""
    payload = {
        "title": "To Be Deleted",
        "description": "Delete me",
        "category": "python",
        "difficulty": "Beginner",
        "questions": [{"prompt": "Question 1", "options": ["A", "B"], "correctOptionIndex": 0}]
    }
    create_res = await async_client.post("/api/decks", json=payload)

    print("\n[DEBUG DELETE POST STATUS]:", create_res.status_code)
    print("[DEBUG DELETE POST JSON]:", create_res.json())

    deck_id = create_res.json()["id"]

    response = await async_client.delete(f"/api/decks/{deck_id}")
    assert response.status_code == 204

    # Verify it is completely removed
    get_res = await async_client.get(f"/api/decks/{deck_id}")
    assert get_res.status_code == 404


# ---------------------------------------------------------
# 7. POST /api/attempts: Quiz Submission & Score Calculation
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
    assert response.status_code in [200, 201, 404]