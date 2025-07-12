# Chunk Tools Pattern Proposal

## Current Issues

1. **Unnecessary Tab Wrappers**: Most tab components are just thin wrappers around tools
2. **Development Friction**: Extra layer makes it harder to find actual implementation
3. **Unclear Naming**: "ChunkToolButtons" doesn't convey purpose
4. **Scattered Logic**: Tool visibility and management is split across files

## Proposed Solution: Direct Tool Pattern

### 1. Tool Registration System

```tsx
// features/chunk-tools/toolsRegistry.ts
export interface ChunkTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  tooltip: string;
  component: React.ComponentType<ChunkToolProps>;
  category?: 'analysis' | 'editing' | 'ai' | 'utility';
}

export const chunkTools: ChunkTool[] = [
  {
    id: 'notes',
    name: 'Notes & Summary',
    icon: <NotesIcon />,
    tooltip: 'Add notes and summary for this chunk',
    component: NotesTool,
    category: 'utility'
  },
  {
    id: 'comparison',
    name: 'AI Comparison',
    icon: <CompareArrowsIcon />,
    tooltip: 'Generate AI comparison analysis',
    component: ComparisonTool,
    category: 'ai'
  },
  // ... other tools
];
```

### 2. Simplified Tool Components

```tsx
// features/chunk-notes/NotesTool.tsx
interface NotesToolProps {
  chunk: ChunkType;
  updateChunkField: UpdateChunkFieldFn;
  isVisible: boolean; // Controlled by tools panel
}

const NotesTool: React.FC<NotesToolProps> = ({ chunk, updateChunkField, isVisible }) => {
  if (!isVisible) return null;
  
  // All logic here - no wrapper needed
  const handleSummaryBlur = useCallback(
    (val: string) => updateChunkField(chunk.id, 'summary', val),
    [chunk.id, updateChunkField]
  );

  return (
    <Box sx={styles.toolContainer}>
      {/* Implementation */}
    </Box>
  );
};
```

### 3. Centralized Tools Container

```tsx
// features/chunk-tools/ChunkToolsContainer.tsx
const ChunkToolsContainer: React.FC<{ chunk: ChunkType }> = ({ chunk }) => {
  const { activeTools, updateChunkField } = useChunkStore();
  
  return (
    <Box sx={styles.toolsContainer}>
      <CopyTool chunk={chunk} /> {/* Always visible */}
      
      {chunkTools.map(tool => (
        <tool.component
          key={tool.id}
          chunk={chunk}
          updateChunkField={updateChunkField}
          isVisible={activeTools.includes(tool.id)}
        />
      ))}
    </Box>
  );
};
```

### 4. Improved Tools Panel

```tsx
// features/chunk-tools/ChunkToolsPanel.tsx (renamed from ChunkToolButtons)
const ChunkToolsPanel: React.FC = () => {
  const { activeTools, toggleTool } = useChunkStore();
  
  return (
    <FloatingPanel>
      <ToggleButtonGroup value={activeTools} onChange={handleToggle}>
        {chunkTools.map(tool => (
          <ToolToggleButton
            key={tool.id}
            tool={tool}
            isActive={activeTools.includes(tool.id)}
          />
        ))}
      </ToggleButtonGroup>
    </FloatingPanel>
  );
};
```

## Benefits

### 1. Reduced Complexity

- **Before**: Tool → Tab → ChunkTabs → Chunk
- **After**: Tool → ChunkToolsContainer → Chunk

### 2. Better Developer Experience

- Direct access to tool implementation
- No boilerplate tab wrappers
- Clear tool registration system

### 3. Easier Tool Management

- Centralized tool registry
- Easy to add/remove tools
- Consistent interface for all tools

### 4. Better Organization

```
features/
├── chunk-tools/              # Central tool management
│   ├── ChunkToolsPanel.tsx   # Floating toggle panel
│   ├── ChunkToolsContainer.tsx # Renders active tools
│   ├── toolsRegistry.ts      # Tool definitions
│   └── hooks/
├── chunk-notes/              # Specific tool implementation
│   ├── NotesTool.tsx         # Direct tool component
│   └── hooks/
├── chunk-comparison/
│   ├── ComparisonTool.tsx
│   └── hooks/
```

## Migration Strategy

### Phase 1: Create New Structure

1. Create `chunk-tools` feature with registry
2. Create new `ChunkToolsContainer` and `ChunkToolsPanel`
3. Rename `ChunkToolButtons` → `ChunkToolsPanel`

### Phase 2: Update Tool Components

1. Remove tab wrappers (NotesTab, ComparisonTab, etc.)
2. Update tools to accept `isVisible` prop
3. Move tool logic from tabs into tools directly

### Phase 3: Update Chunk Component

1. Replace `ChunkTabs` with `ChunkToolsContainer`
2. Update store to use tool IDs instead of tab names
3. Remove old tab-related code

### Phase 4: Cleanup

1. Remove unused tab components
2. Update exports and imports
3. Update tests

## Alternative Patterns Considered

### A. Plugin Pattern

```tsx
// Each tool is a plugin with metadata
interface ChunkPlugin {
  register: () => ToolDefinition;
  component: React.ComponentType;
}
```

### B. Hook-Based Pattern

```tsx
// Tools register themselves via hooks
const useChunkTool = (toolConfig) => {
  // Registration and management logic
};
```

### C. Context Provider Pattern

```tsx
// Each tool provides its own context
<ChunkToolsProvider>
  <NotesToolProvider>
    <ComparisonToolProvider>
      {/* Tools */}
    </ComparisonToolProvider>
  </NotesToolProvider>
</ChunkToolsProvider>
```

## Recommendation

I recommend the **Direct Tool Pattern** because it:

- Eliminates unnecessary abstraction layers
- Makes the codebase more maintainable
- Improves developer experience
- Keeps the architecture simple and clear
- Maintains flexibility for future tools

The pattern balances simplicity with extensibility, making it easy to add new tools while keeping the existing ones maintainable.
