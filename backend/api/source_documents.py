from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile, status
from sqlmodel import Session, select
from loguru import logger
from backend.models import (
    SourceDocument, MetaText, SourceDocumentRead, SourceDocumentWithText, 
)
from backend.db import get_session


router = APIRouter()

@router.post(
    "/source-documents",
    response_model=SourceDocumentWithText,
    name="create_source_document"
)
async def create_source_document(
    title: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
    session: Session =Depends(get_session),
):
    """
    Create a new source document from an uploaded file.
    """
    logger.info(f"Received request to create source document with title: {title}")
    text = (await file.read()).decode("utf-8")
    doc = SourceDocument(title=title, text=text)
    session.add(doc)
    try:
        session.commit()
        session.refresh(doc)
        logger.info(f"Source document created successfully: id={doc.id}, title={doc.title}")
        return doc
    except Exception as e:
        session.rollback()
        logger.error(f"Error creating source document: {e}")
        if 'UNIQUE constraint failed' in str(e):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Title already exists.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save to database.")


@router.get("/source-documents", response_model=list[SourceDocumentRead], name="list_source_documents")
def list_source_documents(session=Depends(get_session)):
    """
    List all source documents with all fields.
    """
    logger.info("Listing all source documents")
    docs = session.exec(select(SourceDocument)).all()
    logger.info(f"Found {len(docs)} source documents")
    return [doc for doc in docs]


@router.get("/source-documents/{doc_id}",response_model= SourceDocumentWithText, name="get_source_document")
def get_source_document(doc_id: int, session: Session =Depends(get_session)):
    """
    Retrieve a source document by ID.
    """
    logger.info(f"Retrieving source document with id: {doc_id}")
    doc = session.get(SourceDocument, doc_id)
    if doc:
        logger.info(f"Source document found: id={doc.id}, title={doc.title}")
        return doc
    else:
        logger.warning(f"Source document not found: id={doc_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source document not found.")


@router.delete("/source-documents/{doc_id}", name="delete_source_document")
def delete_source_document(doc_id: int, session=Depends(get_session)) -> dict:
    """
    Delete a source document if no related MetaText records exist.
    """
    logger.info(f"Attempting to delete source document with id: {doc_id}")
    doc = session.get(SourceDocument, doc_id)
    if not doc:
        logger.warning(f"Source document not found for deletion: id={doc_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Source document not found.")
    meta_texts = session.exec(select(MetaText).where(MetaText.source_document_id == doc_id)).all()
    if meta_texts:
        logger.warning(f"Cannot delete source document id={doc_id}: MetaText records exist")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete: MetaText records exist for this document.")
    session.delete(doc)
    session.commit()
    logger.info(f"Source document deleted successfully: id={doc_id}")
    return {"success": True}
