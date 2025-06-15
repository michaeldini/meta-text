export type Chunk = {
    id: number;
    text: string;
    position: number;
    notes: string;
    summary: string;
    comparison: string;
    meta_text_id: number;
    ai_images?: AiImage[];
};

export type AiImage = {
    id: number;
    prompt: string;
    path: string;
    chunk_id: number;
};
