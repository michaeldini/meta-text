# Floating Chunk Toolbar

## Overview

The FloatingChunkToolbar provides a floating interface for chunk management tools that appears in the top right corner of the screen when chunks are being worked with.

## Features

- **Fixed Positioning**: Stays in the top right corner, independent of page scrolling
- **Conditional Display**: Only appears when there's an active chunk
- **Smooth Transitions**: Fade in/out animation for better UX
- **Responsive Design**: Adjusts position based on screen size and NavBar height
- **Non-Intrusive**: Proper z-index management to avoid interfering with modals
- **Vertical Layout**: Optimized for floating position with compact design

## Components

### FloatingChunkToolbar

The main floating container component that handles positioning and visibility.

**Props:**

- `className?: string` - Additional CSS class name
- `data-testid?: string` - Test ID for testing (default: 'floating-chunk-toolbar')

### ChunkToolsNavbar

The core toolbar component that can work in both floating and inline modes.

**Props:**

- `isFloating?: boolean` - Whether rendered as floating element (default: false)
- `className?: string` - Additional CSS class name  
- `data-testid?: string` - Test ID for testing (default: 'chunk-tools-navbar')

## Usage

### Global Integration (Recommended)

The FloatingChunkToolbar is integrated globally in `App.tsx`:

```tsx
import FloatingChunkToolbar from './features/chunks/tools/FloatingChunkToolbar';

function App() {
    return (
        <>
            <NavBar />
            <Routes>...</Routes>
            <GlobalNotifications />
            <FloatingChunkToolbar />
        </>
    );
}
```

### Inline Usage (Alternative)

The ChunkToolsNavbar can also be used inline:

```tsx
import { ChunkToolsNavbar } from './features/chunks/tools';

function SomeComponent() {
    return (
        <div>
            {/* Other content */}
            <ChunkToolsNavbar isFloating={false} />
        </div>
    );
}
```

## Styling

### Positioning

- **Top Position**:
  - Mobile: 72px (NavBar height 56px + padding)
  - Desktop: 80px (NavBar height 64px + padding)
- **Right Position**:
  - Mobile: 8px spacing
  - Desktop: 16px spacing
- **Z-Index**: Uses Material-UI's speedDial z-index for proper layering

### Floating Mode Differences

When `isFloating={true}`:

- Vertical button layout
- Compact design with smaller buttons
- "Chunk Tools" label instead of active chunk ID
- "Dialog" button instead of "Dialogue"
- Tooltips positioned to the left

## Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support through Material-UI components
- Screen reader friendly tooltips and labels
- Clear visual hierarchy and contrast

## State Management

The component integrates with the chunk store to:

- Show/hide based on `activeChunkId`
- Control `activeTabs` for tool visibility
- React to chunk state changes

## Testing

Comprehensive test coverage includes:

- Visibility based on active chunk state
- Floating vs inline behavior differences
- Custom props handling
- Accessibility compliance
- Integration with chunk store

## Browser Compatibility

Works across all modern browsers that support:

- CSS `position: fixed`
- CSS Flexbox
- Material-UI components
- React functional components

## Performance Considerations

- Uses React.memo for preventing unnecessary re-renders
- Conditional rendering based on active chunk state
- Efficient Material-UI theme usage
- Optimized z-index positioning
