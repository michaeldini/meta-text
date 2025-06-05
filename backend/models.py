from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    title: str = Field(index=True, unique=True)
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
        def _as_form(
            title: str = Form(None),
            text: str = Form(None),
            summary: str = Form(None),
            characters: str = Form(None),
            locations: str = Form(None),
            themes: str = Form(None),
            symbols: str = Form(None),
        ):
            return cls(
                title=title,
                text=text,
                summary=summary,
                characters=characters,
                locations=locations,
                themes=themes,
                symbols=symbols,
            )
        return _as_form

class SourceDocumentDeleteResponse(SQLModel):
    success: bool

# --- MetaText Schemas ---
class MetaTextBase(SQLModel):
    title: str
    text: str
    source_document_id: int = Field(foreign_key="sourcedocument.id")

class MetaText(MetaTextBase, table=True):
    id: int = Field(default=None, primary_key=True)
    chunks: List["Chunk"] = Relationship(back_populates="meta_text", cascade_delete=True)
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
class CreateSuccessResponse(SQLModel):
    success: bool
    id: int
    title: str

# generic response for listing items (GET requests) (inner) 
class GetResponse(SQLModel):
    id: int
    title: str

# generic response for listing items (GET requests) (outer) 
class GetListResponse(SQLModel):
    data: List[GetResponse]

# AI Response Schemas
class SourceDocInfoAiResponse(SQLModel):
    summary: str
    characters: list[str]
    locations: list[str]
    themes: list[str]
    symbols: list[str]

class SourceDocInfoRequest(SQLModel):
    prompt: str
    id: int | None = None

class SourceDocInfoResponse(SQLModel):
    result: SourceDocInfoAiResponse

class ChunkAiSummaryRequest(SQLModel):
    prompt: str

class ChunkAiSummaryResponse(SQLModel):
    result: str

