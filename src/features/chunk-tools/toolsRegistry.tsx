// Central registry for chunk tools (that appear in the ChunkToolsPanel)
// Defines available tools with their metadata and components
// This centralizes tool management and makes it easy to add/remove tools

import React from 'react';
import { HiDocumentText, HiQuestionMarkCircle, HiPhoto, HiCheck, HiPencilSquare, } from 'react-icons/hi2';
import type { ChunkType } from '@mtypes/documents';

// Tool component interface - all tools must implement this
export interface ChunkToolProps {
    chunk: ChunkType;
    mutateChunkField: any;
    isVisible: boolean;
}

// Tool definition interface
export interface ChunkTool {
    id: ChunkToolId;
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
        icon: <HiDocumentText />,
        tooltip: 'Show or hide the Notes/Summary editor for all chunks',
        category: 'utility'
    },
    {
        id: 'evaluation',
        name: 'Evaluation',
        icon: <HiCheck />,
        tooltip: 'Show or hide the AI-generated evaluation panel for all chunks',
        category: 'ai'
    },
    {
        id: 'image',
        name: 'Image',
        icon: <HiPhoto />,
        tooltip: 'Show or hide the AI image panel for all chunks',
        category: 'ai'
    },
    {
        id: 'rewrite',
        name: 'Rewrite',
        icon: <HiPencilSquare />,
        tooltip: 'Show or hide the rewrites for all chunks',
        category: 'analysis'
    },
    {
        id: 'explanation',
        name: 'Explanation',
        icon: <HiQuestionMarkCircle />,
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
