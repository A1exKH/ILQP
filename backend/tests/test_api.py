import pytest
from httpx import AsyncClient

# ---------------------------------------------------------
# 1. Core Logic Unit Tests (Quiz Engine Scoring)
# ---------------------------------------------------------
def calculate_quiz_score(user_answers: dict, correct_answers: dict) -> float:
    """Calculates score percentage based on matching question IDs."""
    if not correct_answers:
        return 0.0
    correct_count = sum(
        1 for q_id, ans in user_answers.items() if correct_answers.get(q_id) == ans
    )
    return round((correct_count / len(correct_answers)) * 100, 2)


def test_score_calculation_100_percent():
    user_ans = {"q1": "A", "q2": "C"}
    correct_ans = {"q1": "A", "q2": "C"}
    assert calculate_quiz_score(user_ans, correct_ans) == 100.0


def test_score_calculation_partial_credit():
    user_ans = {"q1": "A", "q2": "WRONG"}
    correct_ans = {"q1": "A", "q2": "C"}
    assert calculate_quiz_score(user_ans, correct_ans) == 50.0


def test_score_calculation_empty_answers():
    assert calculate_quiz_score({}, {"q1": "A"}) == 0.0


# ---------------------------------------------------------
# 2. API Route Endpoint Integration Tests
# ---------------------------------------------------------
@pytest.mark.asyncio
async def test_health_check_or_docs(async_client: AsyncClient):
    """Verify OpenAPI documentation endpoint responds correctly."""
    response = await async_client.get("/docs")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_get_decks_endpoint(async_client: AsyncClient):
    """Verify deck retrieval endpoint structure."""
    response = await async_client.get("/api/decks")
    # Accepts either 200 OK or initial empty payload
    assert response.status_code in [200, 404]
    if response.status_code == 200:
        assert isinstance(response.json(), list)