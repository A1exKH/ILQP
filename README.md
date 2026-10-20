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
