# Contributing to Interactive Learning & Quiz Platform (ILQP)

First off, thank you for considering contributing to the Interactive Learning & Quiz Platform!

Whether you are fixing a bug, improving test coverage, optimizing a MongoDB aggregation pipeline, or polishing the Tailwind UI, your contributions are greatly appreciated.

Please take a moment to review this document to ensure a smooth contribution process.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to [alexander.kulinkovich@gmail.com](mailto:alexander.kulinkovich@gmail.com).

---

## Local Environment Setup

To run and contribute to ILQP locally, ensure you have the following installed:
* **Node.js** (v20+) & **npm**
* **Python** (v3.12+)
* **MongoDB** (Local instance or MongoDB Atlas account)
* **Git**

### 1. Clone the Repository
```bash
git clone [https://github.com/A1exKH/ILQP.git](https://github.com/A1exKH/ILQP.git)
cd ILQP
```

### 2. Backend Setup (FastAPI & Python)
Navigate to the backend directory, set up a virtual environment, and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the backend/ directory with your MongoDB credentials and configuration:
```bash
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DATABASE_NAME=ilqp_db
CORS_ORIGINS=http://localhost:5173
```

Run the backend development server:

```bash
python uvicorn app.main:app --reload --port 8000
```

The FastAPI interactive Swagger documentation will be available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup (React, TypeScript & Tailwind CSS)

In a new terminal window, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

The React app will launch at `http://localhost:5173`.

## Git Branching Strategy & Workflow

We follow a clean, structured Feature Branch Workflow:
1. `main`: Production-ready, stable code.
2. `development`: Active integration branch for upcoming releases.

### Step-by-Step Workflow

1. Fork or Clone the repository and ensure your local `development` branch is up to date:
```bash
git checkout development
git pull origin development
```

2. Create a Feature Branch off `development` with a descriptive name:
```bash
# Syntax: feature/short-description or fix/short-description
git checkout -b feature/add-quiz-timer
```

3. Make Your Changes adhering to our coding standards.

4. Commit Your Changes using clear, structured commit messages:
```bash
# Examples:
git commit -m "Feat: Add countdown timer component to QuizTaker"
git commit -m "Fix: Resolve CORS header discrepancy in FastAPI middleware"
git commit -m "Docs: Update API endpoint parameters in README"
```

5. Push to GitHub & Open a Pull Request:
```bash
git push origin feature/add-quiz-timer
```

Open a Pull Request against the `development` branch on GitHub.

## Coding & Style Guidelines

### Frontend (React + TypeScript + Tailwind)
- Use functional components with explicit TypeScript interfaces/types (e.g., `DashboardResponse`, `QuizDeck`).

- Follow strict type safety—avoid using `any`.

- Use Tailwind CSS utility classes for styling; keep custom CSS minimal.

- Ensure all UI components are mobile-responsive and accessible.

### Backend (Python + FastAPI + Pydantic)
- Define request/response validation schemas using Pydantic.

- Keep business logic separated from route handlers where applicable.

- Ensure asynchronous database operations using `Motor` for MongoDB.

- Use typing annotations (`List[Deck]`, `Optional[str]`) for all API handlers.

## Testing & Verification

Before submitting a Pull Request, please verify your changes:

1. Frontend Build Check: 

Ensure TypeScript compiles without errors:
```bash
cd frontend
npm run build
```

2. API Endpoints Check:

Test new or modified REST routes via `http://127.0.0.1:8000/docs`.

## Questions or Support?

If you have questions or encounter bugs, feel free to open an issue in the GitHub Issue Tracker or reach out to the project maintainer:

- Maintainer: Aliaksandr Kulinkovich (A1exKH)

- Email: alexander.kulinkovich@gmail.com

Thank you for helping make ILQP better!