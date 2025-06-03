
from pydantic import BaseModel


class WordLookupResponse(BaseModel):
    id: int | None = None
    word: str
    definition: str