# Migration Issues Faced

This document tracks issues encountered during database migrations and their solutions.

## Alembic Migration: `ValueError: no such column: updated_at`

### Problem

When running `alembic upgrade head`, the migration `added updated at in Chat model` failed with:
`ValueError: no such column: updated_at`
This happened despite `op.add_column` being called just before the `op.execute` update operation.

### Root Cause

1. **SQLite Visibility**: In SQLite, when a column is added using `ALTER TABLE ADD COLUMN`, it may not be immediately visible to subsequent SQL statements inside the same transaction if executed through a direct connection that hasn't refreshed its metadata state.
2. **Standard DML limitations**: SQLite's support for `ALTER TABLE` is limited. Alembic recommends using "batch mode" for SQLite to handle architectural changes correctly.

### Solution

1. **Enabled Batch Mode**: Updated `migrations/env.py` to include `render_as_batch=True`. This forces Alembic to use a "recreate-and-copy" strategy for SQLite, which is more robust.
2. **Disabled Foreign Keys during Migration**: Added `PRAGMA foreign_keys = OFF` to `migrations/env.py` only for SQLite connections. This prevents "FOREIGN KEY constraint failed" errors when Alembic recreates and renames tables during the batch process.
3. **Refined Migration Script**:
   - Wrapped `add_column` and `alter_column` in `op.batch_alter_table`.
   - Performed the `UPDATE` between the column addition and the constraint application.
4. **Cleanup**: Manually dropped the `_alembic_tmp_chat` table which was left orphaned by previous failed migration attempts.

### Key Learnings

- For SQLite + SQLAlchemy/Alembic, **always** enable `render_as_batch=True`.
- Use `PRAGMA foreign_keys = OFF` when performing structural changes in SQLite to avoid integrity errors during table transitions.
