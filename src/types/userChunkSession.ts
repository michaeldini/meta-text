export interface UserChunkSessionRead {
    id: number;
    user_id: number;
    meta_text_id: number;
    last_active_chunk_id: number;
    updated_at: string;
}

export interface UserChunkSessionCreate {
    user_id: number;
    meta_text_id: number;
    last_active_chunk_id: number;
}
