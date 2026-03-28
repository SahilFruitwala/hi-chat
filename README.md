# hi-chat

A simple chat application backend built with FastAPI, SQLAlchemy, and Pydantic AI.

## Features

- **FastAPI**: Modern, fast (high-performance) web framework for building APIs.
- **SQLAlchemy 2.0**: The Python SQL Toolkit and Object Relational Mapper.
- **Alembic**: Lightweight database migration tool.
- **Pydantic AI**: Agentic AI framework with support for various LLM providers (via OpenRouter).
- **LibSQL/SQLite**: Local database support with LibSQL extensions.

## Prerequisites

- Python 3.11 or higher
- [uv](https://github.com/astral-sh/uv) (recommended)

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd hi-chat
```

### 2. Install dependencies
Using `uv`:
```bash
uv sync
```

### 3. Run Database Migrations
```bash
uv run alembic upgrade head
```

### 4. Start the Development Server
```bash
uv run fastapi dev app/main.py
```
The API will be available at `http://127.0.0.1:8000`. Documentation (Swagger UI) is at `http://127.0.0.1:8000/docs`.

## Testing

Run tests with coverage:
```bash
uv run pytest
```

## Project Structure

- `app/`: Source code for the FastAPI application.
    - `models.py`: SQLAlchemy database models.
    - `schemas.py`: Pydantic models for data validation and serialization.
    - `crud.py`: Create, Read, Update, and Delete logic.
    - `routes.py`: API endpoint definitions.
    - `database.py`: Database connection and session management.
- `migrations/`: Alembic migration scripts.
- `tests/`: Pytest test suite.

## Environment Variables

- `DATABASE_URL`: Database connection string (default: `sqlite+libsql:///local.db`).
- `OPENROUTER_API_KEY`: Required if using `pydantic-ai` features with OpenRouter.
