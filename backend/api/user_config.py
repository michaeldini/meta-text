"""
FastAPI endpoint for serving user UI preferences config
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlmodel import Session, select
from ..models import User, UserUIPreferences
from ..db import get_session
from backend.dependencies import get_current_user

router = APIRouter()


class UIPreferencesConfig(BaseModel):
    textSizePx: Optional[int] = None
    fontFamily: Optional[str] = None
    lineHeight: Optional[float] = None
    paddingX: Optional[float] = None
    showChunkPositions: Optional[bool] = None


class UserConfigResponse(BaseModel):
    uiPreferences: Optional[UIPreferencesConfig] = None


def _to_ui_preferences_config(model: UserUIPreferences) -> UIPreferencesConfig:
    return UIPreferencesConfig(
        textSizePx=model.text_size_px,
        fontFamily=model.font_family,
        lineHeight=model.line_height,
        paddingX=model.padding_x,
        showChunkPositions=model.show_chunk_positions,
    )

@router.get("/user/config", response_model=UserConfigResponse)
def get_user_config(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Returns the user's UI preferences config for hydration in the frontend.
    """
    prefs = session.exec(select(UserUIPreferences).where(UserUIPreferences.user_id == current_user.id)).first()
    if not prefs:
        # Return defaults if not set
        prefs = UserUIPreferences(user_id=current_user.id)
        session.add(prefs)
        session.commit()
        session.refresh(prefs)
    return UserConfigResponse(uiPreferences=_to_ui_preferences_config(prefs))


class SetUIPreferencesRequest(BaseModel):
    textSizePx: Optional[int] = None
    fontFamily: Optional[str] = None
    lineHeight: Optional[float] = None
    paddingX: Optional[float] = None
    showChunkPositions: Optional[bool] = None

@router.post("/user/config", response_model=UserConfigResponse)
def set_user_config(
    req: SetUIPreferencesRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Set or update the user's UI preferences config.
    """
    prefs = session.exec(select(UserUIPreferences).where(UserUIPreferences.user_id == current_user.id)).first()
    if not prefs:
        prefs = UserUIPreferences(user_id=current_user.id)
        session.add(prefs)
    # Only update provided fields
    if req.textSizePx is not None:
        prefs.text_size_px = req.textSizePx
    if req.fontFamily is not None:
        prefs.font_family = req.fontFamily
    if req.lineHeight is not None:
        prefs.line_height = req.lineHeight
    if req.paddingX is not None:
        prefs.padding_x = req.paddingX
    if req.showChunkPositions is not None:
        prefs.show_chunk_positions = req.showChunkPositions
    session.commit()
    session.refresh(prefs)
    return UserConfigResponse(uiPreferences=_to_ui_preferences_config(prefs))
