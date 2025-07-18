# Features in order of interest

- enhance bookmarks to persist
- add a "favorites" feature to allow users to mark chunks they like
• Document outline / table of contents  
  Auto-generate a sidebar index of chunk headings or key terms for quick jumping.

• In-line annotations & comments  
  Let users attach notes or comments to individual words or chunks, then view/export them.

• Export & sharing  
  Offer PDF/Markdown/JSON export of annotations or the entire Metatext, plus shareable links.

• Keyboard navigation & shortcuts  
  Arrow-key or keystroke support to move between chunks/words, trigger merge/split, open toolbars, etc.

• Version history & undo/redo  
  Keep a change timeline so users can revert edits or compare different drafts.

• Custom themes & dark mode  
  Respect system-level theme or let users pick high-contrast, low-light, large-text modes.

• Autosave & draft recovery  
  Persist in-progress work so nothing is lost if they navigate away or the browser crashes.

• Collaborative editing  
  Real-time cursors, comments, and presence indicators so multiple users can work together.

- ai generated background (or music) that enhances the reading experience. (i.e. greek harp and parthenon columns for ancient texts, or a subtle modern synth for tech docs)
- search filter by tag implementation. chunk tag implementation

## To implement admin privileges in a React + FastAPI app, you typically

1. **Backend (FastAPI):**
   - Add a `role` or `is_admin` field to your user model (e.g., in your SQLModel).
   - On login, issue a JWT token that includes the user's role.
   - Protect admin-only endpoints with a dependency that checks the user's role.

2. **Frontend (React):**
   - Store the user's role in global state (e.g., Zustand store) after login.
   - Use the role to conditionally render UI elements or enable/disable actions.
   - Optionally, hide or disable admin-only buttons/components for non-admins.

---

### Disabling the Delete Button Based on Privileges

Assume you have a `user` object in your Zustand store with an `isAdmin` boolean.

**Step 1:**  
Expose `isAdmin` from your store, e.g.:

```ts
// src/store/userStore.ts
// ...existing code...
isAdmin: false, // or true, based on login
// ...existing code...
```

**Step 2:**  
Import and use `isAdmin` in your component:

```tsx
import { useUserStore } from 'store'; // adjust import as needed
// ...existing code...

function SearchableList({ ... }: SearchableListProps) {
    // ...existing code...
    const isAdmin = useUserStore((state) => state.isAdmin);
    // ...existing code...
```

**Step 3:**  
Update the `DeleteButton` to be disabled for non-admins:

```tsx
// ...existing code...
<DeleteButton
    onClick={(e: React.MouseEvent) => handleDeleteClick(item.id)}
    disabled={!isAdmin}
    label={`Delete ${displayText}`}
/>
// ...existing code...
```

**Result:**  

- Only admins will have the delete button enabled.
- Regular users will see the button disabled (or you can hide it entirely if preferred).

---

**Tip:**  
Always enforce permissions on the backend as well, not just in the UI.

### You can implement **MetaText download and upload** using FastAPI endpoints and your React frontend. Here’s a high-level approach

1. **Backend: FastAPI Endpoints**

#### **a. Download MetaText as JSON**

Create an endpoint that returns a MetaText (and its related data, e.g., chunks) as a JSON file:

````python
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from .models import MetaText, Chunk, MetaTextDetail

router = APIRouter()

@router.get("/metatext/{metatext_id}/download", response_model=MetaTextDetail)
def download_metatext(metatext_id: int, session: Session):
    metatext = session.exec(
        select(MetaText).where(MetaText.id == metatext_id)
    ).first()
    if not metatext:
        raise HTTPException(status_code=404, detail="MetaText not found")
    # You may want to include related chunks, etc.
    return JSONResponse(content=MetaTextDetail.from_orm(metatext).dict())
````

#### **b. Upload MetaText from JSON**

Create an endpoint to accept a JSON file and recreate the MetaText:

````python
from fastapi import UploadFile, File

@router.post("/metatext/upload")
async def upload_metatext(file: UploadFile = File(...), session: Session = Depends(get_session)):
    data = await file.read()
    import json
    metatext_data = json.loads(data)
    # Validate and create MetaText and related objects
    # (You may need to handle user/source_document mapping)
    # Example:
    metatext = MetaText(**metatext_data)
    session.add(metatext)
    session.commit()
    session.refresh(metatext)
    return {"id": metatext.id}
````

---

### 2. **Frontend: React**

#### **a. Download Button**

- Call the `/metatext/{id}/download` endpoint.
- Trigger a download of the returned JSON.

#### **b. Upload Button**

- Let user select a `.json` file.
- POST the file to `/metatext/upload`.

---

### 3. **Considerations**

- **Relationships:** If MetaText includes related Chunks, include them in the JSON (as in `MetaTextDetail`).
- **User/SourceDocument Mapping:** On upload, you may need to map the uploaded MetaText to the current user or a selected SourceDocument.
- **Validation:** Validate the uploaded JSON to prevent malformed data.

---

**Summary:**  

- Add endpoints to download/upload MetaText as JSON.  
- On download, serialize all necessary related data.  
- On upload, parse and recreate the MetaText and its children.  
- Use React to call these endpoints and handle file download/upload in the UI.

Let me know if you want code for the React side or more details on the backend!
