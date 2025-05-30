from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# NEW
class SourceDocument(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    text: str
    details: Optional["SourceDocumentDetails"] = Relationship(back_populates="source_document")
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")

# NEW
class MetaText(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    source_document_id: int = Field(foreign_key="sourcedocument.id")
    content: str  # JSON string of sections
    source_document: Optional[SourceDocument] = Relationship(back_populates="meta_texts")

# NEW
class SourceDocumentDetails(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    source_document_id: int = Field(foreign_key="sourcedocument.id")
    summary: str
    characters: str  # store as JSON string
    locations: str   # store as JSON string
    themes: str      # store as JSON string
    symbols: str     # store as JSON string
    source_document: Optional[SourceDocument] = Relationship(back_populates="details")
