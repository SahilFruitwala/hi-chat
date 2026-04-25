.PHONY: dev backend frontend install help ruff ty

# Default target
.DEFAULT_GOAL := help

help:
	@echo "Available targets:"
	@echo "  make install  - Install dependencies for both frontend and backend"
	@echo "  make dev      - Start both frontend and backend in parallel"
	@echo "  make backend  - Start the FastAPI backend only"
	@echo "  make frontend - Start the Vite frontend only"

install:
	@echo "Installing backend dependencies..."
	cd backend && uv sync
	@echo "Installing frontend dependencies..."
	cd frontend && bun install

backend:
	@echo "Starting backend..."
	cd backend && uv run fastapi dev app/main.py

frontend:
	@echo "Starting frontend..."
	cd frontend && bun dev

dev:
	@echo "Starting both services in parallel..."
	@$(MAKE) -j 2 backend frontend

test:
	@echo "Running backend tests..."
	cd backend && uv run pytest


ruff:
	@echo "Running ruff..."
	cd backend && uv run ruff check --fix && uv run ruff format

ty:
	@echo "Running ty..."
	cd backend && uv run ty check