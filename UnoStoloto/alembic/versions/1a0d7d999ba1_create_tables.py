"""Create tables

Revision ID: 1a0d7d999ba1
Revises: 53a06a9bde0f
Create Date: 2025-05-20 01:54:05.117774

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1a0d7d999ba1'
down_revision: Union[str, None] = '53a06a9bde0f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
