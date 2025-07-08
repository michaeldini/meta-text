# Image Tool Module

A comprehensive React component system for AI-powered image generation within the chunk management system.

## Overview

The Image Tool provides users with the ability to generate contextual images for text chunks using AI. It features a clean, intuitive interface with loading states, error handling, and responsive design.

## Components

### `ImageTool` (Main Component)

The primary component that orchestrates image generation functionality.

**Features:**

- AI image generation with custom prompts
- Integrated loading and error states
- Responsive Material-UI design
- Accessibility compliance

**Props:**

```typescript
interface ImageToolProps {
  chunk: ChunkType; // Required: The text chunk for image generation
}
```

### `ImageDisplay`

A reusable component for displaying images with optional lightbox functionality.

**Features:**

- Automatic loading state management
- Fullscreen lightbox modal
- Responsive image sizing
- Accessibility support

### `ImageGenerationDialog`

A modal dialog for prompt input and image generation controls.

**Features:**

- Form validation (requires non-empty prompt)
- Loading indicators
- Error message display
- Keyboard navigation support

## Utilities

### `pollImageAvailability`

A utility function that polls for image availability after generation.

**Parameters:**

- `url: string` - The image URL to check
- `timeout: number` - Maximum wait time (default: 10s)
- `interval: number` - Check interval (default: 300ms)

## Usage

```tsx
import { ImageTool } from 'features/chunk/tools/image';

// Basic usage
<ImageTool chunk={chunkData} />
```

## State Management

The module uses a custom hook (`useImageTool`) that provides:

- Centralized state management
- API integration with the backend
- Automatic chunk data synchronization
- Error handling and loading states

## Styling

Components use the shared tool styling system (`getSharedToolStyles`) for consistent appearance across all chunk tools. The design follows Material-UI patterns and supports theming.

## Dependencies

- React 18+
- Material-UI (@mui/material)
- Custom services (aiService)
- Shared components (AiGenerationButton)
- Type definitions (types)

## Performance

- Optimized re-rendering through hook memoization
- Asynchronous image loading with polling
- Self-contained component state management
- Minimal prop drilling

## Accessibility

- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Loading state announcements
- Meaningful alt text for images
