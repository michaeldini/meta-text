// Central registry for chunk tools (that appear in the ChunkToolsPanel)
// Defines available tools with their metadata and components
// This centralizes tool management and makes it easy to add/remove tools

import React from 'react';
import { CompareArrowsIcon, PhotoIcon, NotesIcon, CompressionIcon, QuestionMarkIcon } from 'icons';
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
        id: 'notes-summary',
        name: 'Notes & Summary',
        icon: <NotesIcon />,
        tooltip: 'Show or hide the Notes/Summary editor for all chunks',
        category: 'utility'
    },
    {
        id: 'comparison',
        name: 'AI Comparison',
        icon: <CompareArrowsIcon />,
        tooltip: 'Show or hide the AI-generated comparison panel for all chunks',
        category: 'ai'
    },
    {
        id: 'ai-image',
        name: 'AI Image',
        icon: <PhotoIcon />,
        tooltip: 'Show or hide the AI image panel for all chunks',
        category: 'ai'
    },
    {
        id: 'compression',
        name: 'Compression',
        icon: <CompressionIcon />,
        tooltip: 'Show or hide the compressions for all chunks',
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
    'notes-summary',
    'comparison',
    'ai-image',
    'compression',
    'explanation'
] as const;

export type ChunkToolId = typeof CHUNK_TOOL_IDS[number];
