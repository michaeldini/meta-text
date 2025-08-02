from typing import Optional, List
from enum import Enum
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
    source_documents: List["SourceDocument"] = Relationship(back_populates="user")
    metatexts: List["Metatext"] = Relationship(back_populates="user")
    ui_preferences: Optional[UserUIPreferences] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    favorite_chunks: List["Chunk"] = Relationship(back_populates="favorited_by_user",sa_relationship_kwargs={"foreign_keys": "Chunk.favorited_by_user_id"})
    explanations: List["Explanation"] = Relationship(back_populates="user")
    

# --- SourceDocument Schemas ---
class SourceDocumentBase(SQLModel):
    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True, unique=True)
    author: str | None = None
    translated_by: str | None = None
    published_date: datetime | None = None
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    summary: str | None = None
    characters: str | None = None
    locations: str | None = None
    themes: str | None = None
    symbols: str | None = None
    user_id: int = Field(foreign_key="user.id")

class SourceDocument(SourceDocumentBase, table=True):
    text: str
    metatexts: List["Metatext"] = Relationship(back_populates="source_document")
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


# --- Metatext Schemas ---
class MetatextBase(SQLModel):
    title: str
    source_document_id: int = Field(foreign_key="sourcedocument.id")
    user_id: int = Field(foreign_key="user.id") 
    
class Metatext(MetatextBase, table=True):
    id: int = Field(default=None, primary_key=True)
    text: str
    chunks: List["Chunk"] = Relationship(back_populates="metatext", cascade_delete=True)
    source_document: Optional[SourceDocument] = Relationship(back_populates="metatexts")
    user: Optional["User"] = Relationship(back_populates="metatexts")
    explanations: List["Explanation"] = Relationship(back_populates="metatext", cascade_delete=True)

class MetatextSummary(MetatextBase):
    id: int

class MetatextDetail(MetatextSummary):
    text: str
    chunks: List["ChunkRead"]

class CreateMetatextRequest(BaseModel):
    sourceDocId: int
    title: str


# --- Chunk Schemas ---
class ChunkBase(SQLModel):
    text: str
    position: float = Field(default=0.0, index=True)  # Position in the text
    metatext_id: int = Field(foreign_key="metatext.id")
    note: str = ""
    summary: str = ""
    # evaluate the note and summary
    evaluation: str = ""
    # explanation of the chunk
    explanation: str = ""

class Chunk(ChunkBase, table=True):
    id: int = Field(default=None, primary_key=True)
    metatext: Optional[Metatext] = Relationship(back_populates="chunks")
    images: List["Image"] = Relationship(back_populates="chunk")
    # rewrite the chunk in different ways
    rewrites: List["Rewrite"] = Relationship(back_populates="chunk") 
    favorited_by_user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    favorited_by_user: Optional["User"] = Relationship(back_populates="favorite_chunks")
    # New: bookmark functionality
    bookmarked_by_user_id: Optional[int] = Field(default=None, foreign_key="user.id")  # User who bookmarked this chunk


class ChunkRead(ChunkBase):
    id: int
    images: list["ImageRead"] = []
    rewrites: list["RewriteRead"] = []
    favorited_by_user_id: Optional[int] = None
    

class ChunkUpdate(SQLModel):
    """Model for updating chunks - all fields are optional."""
    text: str | None = None
    position: float | None = None
    note: str | None = None
    summary: str | None = None
    evaluation: str | None = None
    explanation: str | None = None

# --- Chunk Compression Schemas ---
class RewriteBase(SQLModel):
    title: str  # e.g., "like im 5", "like a bro"
    rewrite_text: str
    chunk_id: int = Field(foreign_key="chunk.id")

class Rewrite(RewriteBase, table=True):
    id: int = Field(default=None, primary_key=True)
    chunk: Optional["Chunk"] = Relationship(back_populates="rewrites")

class RewriteRead(RewriteBase):
    id: int


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


# --- Explanation Schemas ---
class ExplanationType(str, Enum):
    word = "word"
    phrase = "phrase"
    
class Explanation(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    words: str  # word or phrase
    context: str
    explanation: str
    explanation_in_context: str
    type: ExplanationType = Field(default=ExplanationType.word, nullable=False)
    created_at: datetime = Field(default_factory=datetime.now, nullable=False)
    user_id: int = Field(foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="explanations")
    metatext_id: int = Field(foreign_key="metatext.id")
    metatext: Optional["Metatext"] = Relationship(back_populates="explanations")
    
    @classmethod
    def create_with_type(cls, **kwargs):
        words = kwargs.get("words", "")
        kwargs["type"] = ExplanationType.word if len(words.split()) == 1 else ExplanationType.phrase
        return cls(**kwargs)


class ExplanationsResponse(BaseModel):
    """
    Response model for review endpoints.
    Contains wordlist and phrase explanations.
    """
    word_list: List[Explanation]
    phrase_list: List[Explanation]

class ExplanationResponse(BaseModel):
    explanation: str
    explanation_in_context: str

class ExplanationRequest(BaseModel):
    words: str = Field(..., description="Word(s) to explain")
    context: str = Field(..., description="Context for the explanation")
    chunk_id: Optional[int] = Field(None, description="Chunk ID for chunk explanation")
    metatext_id: Optional[int] = Field(None, description="Metatext ID for explanation")


# --- AI Image Schemas ---
class Image(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    prompt: str
    path: str  # relative path to the saved image file
    chunk_id: Optional[int] = Field(default=None, foreign_key="chunk.id")  # Many-to-one FK to Chunk
    chunk: Optional["Chunk"] = Relationship(back_populates="images")  # Many-to-one relationship

class ImageCreate(SQLModel):
    prompt: str
    path: str
    chunk_id: Optional[int] = None

class ImageRead(SQLModel):
    id: int
    prompt: str
    path: str
    chunk_id: Optional[int] = None

# # --- Bookmark Schemas ---    
# class Bookmark(SQLModel, table=True):
#     id: int = Field(default=None, primary_key=True)
#     user_id: int = Field(foreign_key="user.id")
#     user: Optional["User"] = Relationship(back_populates="bookmarks")
#     chunk_id: int = Field(foreign_key="chunk.id")


# # Pydantic model for setting a bookmark
# class SetBookmarkRequest(BaseModel):
#     metatext_id: int
#     chunk_id: int


    
# Generic error response model
class DeleteResponse(BaseModel):
    message: str
    deleted_id: int



class CreateChunk(BaseModel):
    text: str
    position: float
    metatextId: int