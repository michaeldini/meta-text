# """
# BookmarkService: Service class for managing persistent chunk bookmarks per user/metatext.
# """
# from sqlmodel import Session, select
# from ..models import Bookmark, Chunk

# class BookmarkService:
#     def get_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int):
#         # Returns the chunk_id bookmarked by the user for the given metatext, or None
#         bookmark = session.exec(
#             select(Bookmark)
#             .join(Chunk)
#             .where(
#                 Bookmark.user_id == user_id,
#                 Bookmark.chunk_id == Chunk.id,
#                 Chunk.metatext_id == metatext_id
#             )
#         ).first()
#         return bookmark.chunk_id if bookmark else None

#     def set_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int, chunk_id: int):
#         # Remove any existing bookmark for this user/metatext
#         old = session.exec(
#             select(Bookmark)
#             .join(Chunk)
#             .where(
#                 Bookmark.user_id == user_id,
#                 Bookmark.chunk_id == Chunk.id,
#                 Chunk.metatext_id == metatext_id
#             )
#         ).first()
#         if old:
#             session.delete(old)
#             session.commit()
#         # Add new bookmark
#         bookmark = Bookmark(user_id=user_id, chunk_id=chunk_id)
#         session.add(bookmark)
#         session.commit()
#         session.refresh(bookmark)
#         return bookmark.chunk_id

#     def clear_user_bookmark_for_metatext(self, session: Session, user_id: int, metatext_id: int):
#         # Remove the user's bookmark for the given metatext
#         bookmark = session.exec(
#             select(Bookmark)
#             .join(Chunk)
#             .where(
#                 Bookmark.user_id == user_id,
#                 Bookmark.chunk_id == Chunk.id,
#                 Chunk.metatext_id == metatext_id
#             )
#         ).first()
#         if bookmark:
#             session.delete(bookmark)
#             session.commit()
#         else:
#             raise ValueError("No bookmark found for the specified user and metatext.")
#         return True