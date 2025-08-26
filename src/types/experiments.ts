// Purpose: Shared types for the Experiments (v2) flow.

export type ViewMode = 'comprehensive' | 'concise';

export type Highlight = {
    // character range (inclusive start, exclusive end) in the specific view's text
    start: number;
    end: number;
    color: string; // CSS color (e.g., hsla(...)) used to tint the background
    viewMode: ViewMode; // which view the range applies to
};

export type Panel = {
    key: string;
    sourceWord: string; // the word or phrase that produced this panel
    loading?: boolean;
    error?: string | null;
    concise?: string;
    comprehensive?: string;
    viewMode: ViewMode;
    minimized?: boolean; // when true, show only controls and the source word
    // visual linkage to the word selection that opened this panel
    linkColor?: string; // panel tint color to connect with its parent selection
    parentKey?: string; // the panel key where the selection was made
    highlights?: Highlight[]; // selection highlights that occurred in this panel
};
