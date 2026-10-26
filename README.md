# Interactive Learning & Quiz Platform (ILQP)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248)](https://www.mongodb.com/atlas)
[![Backend CI](https://github.com/A1exKH/ILQP/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/A1exKH/ILQP/actions/workflows/backend-ci.yml)

A modern, full-stack flashcard and quiz creation platform designed for interactive learning. 

Users can build custom decks, tag them by topic or language, take timed practice quizzes with immediate feedback, and track learning progress using detailed analytics.

## Application Preview

| Main Catalog View | Quiz Taker Experience |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/1c2fde61-95dd-4adc-814f-f01ab84976e5" width="450" alt="Main Page View"/> | <img src="https://github.com/user-attachments/assets/feb3d2a9-8b1e-450f-89f5-94251d407640" width="450" alt="Quiz Taker View"/> |

| Analytics & Progress Dashboard | Custom Deck Builder |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/2cfbd25a-7cb6-4374-8b3a-b034ea5dbb7a" width="450" alt="Analytics Dashboard"/> | <img src="https://github.com/user-attachments/assets/ed97c9e5-b852-44f8-8af9-f5d8ae2b9ea7" width="450" alt="Custom Deck Builder"/> |

*For full user guides and high-resolution workflows, visit the [ILQP Project Wiki](https://github.com/A1exKH/ILQP/wiki/ILQP-manual).*

## Core Features
* **Deck & Card Management (CRUD):** Create, edit, and delete custom quiz decks with multiple-choice and short-answer questions.
* **Interactive Quiz Runner:** Dynamic React state engine tracking elapsed time, instant answer validation, and score calculation.
* **Analytics & Progress Dashboard:** Real-time data visualization showing pass/fail rates, completion speed, and topic mastery breakdown.
* **High-Performance MongoDB Engine:** Optimized compound B-tree indexes ensuring sub-millisecond query responses across thousands of decks and user attempts.

## Architecture Overview

```text
┌──────────────────────────┐      REST API (JSON)      ┌─────────────────────────┐
│     React + Vite         │ ────────────────────────> │     FastAPI Backend     │
│   (TypeScript / Tailwind)│ <──────────────────────── │  (Python / Pydantic)    │
└──────────────────────────┘                           └────────────┬────────────┘
                                                                    │ Motor Async
                                                                    ▼
                                                       ┌─────────────────────────┐
                                                       │   MongoDB Atlas Cluster │
                                                       │  (Compound Indexes)     │
                                                       └─────────────────────────┘
```

## Database Architecture & Index Optimization
The database uses **Async Motor** driver queries over MongoDB Atlas. To support fast catalog filtering and chronological history rendering under heavy load, two compound indexes are enforced at startup:
1. **Deck Filtering Index**: { category: 1, difficulty: 1 }
2. **User History Index**: { userId: 1, createdAt: -1 }

### Benchmark Execution Stats 
Tested against 10,000 seeded mock documents:
| Query Metric       | Baseline (Unindexed)  | Optimized (Compound Index) | Performance Gain | 
| :---: | :---: | :---: | :---: |
| Scan Strategy      | COLLSCAN (Full Table) | FIXSCAN (B-Tree Index)     | Direct Lookup    | 
| Documents Examined | 10,000 docs           | ~12 docs                   | 99.8% reduction  |
| Execution Speed    | ~68 ms                | ~2 ms                      | ~34x Speedup     |


## REST API Specifications

Interactive Swagger API documentation is available at /docs (e.g., http://localhost:8010/docs).

### 1. Decks & Questions (/api/decks)
| Method  | Endpoint       | Description                                            | Request Body / Query                         | 
| :---: | :---: | :---: | :---: |
| GET     | /api/decks     | Fetch all decks (supports category/difficulty filters) | Query: ?category=spanish&difficulty=Beginner | 
| GET     | /api/decks/:id | Get single deck details (includes embedded questions)  | None                                         | 
| POST    | /api/decks     | Create a new quiz deck with questions                  | DeckCreateSchema                             | 
| PUT     | /api/decks/:id | Update deck metadata or question list                  | Updated Deck Object                          | 
| DELETE  | /api/decks/:id | Delete a deck and its associated attempts              | None                                         | 

### 2. Quiz Engine & Submissions (/api/attempts)
| Method | Endpoint                   | Description                                     | Request Body /Query                   |  
| :---: |  :---: |  :---: |  :---: | 
| POST   | /api/attempts              | Submit completed quiz attempt & calculate score | { deckId, answers, completionTimeMs } | 
| GET    | /api/attempts/user/:userId | Get full quiz history for a specific user       | Query: ?limit=10                      | 
| GET    | /api/attempts/deck/:deckId | Get historical results for a specific deck      | None                                  | 

### 3. Analytics & Progress (/api/analytics)
| Method | Endpoint                 | Description                              | Response Data |    
| :---: |  :---: |  :---: |  :---: | 
| GET    | /api/analytics/dashboard | Aggregated user stats across all quizzes | Total quizzes taken, average score, total time spent, mastery breakdown by category |

## Quick Start & Local Setup
### Prerequisites
- Node.js (v20+) & npm
- Python (v3.12+)
- MongoDB Atlas cluster or local instance

### 1. Automated Launch (Recommended)
In root directory, grant execution permissions and start backend & frontend:
```bash
chmod +x scripts/*.sh

# Terminal 1: Start FastAPI Backend (Port 8010)
./scripts/start-backend.sh

# Terminal 2: Start React Frontend (Port 5173)
./scripts/start-frontend.sh
```

### 2. Manual Step-by-Step Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8010
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Documentation & Standards

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Accessibility Statement](ACCESSIBILITY.md)
- [MIT License](LICENSE)
- [Project Wiki](https://github.com/A1exKH/ILQP/wiki/ILQP-manual)


## Maintainer & Contact
- Developer: Aliaksandr Kulinkovich (A1exKH)
- Email: alexander.kulinkovich@gmail.com
- GitHub: @A1exKH
