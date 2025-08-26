// Purpose: Shared types for the Experiments (v2) flow.

export type Panel = {
    key: string;
    sourceWord: string; // the word or phrase that produced this panel
    loading?: boolean;
    error?: string | null;
    concise?: string;
    comprehensive?: string;
    viewMode: 'comprehensive' | 'concise';
    minimized?: boolean; // when true, show only controls and the source word
};
