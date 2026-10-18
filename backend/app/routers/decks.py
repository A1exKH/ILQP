from fastapi import APIRouter, HTTPException, status, Query
from app.database import db_instance
from app.models import DeckCreate
from bson import ObjectId
from datetime import datetime
from typing import Optional, List

router = APIRouter()

# Helper function to convert MongoDB document to JSON-friendly dict
def deck_helper(deck) -> dict:
    # Clean questions array to strip/ignore any Mongoose subdocument _id fields
    cleaned_questions = []
    for q in deck.get("questions", []):
        cleaned_questions.append({
            "prompt": q.get("prompt"),
            "options": q.get("options"),
            "correctOptionIndex": q.get("correctOptionIndex"),
            "explanation": q.get("explanation", "")
        })

    return {
        "id": str(deck["_id"]),
        "title": deck.get("title"),
        "description": deck.get("description", ""),
        "category": deck.get("category"),
        "difficulty": deck.get("difficulty"),
        "tags": deck.get("tags", []),
        "questions": cleaned_questions,
        "createdAt": deck.get("createdAt"),
        "updatedAt": deck.get("updatedAt")
    }

# ==========================================
# 1. GET ALL DECKS (with optional filters)
# ==========================================
@router.get("", response_model=List[dict])
async def get_decks(
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty")
):
    query = {}
    if category:
        query["category"] = category.lower()
    if difficulty:
        query["difficulty"] = difficulty

    decks_cursor = db_instance.db["decks"].find(query)
    decks = await decks_cursor.to_list(length=100)
    return [deck_helper(deck) for deck in decks]

# ==========================================
# 2. GET SINGLE DECK BY ID
# ==========================================
@router.get("/{id}", response_model=dict)
async def get_deck(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deck ID format")
    
    deck = await db_instance.db["decks"].find_one({"_id": ObjectId(id)})
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")
        
    return deck_helper(deck)

# ==========================================
# 3. POST: CREATE A NEW DECK
# ==========================================
@router.post("", status_code=status.HTTP_201_CREATED, response_model=dict)
async def create_deck(deck_data: DeckCreate):
    deck_dict = deck_data.dict()
    now = datetime.utcnow()
    
    deck_dict["createdAt"] = now
    deck_dict["updatedAt"] = now
    # Ensure category is stored lowercase for index consistency
    deck_dict["category"] = deck_dict["category"].lower()

    result = await db_instance.db["decks"].insert_one(deck_dict)
    created_deck = await db_instance.db["decks"].find_one({"_id": result.inserted_id})
    
    return deck_helper(created_deck)

# ==========================================
# 4. PUT: UPDATE AN EXISTING DECK
# ==========================================
@router.put("/{id}", response_model=dict)
async def update_deck(id: str, deck_data: DeckCreate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deck ID format")

    update_dict = deck_data.dict()
    update_dict["updatedAt"] = datetime.utcnow()
    update_dict["category"] = update_dict["category"].lower()

    result = await db_instance.db["decks"].update_one(
        {"_id": ObjectId(id)},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")

    updated_deck = await db_instance.db["decks"].find_one({"_id": ObjectId(id)})
    return deck_helper(updated_deck)

# ==========================================
# 5. DELETE: DELETE A DECK & ATTEMPTS
# ==========================================
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deck(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deck ID format")

    deck_id_obj = ObjectId(id)

    # Delete the deck
    result = await db_instance.db["decks"].delete_one({"_id": deck_id_obj})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deck not found")

    # Cascading delete: clean up associated quiz attempts for data integrity
    await db_instance.db["attempts"].delete_many({"deckId": deck_id_obj})

    return None