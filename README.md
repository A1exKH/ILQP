# Interactive Learning & Quiz Platform (ILQP)
A modern flashcard & quiz builder where users create custom decks, tag them by language/topic, and take timed practice quizzes to test their knowledge.

## Core Features:
#### 1. Deck & Card Management (CRUD): 
Create, edit, and delete quiz decks with multiple-choice or short-answer cards.
#### 2. Interactive Quiz Runner: 
React state engine to take quizzes, track elapsed time, and give immediate feedback.
#### 3. Results & Analytics Dashboard: 
Show pass/fail rates, time spent per quiz, and mastery percentage per topic.


## Architecture Overview Diagram: 
React Frontend -> FastAPI -> MongoDB Atlas

## MongoDB Data Architecture & Schemas:
Python + FastAPI + Motor (Async MongoDB)

## Sample Aggregation Pipeline Code Snippet: 
Demonstrating MongoDB index optimization

## Live Demo / Deployment Link: 
Hosted on GCP Cloud Run free tier.

### Swagger API Documentation:
Available at: `/docs` endpoint of the deployed FastAPI backend, e.g., `https://your-deployment-url/docs`.
On your local machine, you can access it at `http://localhost:8010/docs` after running the FastAPI server.