from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class SourceDocument(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    text: str
    details: str | None = None  # JSON string of details
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")


class MetaText(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    source_document_id: int = Field(foreign_key="sourcedocument.id")
    content: str  # JSON string of sections
    text: str # Original text of the meta text
    source_document: Optional[SourceDocument] = Relationship(back_populates="meta_texts")
