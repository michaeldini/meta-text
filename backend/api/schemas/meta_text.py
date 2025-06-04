from pydantic import BaseModel, Field
from typing import List

class SectionSchema(BaseModel):
    content: str
    notes: str = ""
    summary: str = ""
    aiSummary: str = ""
    aiImageUrl: str = ""

# generic response for creation success
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
    
class CreateMetaTextRequest(BaseModel):
    sourceDocId: int
    title: str

class UpdateMetaTextRequest(BaseModel):
    sections: List[SectionSchema]

class MetaTextResponse(BaseModel):
    id: int
    title: str
    text: str
    chunks: List[str] = Field(default_factory=list)
    source_document_id: int

class MetaTextListItem(BaseModel):
    id: int
    title: str

class MetaTextListResponse(BaseModel):
    meta_texts: List[MetaTextListItem]
