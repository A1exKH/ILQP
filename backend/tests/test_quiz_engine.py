import pytest

# ---------------------------------------------------------
# 1. Quiz Engine Core Functions 
# ---------------------------------------------------------
def calculate_score(user_answers: dict, correct_answers: dict) -> float:
    """Calculates score percentage based on matching question IDs."""
    if not correct_answers:
        return 0.0
    correct_count = sum(
        1 for q_id, ans in user_answers.items() if correct_answers.get(q_id) == ans
    )
    return round((correct_count / len(correct_answers)) * 100, 2)


def calculate_average_time_per_question(total_seconds: int, question_count: int) -> float:
    """Calculates average seconds spent per question, handling edge cases."""
    if question_count <= 0 or total_seconds < 0:
        return 0.0
    return round(total_seconds / question_count, 2)


def validate_completion_time(time_spent_seconds: int, min_seconds: int = 5, max_seconds: int = 7200) -> bool:
    """Validates that a quiz completion time falls within realistic bounds."""
    return min_seconds <= time_spent_seconds <= max_seconds


# ---------------------------------------------------------
# 2. Score Calculation Unit Tests
# ---------------------------------------------------------
def test_calculate_score_100_percent():
    """Verify 100% score calculation when all answers are correct."""
    user_ans = {"q1": "A", "q2": "B", "q3": "C"}
    correct_ans = {"q1": "A", "q2": "B", "q3": "C"}
    assert calculate_score(user_ans, correct_ans) == 100.0


def test_calculate_score_zero_percent():
    """Verify 0% score calculation when all answers are incorrect."""
    user_ans = {"q1": "WRONG", "q2": "WRONG"}
    correct_ans = {"q1": "A", "q2": "B"}
    assert calculate_score(user_ans, correct_ans) == 0.0


def test_calculate_score_partial_credit():
    """Verify correct percentage calculation for partial scores."""
    user_ans = {"q1": "A", "q2": "WRONG", "q3": "C", "q4": "WRONG"}
    correct_ans = {"q1": "A", "q2": "B", "q3": "C", "q4": "D"}
    # 2 out of 4 correct = 50.0%
    assert calculate_score(user_ans, correct_ans) == 50.0


def test_calculate_score_empty_correct_answers():
    """Verify edge case where correct answers dictionary is empty."""
    user_ans = {"q1": "A"}
    correct_ans = {}
    assert calculate_score(user_ans, correct_ans) == 0.0


# ---------------------------------------------------------
# 3. Time Calculation & Validation Unit Tests
# ---------------------------------------------------------
def test_calculate_average_time_per_question():
    """Verify average time calculation per question."""
    # 120 seconds for 4 questions = 30.0 seconds per question
    assert calculate_average_time_per_question(120, 4) == 30.0


def test_calculate_average_time_edge_cases():
    """Verify time calculation handles zero or negative inputs safely."""
    assert calculate_average_time_per_question(100, 0) == 0.0
    assert calculate_average_time_per_question(-50, 5) == 0.0


def test_validate_completion_time_valid():
    """Verify realistic completion times pass validation."""
    assert validate_completion_time(45) is True      # 45 seconds
    assert validate_completion_time(300) is True     # 5 minutes


def test_validate_completion_time_invalid():
    """Verify unrealistically fast or slow completion times fail validation."""
    assert validate_completion_time(2) is False      # Too fast (under 5s min)
    assert validate_completion_time(10000) is False  # Too slow (over 2hr max)
    assert validate_completion_time(-15) is False    # Negative time