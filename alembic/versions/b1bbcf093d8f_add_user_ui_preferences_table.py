"""add user_ui_preferences table

Revision ID: b1bbcf093d8f
Revises: 5785a84ef2d6
Create Date: 2025-07-16 12:22:18.058759

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1bbcf093d8f'
down_revision: Union[str, None] = '5785a84ef2d6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('useruipreferences',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('text_size_px', sa.Integer(), nullable=False),
    sa.Column('font_family', sa.String(), nullable=False),
    sa.Column('line_height', sa.Float(), nullable=False),
    sa.Column('padding_x', sa.Float(), nullable=False),
    sa.Column('show_chunk_positions', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id')
    )
    


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('useruipreferences')
    # ### end Alembic commands ###
