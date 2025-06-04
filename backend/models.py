from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    title: str
    text: str
    summary: Optional[str] = None
    characters: Optional[str] = None
    locations: Optional[str] = None
    themes: Optional[str] = None
    symbols: Optional[str] = None

class SourceDocument(SourceDocumentBase, table=True):
    id: int = Field(default=None, primary_key=True)
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")


class SourceDocumentRead(SourceDocumentBase):
    id: int


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


class CreateMetaTextRequest(BaseModel):
    sourceDocId: int
    title: str
    
class MetaTextResponse(BaseModel):
    id: int
    title: str
    text: str
    chunks: list[dict] = Field(default_factory=list)
    source_document_id: int

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

# --- Word Lookup Schemas ---
class WordLookup(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    word: str = Field(index=True, unique=True)
    definition: str


class WordLookupResponse(SQLModel):
    id: int | None = None
    word: str
    definition: str
    
# --- Generic Response Schemas ---
class CreateSuccessResponse(BaseModel):
    success: bool
    id: int
    title: str

# generic response for listing items (GET requests) (inner) 
class GetResponse(BaseModel):
    id: int
    title: str

# generic response for listing items (GET requests) (outer) 
class GetListResponse(BaseModel):
    data: List[GetResponse]
    
