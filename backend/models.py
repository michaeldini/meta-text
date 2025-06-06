from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    summary: Optional[str] = None
    characters: Optional[str] = None
    locations: Optional[str] = None
    themes: Optional[str] = None
    symbols: Optional[str] = None

class SourceDocument(SourceDocumentBase, table=True):
    text: str
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")


class SourceDocumentRead(SourceDocumentBase):
    text: str

class SourceDocumentListRead(SourceDocumentBase):
    pass


# --- MetaText Schemas ---
class MetaTextBase(SQLModel):
    title: str
    source_document_id: int = Field(foreign_key="sourcedocument.id")

class MetaText(MetaTextBase, table=True):
    id: int = Field(default=None, primary_key=True)
    text: str
    chunks: List["Chunk"] = Relationship(back_populates="meta_text", cascade_delete=True)
    source_document: Optional[SourceDocument] = Relationship(back_populates="meta_texts")

class MetaTextRead(MetaTextBase):
    id: int

class CreateMetaTextRequest(BaseModel):
    sourceDocId: int
    title: str
    
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

class ChunkRead(ChunkBase):
    id: int


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

class WordDefinitionWithContextRequest(SQLModel):
    word: str
    context: str
class WordDefinitionResponse(SQLModel):
    definition: str
    definitionWithContext: str