"""add user_id to metatext

Revision ID: 5785a84ef2d6
Revises: ab623b7111c1
Create Date: 2025-07-15 19:12:17.836673

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5785a84ef2d6'
down_revision: Union[str, None] = 'ab623b7111c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add user_id column and foreign key using batch_alter_table for SQLite compatibility
    with op.batch_alter_table('metatext') as batch_op:
        # batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_metatext_user_id_user',
            'user',
            ['user_id'], ['id'],
            ondelete='CASCADE'
        )
    # Assign all existing MetaText rows to user with id=1 (change as needed)
    op.execute('UPDATE metatext SET user_id = 1')
    # Set NOT NULL constraint
    with op.batch_alter_table('metatext') as batch_op:
        batch_op.alter_column('user_id', nullable=False)


def downgrade():
    op.drop_constraint('fk_metatext_user_id_user', 'metatext', type_='foreignkey')
    op.drop_column('metatext', 'user_id')