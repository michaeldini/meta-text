export type SourceDocument = {
    id: number;
    title: string;
    author?: string | null;
    summary?: string | null;
    characters?: string | null;
    locations?: string | null;
    themes?: string | null;
    symbols?: string | null;
    text?: string;
};
