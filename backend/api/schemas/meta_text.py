from pydantic import BaseModel
from typing import List

class SectionSchema(BaseModel):
    content: str
    notes: str = ""
    summary: str = ""
    aiSummary: str = ""
    aiImageUrl: str = ""

class CreateMetaTextRequest(BaseModel):
    sourceTitle: str
    newTitle: str

class UpdateMetaTextRequest(BaseModel):
    sections: List[SectionSchema]

class MetaTextResponse(BaseModel):
    id: int
    title: str
    content: List[SectionSchema]

class MetaTextListItem(BaseModel):
    id: int
    title: str

class MetaTextListResponse(BaseModel):
    meta_texts: List[MetaTextListItem]
