from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timezone
# --- Password Hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# --- User Schemas ---
class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
 

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    summary: str | None = None
    characters: str | None = None
    locations: str | None = None
    themes: str | None = None
    symbols: str | None = None

class SourceDocument(SourceDocumentBase, table=True):
    text: str
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")


class SourceDocumentWithText(SourceDocumentBase):
    text: str

class SourceDocumentRead(SourceDocumentBase):
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
    comparison: str = ""
    meta_text_id: int = Field(foreign_key="metatext.id")

class Chunk(ChunkBase, table=True):
    id: int = Field(default=None, primary_key=True)
    meta_text: Optional[MetaText] = Relationship(back_populates="chunks")
    ai_images: List["AiImage"] = Relationship(back_populates="chunk")  # One-to-many relationship

class ChunkRead(ChunkBase):
    id: int

class ChunkWithImageRead(ChunkRead):
    ai_image: Optional["AiImageRead"] = None



# --- AI Response Schemas ---
# --- SourceDocInfo Schemas ---
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

# --- Word Definition Schemas ---
class WordDefinitionWithContextRequest(SQLModel):
    word: str
    context: str
    meta_text_id: int

class WordDefinitionResponse(SQLModel):
    definition: str
    definitionWithContext: str

class WordDefinition(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    word: str
    context: str
    definition: str
    definition_with_context: str
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    meta_text_id: int = Field(foreign_key="metatext.id")
    
# --- AI Image Schemas ---
class AiImage(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    prompt: str
    path: str  # relative path to the saved image file
    chunk_id: Optional[int] = Field(default=None, foreign_key="chunk.id")  # Many-to-one FK to Chunk
    chunk: Optional["Chunk"] = Relationship(back_populates="ai_images")  # Many-to-one relationship

class AiImageCreate(SQLModel):
    prompt: str
    path: str
    chunk_id: Optional[int] = None

class AiImageRead(SQLModel):
    id: int
    prompt: str
    path: str
    chunk_id: Optional[int] = None
