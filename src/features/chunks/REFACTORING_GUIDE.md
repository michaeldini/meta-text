# Chunks Feature Refactoring - Migration Guide

## Overview

This refactoring reorganizes the chunks feature to separate concerns between tools (business logic) and layouts (UI presentation), making the code more modular and maintainable.

## New Structure

```
src/features/chunks/
├── components/           # Reusable UI components
│   ├── ChunkWords.tsx    # Moved from words/ and refactored
│   ├── ChunkTextField.tsx
│   └── index.ts
├── tools/               # Pure tool logic (business rules)
│   ├── split/           # ✅ Split Chunk Tool (NEW)
│   │   ├── SplitChunkTool.tsx
│   │   ├── useSplitChunk.ts
│   │   └── index.ts
│   ├── define/          # ✅ Define Word Tool (NEW)
│   │   ├── DefineWordTool.tsx
│   │   ├── useDefineWord.ts
│   │   └── index.ts
│   ├── merge/           # ✅ Merge Chunks Tool (NEW)
│   │   ├── MergeChunksTool.tsx
│   │   ├── useMergeChunks.ts
│   │   └── index.ts
│   ├── comparison/      # 🔄 TODO: Refactor existing
│   ├── image/           # 🔄 TODO: Refactor existing
│   ├── notes/           # 🔄 TODO: Refactor existing
│   ├── types.ts         # ✅ Common tool interfaces (NEW)
│   └── index.ts
├── layouts/             # UI Layout components
│   ├── dialogs/
│   │   ├── WordActionDialog.tsx  # ✅ Refactored (NEW)
│   │   └── index.ts
│   ├── toolbars/        # 🔄 TODO: Move existing toolbars here
│   ├── tabs/            # 🔄 TODO: Move existing tabs here
│   └── index.ts
├── hooks/               # 🔄 TODO: Shared chunk hooks
├── styles/
├── review/
└── index.tsx            # ✅ Updated exports
```

## Key Benefits

### 1. **Separation of Concerns**

- **Tools**: Pure business logic, reusable across different UIs
- **Layouts**: UI presentation, composing tools for specific use cases
- **Components**: Reusable UI building blocks

### 2. **Consistent Tool Interface**

```typescript
interface ChunkTool {
    id: string;
    name: string;
    description: string;
    requiresInput: boolean;
    execute: (...args: any[]) => Promise<ToolResult>;
}
```

### 3. **Better Testing**

- Tools can be tested independently of UI
- Layout components can be tested with mock tools
- Easier unit testing and integration testing

### 4. **Improved Maintainability**

- Each tool is self-contained with its own hook and component
- Clear interfaces between tools and layouts
- Easier to add new tools or modify existing ones

## Migration Steps

### Phase 1: ✅ Completed

1. Create new structure and types
2. Implement Split, Define, and Merge tools
3. Refactor WordActionDialog to use new tools
4. Update ChunkWords to use new structure

### Phase 2: 🔄 Next Steps

1. **Refactor Comparison Tool**

   ```
   tools/comparison/
   ├── ComparisonTool.tsx
   ├── useComparison.ts
   └── index.ts
   ```

2. **Refactor Image Tool**

   ```
   tools/image/
   ├── ImageTool.tsx
   ├── useImageTool.ts
   └── index.ts
   ```

3. **Refactor Notes/Summary Tool**

   ```
   tools/notes/
   ├── NotesTool.tsx
   ├── useNotesTool.ts
   └── index.ts
   ```

4. **Move Layout Components**

   ```
   layouts/
   ├── toolbars/
   │   ├── ChunkToolsNavbar.tsx     # Move from tools/
   │   ├── FloatingChunkToolbar.tsx # Move from tools/
   │   └── index.ts
   └── tabs/
       ├── ToolTabsDisplay.tsx      # Move from tools/tabs/
       └── index.ts
   ```

### Phase 3: 🔄 Future

1. Create shared hooks in `hooks/`
2. Implement tool registry for dynamic tool loading
3. Add tool configuration and settings
4. Implement tool analytics and usage tracking

## Usage Examples

### Using Individual Tools

```tsx
import { SplitChunkTool, DefineWordTool } from '@/features/chunks/tools';

// In any component
<SplitChunkTool 
    chunkIdx={0} 
    wordIdx={5} 
    word="example" 
    onComplete={(success, result) => console.log(success, result)} 
/>
```

### Using Layout Components

```tsx
import { WordActionDialog } from '@/features/chunks/layouts';

// In a layout component
<WordActionDialog
    anchorEl={anchorEl}
    onClose={onClose}
    word="example"
    wordIdx={5}
    chunkIdx={0}
    context="Full context text"
    metaTextId={123}
/>
```

### Using Hooks Directly

```tsx
import { useSplitChunk, useDefineWord } from '@/features/chunks/tools';

function MyComponent() {
    const { splitChunk } = useSplitChunk();
    const { defineWord } = useDefineWord();
    
    const handleAction = async () => {
        const result = await splitChunk({ chunkIdx: 0, wordIdx: 5, word: "example" });
        console.log(result);
    };
}
```

## Breaking Changes

### Imports

- ❌ Old: `import ChunkWords from '@/features/chunks/words/ChunkWords'`
- ✅ New: `import { ChunkWords } from '@/features/chunks/components'`

- ❌ Old: `import WordActionDialog from '@/features/chunks/words/WordActionDialog'`
- ✅ New: `import { WordActionDialog } from '@/features/chunks/layouts'`

### Component Props

- `WordActionDialog` now requires `wordIdx` and `chunkIdx` props
- Tools expect standardized props interface defined in `types.ts`

## Testing Strategy

### Tool Testing

```typescript
// Test business logic separately
describe('useSplitChunk', () => {
    it('should split chunk at correct word index', async () => {
        const { splitChunk } = renderHook(() => useSplitChunk());
        const result = await splitChunk({ chunkIdx: 0, wordIdx: 5, word: "test" });
        expect(result.success).toBe(true);
    });
});
```

### Layout Testing

```typescript
// Test UI composition with mock tools
describe('WordActionDialog', () => {
    it('should render split and define tools', () => {
        render(<WordActionDialog {...props} />);
        expect(screen.getByLabelText(/split chunk/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/define/i)).toBeInTheDocument();
    });
});
```

## Performance Considerations

1. **Lazy Loading**: Tools can be loaded on demand
2. **Memoization**: Hook results are memoized where appropriate
3. **Component Splitting**: Large tools can be code-split
4. **State Management**: Tools use zustand store efficiently

## Future Enhancements

1. **Plugin System**: Allow external tools to be registered
2. **Tool Composition**: Combine multiple tools into workflows
3. **Undo/Redo**: Implement command pattern for tool actions
4. **Tool Analytics**: Track tool usage and performance
5. **A/B Testing**: Test different tool interfaces
