from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# --- Base Schemas ---
class SourceDocumentBase(SQLModel):
    title: str
    text: str
    summary: Optional[str] = None
    characters: Optional[str] = None
    locations: Optional[str] = None
    themes: Optional[str] = None
    symbols: Optional[str] = None

# --- Table Model ---
class SourceDocument(SourceDocumentBase, table=True):
    id: int = Field(default=None, primary_key=True)
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")


# --- Create Schema ---
class SourceDocumentCreateForm(SQLModel):
    title: str
    text: str
    summary: str | None = None
    characters: str | None = None
    locations: str | None = None
    themes: str | None = None
    symbols: str | None = None

    @classmethod
    def as_form(cls):
        from fastapi import Form
        return cls(
            title=Form(...),
            text=Form(...),
            summary=Form(None),
            characters=Form(None),
            locations=Form(None),
            themes=Form(None),
            symbols=Form(None),
        )

# --- Read Schema ---
class SourceDocumentRead(SourceDocumentBase):
    id: int

# --- Update Schema ---
class SourceDocumentUpdate(SQLModel):
    title: Optional[str] = None
    text: Optional[str] = None
    summary: Optional[str] = None
    characters: Optional[str] = None
    locations: Optional[str] = None
    themes: Optional[str] = None
    symbols: Optional[str] = None

    @classmethod
    def as_form(cls):
        from fastapi import Form
        return cls(
            title=Form(None),
            text=Form(None),
            summary=Form(None),
            characters=Form(None),
            locations=Form(None),
            themes=Form(None),
            symbols=Form(None),
        )

class SourceDocumentDeleteResponse(SQLModel):
    success: bool

# --- MetaText Schemas ---
class MetaTextBase(SQLModel):
    title: str
    text: str
    source_document_id: int = Field(foreign_key="sourcedocument.id")

class MetaText(MetaTextBase, table=True):
    id: int = Field(default=None, primary_key=True)
    chunks: List["Chunk"] = Relationship(back_populates="meta_text")
    source_document: Optional[SourceDocument] = Relationship(back_populates="meta_texts")

class MetaTextCreate(MetaTextBase):
    pass

class MetaTextRead(MetaTextBase):
    id: int

# --- Chunk Schemas ---
class ChunkBase(SQLModel):
    text: str
    position: float = 0.0
    notes: str = ""
    summary: str = ""
    aiSummary: str = ""
    aiImageUrl: str = ""
    meta_text_id: int = Field(foreign_key="metatext.id")

class Chunk(ChunkBase, table=True):
    id: int = Field(default=None, primary_key=True)
    meta_text: Optional[MetaText] = Relationship(back_populates="chunks")

class ChunkCreate(ChunkBase):
    pass

class ChunkRead(ChunkBase):
    id: int

class WordLookup(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    word: str = Field(index=True, unique=True)
    definition: str
