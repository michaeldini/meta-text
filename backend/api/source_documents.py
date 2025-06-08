from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlmodel import select
from backend.models import (
    SourceDocument, MetaText, SourceDocumentBase, SourceDocumentListRead, SourceDocumentRead, 
)
from backend.db import get_session


router = APIRouter()

@router.post(
    "/source-documents",
    response_model=SourceDocumentRead,
    name="create_source_document"
)
async def create_source_document(
    title: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    session=Depends(get_session),
):
    """
    Create a new source document from an uploaded file.
    """
    text = (await file.read()).decode("utf-8")
    doc = SourceDocument(title=title, text=text)
    session.add(doc)
    try:
        session.commit()
        session.refresh(doc)
        return doc.model_dump()
    except Exception as e:
        session.rollback()
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=409, detail="Title already exists.")
        raise HTTPException(status_code=500, detail="Failed to save to database.")


@router.get("/source-documents", name="list_source_documents")
def list_source_documents(session=Depends(get_session)) -> list[SourceDocumentListRead]:
    """
    List all source documents with all fields.
    """
    docs = session.exec(select(SourceDocument)).all()
    return [SourceDocumentListRead(**doc.model_dump()) for doc in docs]


@router.get("/source-documents/{doc_id}", name="get_source_document")
def get_source_document(doc_id: int, session=Depends(get_session)) -> SourceDocumentRead:
    """
    Retrieve a source document by ID.
    """
    doc = session.get(SourceDocument, doc_id)
    if doc:
        return doc
    else:
        raise HTTPException(status_code=404, detail="Source document not found.")


@router.delete("/source-documents/{doc_id}", name="delete_source_document")
def delete_source_document(doc_id: int, session=Depends(get_session)) -> dict:
    """
    Delete a source document if no related MetaText records exist.
    """
    doc = session.get(SourceDocument, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Source document not found.")
    meta_texts = session.exec(select(MetaText).where(MetaText.source_document_id == doc_id)).all()
    if meta_texts:
        raise HTTPException(status_code=400, detail="Cannot delete: MetaText records exist for this document.")
    session.delete(doc)
    session.commit()
    return {"success": True}
