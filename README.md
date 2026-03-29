# hi-chat

A modern, AI-powered full-stack chat application.

## 🚀 Overview

`hi-chat` combines a high-performance **FastAPI** backend with a reactive **React** frontend to deliver a seamless AI-driven chat experience. It leverages **Pydantic AI** for agentic capabilities and **TanStack** for efficient state management and routing.

---

## 🛠 Project Structure

- **[backend/](file:///Users/sahil/Coding/hi-chat/backend)**: FastAPI application, SQL database models, Pydantic AI integration, and migrations.
- **[frontend/](file:///Users/sahil/Coding/hi-chat/frontend)**: React application built with Vite, TailwindCSS v4, and TanStack Router/Query.

---

## 🏗 Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **AI Integration**: [Pydantic AI](https://pydantic-ai.com/)
- **Database**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with [Alembic](https://alembic.sqlalchemy.org/) for migrations.
- **Runtime**: [uv](https://github.com/astral-sh/uv) (for lightning-fast Python package management).
- **Storage**: SQLite/LibSQL.

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **State Management & Routing**: [TanStack Query](https://tanstack.com/query) & [TanStack Router](https://tanstack.com/router)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚦 Getting Started

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- **[uv](https://github.com/astral-sh/uv)** installed globally.
- **[pnpm](https://pnpm.io/)** installed globally.

### Installation

Install both backend and frontend dependencies in one command:
```bash
make install
```

### Environment Setup

Create a `.env` file in the `backend/` directory and configure the following:
```env
OPENROUTER_API_KEY=your_key_here
DATABASE_URL=sqlite+libsql:///local.db
```

### Running the Application

Start both the backend and frontend in parallel:
```bash
make dev
```
- **Frontend**: `http://localhost:3000`
- **Backend Docs**: `http://localhost:8000/docs`

---

## 🧪 Development & Testing

### Backend Tests
Run the test suite with Coverage:
```bash
make test
```

### Database Migrations
To apply new migrations:
```bash
cd backend && uv run alembic upgrade head
```

---

## 📜 License
[MIT](LICENSE)
