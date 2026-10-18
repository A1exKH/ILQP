from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ==========================================
# 1. QUESTION SCHEMAS
# ==========================================
class Question(BaseModel):
    prompt: str = Field(..., min_length=3, description="The quiz question text")
    options: List[str] = Field(..., min_items=2, description="Possible answer choices")
    correctOptionIndex: int = Field(..., ge=0, le=4, description="Index of the correct option")
    explanation: Optional[str] = Field("", description="Explanation shown after answering")

    
# ==========================================
# 2. DECK SCHEMAS (CRUD)
# ==========================================
class DeckCreate(BaseModel):
    title: str = Field(..., min_length=2, description="Deck title")
    description: Optional[str] = Field("", description="Brief overview of the deck")
    category: str = Field(..., description="Subject category (e.g., javascript, spanish)")
    difficulty: str = Field("Beginner", pattern="^(Beginner|Intermediate|Advanced)$")
    tags: List[str] = Field([], description="Search tags")
    questions: List[Question] = Field(..., description="List of embedded questions")

class DeckResponse(DeckCreate):
    id: str = Field(..., alias="_id", description="MongoDB unique identifier string")
    createdAt: datetime
    updatedAt: datetime

    class Config:
        populate_by_name = True


# ==========================================
# 3. QUIZ ATTEMPT & SUBMISSION SCHEMAS
# ==========================================
class AttemptCreate(BaseModel):
    deckId: str = Field(..., description="ID of the quiz deck being attempted")
    userId: str = Field("guest_user", description="User identifier")
    answers: List[int] = Field(..., description="Array of selected option indices")
    completionTimeMs: int = Field(..., ge=0, description="Time elapsed in milliseconds")

class AttemptResponse(BaseModel):
    id: str
    deckId: str
    userId: str
    score: int
    totalQuestions: int
    percentage: float
    completionTimeMs: int
    createdAt: datetime


# ==========================================
# 4. ANALYTICS & DASHBOARD SCHEMAS
# ==========================================
class CategoryMasteryItem(BaseModel):
    category: str
    quizzesTaken: int
    averagePercentage: float

class DashboardResponse(BaseModel):
    userId: str
    totalQuizzesTaken: int
    averageScore: float
    totalTimeSpentSeconds: float
    categoryMastery: List[CategoryMasteryItem]