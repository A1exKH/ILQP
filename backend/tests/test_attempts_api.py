import pytest
from httpx import AsyncClient

# ---------------------------------------------------------
# Helper fixture to create a temporary test deck first
# so our attempt tests have a valid deckId to target.
# ---------------------------------------------------------
@pytest.fixture
async def seeded_deck_id(async_client: AsyncClient) -> str:
    deck_payload = {
        "title": "CI Test Deck for Attempts",
        "description": "Temporary deck for testing quiz submissions",
        "category": "testing",
        "difficulty": "Beginner",
        "questions": [
            {
                "prompt": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correctOptionIndex": 1  # Answer is "4"
            },
            {
                "prompt": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correctOptionIndex": 2  # Answer is "Paris"
            }
        ]
    }
    response = await async_client.post("/api/decks", json=deck_payload)
    if response.status_code in [200, 201]:
        data = response.json()
        return data.get("id") or data.get("_id")
    return "650123456789abcdef012345"  # Fallback mock ID if creation fails


# ---------------------------------------------------------
# 1. POST /api/attempts Tests (Submissions & Scoring)
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_submit_quiz_attempt_perfect_score(async_client: AsyncClient, seeded_deck_id: str):
    """Verify submitting all correct answers yields a 100% score."""
    submission = {
        "deckId": seeded_deck_id,
        "userId": "user_alpha_123",
        "answers": [1, 2],  # Both correct indexes based on seeded deck
        "completionTimeMs": 30000
    }
    response = await async_client.post("/api/attempts", json=submission)
    assert response.status_code in [200, 201]
    data = response.json()
    assert data.get("score") == 100.0 or data.get("percentage") == 100.0


@pytest.mark.asyncio
async def test_submit_quiz_attempt_zero_score(async_client: AsyncClient, seeded_deck_id: str):
    """Verify submitting all incorrect answers yields a 0% score."""
    submission = {
        "deckId": seeded_deck_id,
        "userId": "user_beta_456",
        "answers": [0, 0],  # Both incorrect
        "completionTimeMs": 25000
    }
    response = await async_client.post("/api/attempts", json=submission)
    assert response.status_code in [200, 201]
    data = response.json()
    assert data.get("score") == 0.0 or data.get("percentage") == 0.0


@pytest.mark.asyncio
async def test_submit_quiz_attempt_nonexistent_deck(async_client: AsyncClient):
    """Negative scenario: Submitting an attempt for a non-existent deck returns 404."""
    submission = {
        "deckId": "000000000000000000000000",  # Fake ID
        "userId": "user_gamma_789",
        "answers": [0],
        "completionTimeMs": 15000
    }
    response = await async_client.post("/api/attempts", json=submission)
    assert response.status_code == 404


# ---------------------------------------------------------
# 2. GET /api/attempts/user/{userId} Tests
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_user_quiz_history(async_client: AsyncClient):
    """Verify fetching quiz history for a specific user returns a list."""
    user_id = "user_alpha_123"
    response = await async_client.get(f"/api/attempts/user/{user_id}?limit=10")
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)


@pytest.mark.asyncio
async def test_get_nonexistent_user_history_empty(async_client: AsyncClient):
    """Edge case: User with no history returns an empty list cleanly."""
    response = await async_client.get("/api/attempts/user/completely_unknown_user_xyz")
    assert response.status_code == 200
    assert response.json() == []


# ---------------------------------------------------------
# 3. GET /api/attempts/deck/{deckId} Tests
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_get_deck_historical_results(async_client: AsyncClient, seeded_deck_id: str):
    """Verify fetching historical results for a specific deck."""
    response = await async_client.get(f"/api/attempts/deck/{seeded_deck_id}")
    assert response.status_code == 200
    results = response.json()
    assert isinstance(results, list)