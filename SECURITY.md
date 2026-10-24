# Security Policy

## Supported Versions

We take the security of the **Interactive Learning & Quiz Platform (ILQP)** seriously. The following table outlines the project versions currently supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

If you discover a potential security vulnerability within ILQP (such as authentication bypasses, CORS misconfigurations, unsafe API endpoints, or database injection vectors), please report it responsibly.

**Please do NOT open a public GitHub issue for security vulnerabilities.**

### Reporting Process

1. **Email the Maintainer:** Send a private email detailing the issue to **Aliaksandr Kulinkovich** at [alexander.kulinkovich@gmail.com](mailto:alexander.kulinkovich@gmail.com).
2. **Include Relevant Details:** To help us evaluate and patch the issue quickly, please include:
   * A brief description of the vulnerability and its potential impact.
   * Step-by-step instructions or proof-of-concept (PoC) code to reproduce the issue.
   * Affected component(s) (e.g., FastAPI backend routes, React state management, or MongoDB queries).
3. **Acknowledgment:** You will receive an initial acknowledgment within **48 hours** of submitting the report.
4. **Resolution Timeline:** We will investigate and provide regular updates on the status of a fix. Once resolved, a patch will be committed to the `main` branch.

---

## Security Best Practices in ILQP

The ILQP codebase incorporates the following security controls:

* **Backend Validation:** Strict payload and query validation powered by **Pydantic** schemas.
* **Database Isolation:** Parameterized queries and Motor driver sanitization to prevent MongoDB injection attacks.
* **CORS Restrictions:** Explicitly configured CORS middleware in FastAPI targeting approved origins only.
* **Environment Configuration:** Sensitive secrets and database credentials managed strictly through environment variables (`.env`), excluding them from version control.

---

## Contact

* **Maintainer:** Aliaksandr Kulinkovich (**A1exKH**)
* **Email:** [alexander.kulinkovich@gmail.com](mailto:alexander.kulinkovich@gmail.com)
* **GitHub Profile:** [https://github.com/A1exKH](https://github.com/A1exKH)