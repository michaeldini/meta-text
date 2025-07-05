// This configuration file defines the toolbar buttons and related types. It is used in the ChunkToolbar component to render the buttons for toggling different features in the chunk editor.

import React from 'react';
import { Typography } from '@mui/material';
import { CompareArrowsIcon, PhotoIcon, NotesIcon, CompressionIcon, QuestionMarkIcon } from 'icons';


export const CHUNK_TABS = [
    'comparison',
    'ai-image',
    'notes-summary',
    'compression',
    'explanation',
] as const;

export type ChunkTab = typeof CHUNK_TABS[number];


export const toggleButtons = [
    {
        value: 'notes-summary',
        ariaLabel: 'Show Notes/Summary',
        tooltipTitle: <Typography variant="caption">Show or hide the Notes/Summary editor for all chunks</Typography>,
        icon: <NotesIcon />
    },
    {
        value: 'comparison',
        ariaLabel: 'Show Comparison',
        tooltipTitle: <Typography variant="caption">Show or hide the AI-generated comparison panel for all chunks</Typography>,
        icon: <CompareArrowsIcon />
    },
    {
        value: 'ai-image',
        ariaLabel: 'Show AI Image',
        tooltipTitle: <Typography variant="caption">Show or hide the AI image panel for all chunks</Typography>,
        icon: <PhotoIcon />
    },
    {
        value: 'compression',
        ariaLabel: 'Compress Chunk',
        tooltipTitle: <Typography variant="caption">Show or hide the compressions for all chunks</Typography>,
        icon: <CompressionIcon />
    },
    {
        value: 'explanation',
        ariaLabel: 'Show Explanation',
        tooltipTitle: <Typography variant="caption">Show or hide the explanation editor for all chunks</Typography>,
        icon: <QuestionMarkIcon />
    },
];
