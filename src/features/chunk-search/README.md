# Chunk Search Feature

A comprehensive full-text search feature for the Meta Text application that enables users to instantly locate words, phrases, or tags across chunks and documents.

## Overview

This feature implements the search functionality as outlined in `future-features.md`, providing:

1. **Search Bar with Icon** - A persistent search input with search icon and clear functionality
3. **Navigation Controls** - Previous/Next buttons to cycle through matches
4. **Tag Filtering** - Toggleable tag chips to refine search results
5. **Keyboard Shortcuts** - Cmd+K to focus search, Escape to clear, arrow keys to navigate

## Components

### Core Components

- **`SearchContainer`** - Main orchestrating component that combines all search features
- **`SearchBar`** - Input field with search icon and clear button
- **`TagFilters`** - Chip-based tag filtering interface

### Hooks

- **`useSearch`** - Handles API calls and search state management with debouncing
- **`useSearchKeyboard`** - Implements keyboard shortcuts for search functionality

### Store

- **`useSearchStore`** - Consolidated Zustand store managing all search state including input (query, tags) and results (filtered chunks)

## Integration

The search feature is integrated into the `DocumentHeader` component and appears on the `MetatextDetailPage`. It includes:

- Search bar positioned prominently in the document header
- Tag filters below the search bar for refinement
- Navigation controls showing current match position

## Keyboard Shortcuts

- **Cmd+K (Mac) / Ctrl+K (Windows/Linux)**: Focus the search input
- **Escape**: Clear search and hide results
- **Cmd+Arrow Down**: Navigate to next match
- **Cmd+Arrow Up**: Navigate to previous match

## Styling

Custom CSS classes are provided for smooth scrolling and animations for better UX.

## API Integration

The search feature expects a backend endpoint at `/api/search/chunks` that accepts:

- `q`: Search query parameter
- `tags`: Comma-separated list of tag filters

Response format should include:

```json
{
  "results": [
    {
      "document_id": "string",
      "document_title": "string", 
      "matches": [
        {
          "chunk_id": "string",
          "chunk_title": "string",
          "match_text": "string",
          "context_before": "string",
          "context_after": "string",
          "position": "number"
        }
      ]
    }
  ]
}
```

## Features

### Live Search

- Debounced search with configurable delay (default 300ms)
- Minimum query length before triggering search (default 2 characters)
- Loading states and error handling

### Visual Feedback

- Smooth scrolling to matches
- Context snippets in search results

### Navigation

- Current match position indicator (e.g., "3/15")
- Prev/Next buttons to cycle through all matches
- Click on search result to jump to specific match

### Tag Filtering

- Pre-defined tag categories (#chapter, #comment, #todo, etc.)
- Toggle tags on/off to refine search results
- Visual indication of active filters

## Usage Example

```tsx
import { SearchContainer } from 'features/chunk-search';

function MyComponent() {
  const handleMatchClick = (chunkId, matchIndex) => {
    // Handle navigation to specific chunk/match
    console.log('Navigate to:', chunkId, matchIndex);
  };

  return (
    <SearchContainer 
      showTagFilters={true}
      availableTags={['#chapter', '#note', '#important']}
    />
  );
}
```

## File Structure

```text
src/features/chunk-search/
├── components/
│   ├── SearchBar.tsx
│   ├── SearchContainer.tsx
│   └── TagFilters.tsx
├── hooks/
│   ├── useSearch.ts
│   └── useSearchKeyboard.ts
├── store/
│   ├── useSearchStore.ts
│   └── usePaginationStore.ts
├── search.css
├── index.ts
└── README.md
```
