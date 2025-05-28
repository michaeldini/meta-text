from sqlmodel import SQLModel, Field

class Documents(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    label: str = Field(index=True, unique=True)
    content: str

class SplitDocuments(SQLModel, table=True):
    name: str = Field(primary_key=True)
    content: str

class AiSummary(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    label: str = Field(index=True, unique=True)
    title: str
    summary: str
    characters: str  # store as JSON string
    locations: str   # store as JSON string
    themes: str      # store as JSON string
    symbols: str     # store as JSON string
