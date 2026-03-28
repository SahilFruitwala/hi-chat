.PHONY: dev backend frontend install help

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
	cd frontend && pnpm install

backend:
	@echo "Starting backend..."
	cd backend && uv run fastapi dev app/main.py

frontend:
	@echo "Starting frontend..."
	cd frontend && pnpm dev

dev:
	@echo "Starting both services in parallel..."
	@$(MAKE) -j 2 backend frontend
