# Contributing to Hospital Operations Intelligence Dashboard

Thank you for your interest in contributing to this project. This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Conventions](#project-conventions)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

---

## Code of Conduct

This project adheres to a standard code of conduct. By participating, you are expected to:

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the project

---

## Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Local Environment

```bash
# Clone the repository
git clone <repository-url>
cd vit2

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py                    # Starts API on :8000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev                       # Starts UI on :3000
```

Verify both services are running:

```bash
curl http://localhost:8000/api/health
# {"status":"healthy","service":"Hospital Ops Dashboard"}
```

---

## Project Conventions

### Backend (Python)

| Convention          | Standard                                              |
| ------------------- | ----------------------------------------------------- |
| Code Style          | PEP 8                                                 |
| Type Hints          | Required for all function signatures                  |
| Models              | Pydantic V2 `BaseModel` subclasses                    |
| Docstrings          | Required for all classes and public methods            |
| Naming              | `snake_case` for functions/variables, `PascalCase` for classes |
| Import Order        | stdlib → third-party → local (separated by blank lines)|

### Frontend (TypeScript/React)

| Convention          | Standard                                              |
| ------------------- | ----------------------------------------------------- |
| Code Style          | ESLint (Next.js config)                                |
| Components          | Functional components with TypeScript props interfaces |
| Styling             | Tailwind CSS utility classes; no inline styles         |
| State Management    | React Context for shared state; `useState` for local   |
| Naming              | `PascalCase` for components, `camelCase` for variables |
| File Organization   | Feature-based: `components/dashboard/`, `app/dashboard/` |

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type       | Description                                   |
| ---------- | --------------------------------------------- |
| `feat`     | New feature                                   |
| `fix`      | Bug fix                                       |
| `docs`     | Documentation changes                         |
| `style`    | Code formatting (no logic change)             |
| `refactor` | Code restructuring (no feature/fix)           |
| `test`     | Adding or updating tests                      |
| `chore`    | Build process, dependencies, tooling           |

**Examples:**

```
feat(analytics): add trend comparison to stress index
fix(auth): handle expired token redirect on dashboard pages
docs(readme): update API reference with new endpoints
```

---

## Making Changes

### Branch Strategy

```
main              ← Production-ready code
├── feat/...      ← New features
├── fix/...       ← Bug fixes
└── docs/...      ← Documentation updates
```

### Workflow

1. **Create a branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make changes** following the project conventions above.

3. **Test locally** — ensure both backend and frontend run without errors:

   ```bash
   # Backend
   cd backend && source venv/bin/activate && python main.py

   # Frontend
   cd frontend && npm run dev
   ```

4. **Verify the build** (frontend):

   ```bash
   cd frontend && npm run build
   ```

5. **Commit** with a conventional commit message.

6. **Push** your branch and open a pull request.

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project conventions (see above)
- [ ] Backend runs without errors (`python main.py`)
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No console errors in the browser
- [ ] New API endpoints are documented (if applicable)
- [ ] Commit messages follow Conventional Commits format

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Documentation
- [ ] Refactor

## Changes
- List of specific changes made

## Testing
- How the changes were tested

## Screenshots (if UI changes)
Before / After screenshots
```

### Review Process

1. At least one maintainer review is required
2. All CI checks must pass (if configured)
3. Merge conflicts must be resolved by the contributor
4. Squash merge is preferred for feature branches

---

## Issue Reporting

### Bug Reports

When reporting a bug, include:

1. **Environment** — OS, Python version, Node.js version, browser
2. **Steps to Reproduce** — numbered list of actions to trigger the issue
3. **Expected Behavior** — what you expected to happen
4. **Actual Behavior** — what actually happened
5. **Screenshots/Logs** — browser console output, terminal output

### Feature Requests

When requesting a feature, include:

1. **Problem Statement** — what problem does this solve?
2. **Proposed Solution** — how should it work?
3. **Alternatives Considered** — other approaches evaluated
4. **Additional Context** — mockups, references, constraints

---

## Architecture Notes for Contributors

### Adding a New Dashboard Module

To add a new analytics module (e.g., "Staff Schedule"):

1. **Backend:**
   - Add Pydantic model(s) in `models.py`
   - Add data generation in `mock_his.py`
   - Add aggregation method in `adapter.py`
   - Add computation method in `analytics.py`
   - Add API endpoint in `main.py`

2. **Frontend:**
   - Create widget component in `components/dashboard/`
   - Create detail page in `app/dashboard/<module-name>/page.tsx`
   - Add navigation entry in `Sidebar.tsx`
   - Add API call in `lib/api.ts`
   - Add data to `DashboardContext.tsx` (if needed on overview)

### Adding a New Alert Rule

1. Open `backend/analytics.py`
2. Add the rule in `generate_alerts()` method
3. Define threshold constants at the top of the method
4. Create an `Alert` model instance with appropriate severity
5. The frontend will automatically display it — no frontend changes needed

---

## Questions?

If you have questions about contributing, please open an issue with the `question` label.
