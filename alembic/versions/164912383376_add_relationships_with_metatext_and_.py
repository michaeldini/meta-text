"""add relationships with metatext and words and phrases

Revision ID: 164912383376
Revises: 7fb44c5e6678
Create Date: 2025-07-18 15:58:51.937956

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '164912383376'
down_revision: Union[str, None] = '7fb44c5e6678'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    # SQLite does not support altering column nullability or adding foreign keys directly.
    # Instead, we need to use batch_alter_table for compatibility.
    constraint_name = "fk_phraseexplanation_meta_text_id_metatext"
    with op.batch_alter_table('phraseexplanation', schema=None) as batch_op:
        batch_op.alter_column('metatext_id', existing_type=sa.INTEGER(), nullable=False)
        batch_op.create_foreign_key(constraint_name, 'metatext', ['metatext_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    constraint_name = "fk_phraseexplanation_meta_text_id_metatext"
    with op.batch_alter_table('phraseexplanation', schema=None) as batch_op:
        batch_op.drop_constraint(constraint_name, type_='foreignkey')
        batch_op.alter_column('metatext_id', existing_type=sa.INTEGER(), nullable=True)
    # ### end Alembic commands ###
