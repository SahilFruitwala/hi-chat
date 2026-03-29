"""added model column in Message

Revision ID: 57dd2a457937
Revises: 10fd31fb3198
Create Date: 2026-03-28 20:31:11.096414

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '57dd2a457937'
down_revision: Union[str, Sequence[str], None] = '10fd31fb3198'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("message", sa.Column("model", sa.String(100), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("message", "model")
