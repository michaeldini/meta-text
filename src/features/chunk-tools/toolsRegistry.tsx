// Central registry for chunk tools (that appear in the ChunkToolsPanel)
// Defines available tools with their metadata and components
// This centralizes tool management and makes it easy to add/remove tools

import React from 'react';
import { PhotoIcon, NotesIcon, QuestionMarkIcon, DocumentCheckIcon, PencilSquareIcon } from 'icons';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

// Tool component interface - all tools must implement this
export interface ChunkToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

// Tool definition interface
export interface ChunkTool {
    id: string;
    name: string;
    icon: React.ReactNode;
    tooltip: string;
    component: React.ComponentType<ChunkToolProps>;
    category?: 'analysis' | 'editing' | 'ai' | 'utility';
}

// Tool registry - direct imports, we'll handle the component updates separately
export const createChunkToolsRegistry = (): Omit<ChunkTool, 'component'>[] => [
    {
        id: 'note-summary',
        name: 'Notes & Summary',
        icon: <NotesIcon />,
        tooltip: 'Show or hide the Notes/Summary editor for all chunks',
        category: 'utility'
    },
    {
        id: 'evaluation',
        name: 'Evaluation',
        icon: <DocumentCheckIcon />,
        tooltip: 'Show or hide the AI-generated evaluation panel for all chunks',
        category: 'ai'
    },
    {
        id: 'image',
        name: 'Image',
        icon: <PhotoIcon />,
        tooltip: 'Show or hide the AI image panel for all chunks',
        category: 'ai'
    },
    {
        id: 'rewrite',
        name: 'Rewrite',
        icon: <PencilSquareIcon />,
        tooltip: 'Show or hide the rewrites for all chunks',
        category: 'analysis'
    },
    {
        id: 'explanation',
        name: 'Explanation',
        icon: <QuestionMarkIcon />,
        tooltip: 'Show or hide the explanation editor for all chunks',
        category: 'ai'
    }
];

// Export the registry instance
export const chunkToolsRegistry = createChunkToolsRegistry();

// Export just the tool IDs as a const array for type safety
export const CHUNK_TOOL_IDS = [
    'note-summary',
    'evaluation',
    'image',
    'rewrite',
    'explanation'
] as const;

export type ChunkToolId = typeof CHUNK_TOOL_IDS[number];
