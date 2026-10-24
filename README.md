# Interactive Learning & Quiz Platform (ILQP)
A modern flashcard & quiz builder where users create custom decks, tag them by language/topic, and take timed practice quizzes to test their knowledge.

## Project Documentation & Standards

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Accessibility Statement](ACCESSIBILITY.md)
- [MIT License](LICENSE)

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

#### REST API Route Definitions for Decks & Questions (/api/decks):
| Method  | Endpoint       | Description                                            | Request Body / Query                         | 
| :---: | :---: | :---: | :---: |
| GET     | /api/decks     | Fetch all decks (supports category/difficulty filters) | Query: ?category=spanish&difficulty=Beginner | 
| GET     | /api/decks/:id | Get single deck details (includes embedded questions)  | None                                         | 
| POST    | /api/decks     | Create a new quiz deck with questions                  | DeckCreateSchema                             | 
| PUT     | /api/decks/:id | Update deck metadata or question list                  | Updated Deck Object                          | 
| DELETE  | /api/decks/:id | Delete a deck and its associated attempts              | None                                         | 

#### REST API for Quiz Engine & Submissions (/api/attempts)
| Method | Endpoint                   | Description                                     | Request Body /Query                   |  
| :---: |  :---: |  :---: |  :---: | 
| GET    | /api/attempts              | Submit completed quiz attempt & calculate score | { deckId, answers, completionTimeMs } | 
| GET    | /api/attempts/user/:userId | Get full quiz history for a specific user       | Query: ?limit=10                      | 
| GET    | /api/attempts/deck/:deckId | Get historical results for a specific deck      | None                                  | 

#### REST API for Analytics & Dashboard (/api/analytics)
| Method | Endpoint                 | Description                              | Response Data |    
| :---: |  :---: |  :---: |  :---: | 
| GET    | /api/analytics/dashboard | Aggregated user stats across all quizzes | Total quizzes taken, average score, total time spent, mastery breakdown by category |


### How to run the project locally:
1. Clone the repository.
2. Install dependencies.
3. For backend, run `ILQP/backend$ python3 -m uvicorn app.main:app --reload --port 8010`.
4. For frontend, run `ILQP/frontend$ npm run dev`.


### Project wiki:
Here you can find application UI screenshots.
#### Main page View
<img width="1000" height="500" alt="ILQP. Main page" src="https://github.com/user-attachments/assets/1c2fde61-95dd-4adc-814f-f01ab84976e5" />

#### Quiz Taker View
<img width="1000" height="500" alt="ILQP. Quiz Taker View" src="https://github.com/user-attachments/assets/feb3d2a9-8b1e-450f-89f5-94251d407640" />

#### Learning & Analytics Dashboard Progress
<img width="1000" height="500" alt="ILQP. Learning & Analytics Dashboard Progress" src="https://github.com/user-attachments/assets/2cfbd25a-7cb6-4374-8b3a-b034ea5dbb7a" />

#### Custom Deck Builder
<img width="1000" height="700" alt="ILQP. Custom Deck Builder" src="https://github.com/user-attachments/assets/ed97c9e5-b852-44f8-8af9-f5d8ae2b9ea7" />

More information can be found on [project wiki](https://github.com/A1exKH/ILQP/wiki/ILQP-manual).

There you can find more details about project and more screenshots.
