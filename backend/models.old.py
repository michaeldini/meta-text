from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel
from datetime import datetime  # removed unused timezone import

# --- User UI Preferences Model ---
class UserUIPreferences(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    text_size_px: int = 24
    font_family: str = "Inter, sans-serif"
    line_height: float = 1.5
    padding_x: float = 0.3
    show_chunk_positions: bool = False
    user: Optional["User"] = Relationship(back_populates="ui_preferences")

# --- User Schemas ---
class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str
    meta_texts: List["MetaText"] = Relationship(back_populates="user")
    source_documents: List["SourceDocument"] = Relationship(back_populates="user")
    ui_preferences: Optional[UserUIPreferences] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    author: str | None = None
    summary: str | None = None
    characters: str | None = None
    locations: str | None = None
    themes: str | None = None
    symbols: str | None = None
    user_id: int = Field(foreign_key="user.id")

class SourceDocument(SourceDocumentBase, table=True):
    text: str
    meta_texts: List["MetaText"] = Relationship(back_populates="source_document")
    user: Optional["User"] = Relationship(back_populates="source_documents")


class SourceDocumentDetail(SourceDocumentBase):
    text: str

class SourceDocumentSummary(SourceDocumentBase):
    pass


class SourceDocumentUpdate(SQLModel):
    """Model for updating source documents - all fields are optional."""
    title: str | None = None
    author: str | None = None
    summary: str | None = None
    characters: str | None = None
    locations: str | None = None
    themes: str | None = None
    symbols: str | None = None
    text: str | None = None


# --- MetaText Schemas ---
class MetaTextBase(SQLModel):
    title: str
    source_document_id: int = Field(foreign_key="sourcedocument.id")
    user_id: int = Field(foreign_key="user.id") 
class MetaText(MetaTextBase, table=True):
    id: int = Field(default=None, primary_key=True)
    text: str
    chunks: List["Chunk"] = Relationship(back_populates="meta_text", cascade_delete=True)
    source_document: Optional[SourceDocument] = Relationship(back_populates="meta_texts")
    user: Optional["User"] = Relationship(back_populates="meta_texts")
    phrase_explanations: List["PhraseExplanation"] = Relationship(back_populates="meta_text", cascade_delete=True)
    word_definitions: List["WordDefinition"] = Relationship(back_populates="meta_text", cascade_delete=True)

class MetaTextSummary(MetaTextBase):
    id: int

class MetaTextDetail(MetaTextSummary):
    text: str
    chunks: List["ChunkRead"]

class CreateMetaTextRequest(BaseModel):
    sourceDocId: int
    title: str
    # user_id: Optional[int] = None  # Optional for backward compatibility; set in backend
    
# --- Chunk Compression Schemas ---
class ChunkCompressionBase(SQLModel):
    title: str  # e.g., "like im 5", "like a bro"
    compressed_text: str
    chunk_id: int = Field(foreign_key="chunk.id")

class ChunkCompression(ChunkCompressionBase, table=True):
    id: int = Field(default=None, primary_key=True)
    chunk: Optional["Chunk"] = Relationship(back_populates="compressions")

class ChunkCompressionRead(ChunkCompressionBase):
    id: int

# --- Chunk Schemas ---
class ChunkBase(SQLModel):
    text: str
    position: float = Field(default=0.0, index=True)  # Position in the text
    notes: str = ""
    summary: str = ""
    comparison: str = ""
    explanation: str = ""
    meta_text_id: int = Field(foreign_key="metatext.id")

class Chunk(ChunkBase, table=True):
    id: int = Field(default=None, primary_key=True)
    meta_text: Optional[MetaText] = Relationship(back_populates="chunks")
    ai_images: List["AiImage"] = Relationship(back_populates="chunk")  # One-to-many relationship
    compressions: List["ChunkCompression"] = Relationship(back_populates="chunk")  # One-to-many relationship for compressions

class ChunkRead(ChunkBase):
    id: int
    ai_images: list["AiImageRead"] = []
    compressions: list["ChunkCompressionRead"] = []
    

class ChunkUpdate(SQLModel):
    """Model for updating chunks - all fields are optional."""
    text: str | None = None
    position: float | None = None
    notes: str | None = None
    summary: str | None = None
    comparison: str | None = None
    explanation: str | None = None

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
    meta_text_id: int | None = None

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
    meta_text: Optional[MetaText] = Relationship(back_populates="word_definitions")
    
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

# --- Phrase Explanation Schemas ---
class ExplainPhraseWithContextRequest(SQLModel):
    phrase: str
    context: str
    meta_text_id: int | None = None

class ExplainPhraseResponse(SQLModel):
    explanation: str
    explanationWithContext: str

class PhraseExplanation(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    phrase: str
    context: str
    explanation: str
    explanation_with_context: str
    meta_text_id: int = Field(foreign_key="metatext.id")
    meta_text: Optional["MetaText"] = Relationship(back_populates="phrase_explanations")

# New consolidated response model for explanations
class ExplanationResponse(BaseModel):
    explanation: str
    explanationWithContext: str


class ExplainRequest(BaseModel):
    words: str = Field(..., description="Word(s) to explain")
    context: str = Field(..., description="Context for the explanation")
    chunkId: Optional[int] = Field(None, description="Chunk ID for chunk explanation")
    metaTextId: Optional[int] = Field(None, description="MetaText ID for explanation")

# Generic error response model
class DeleteResponse(BaseModel):
    message: str
    deleted_id: int
    
    
class Bookmark(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    chunk_id: int = Field(foreign_key="chunk.id")


# Pydantic model for setting a bookmark
class SetBookmarkRequest(BaseModel):
    meta_text_id: int
    chunk_id: int