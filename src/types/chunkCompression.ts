export interface ChunkCompression {
    id: number;
    title: string; // e.g., "like im 5", "like a bro"
    compressed_text: string;
    chunk_id: number;
}

export interface ChunkCompressionCreate {
    title: string;
    compressed_text: string;
    chunk_id?: number; // optional for creation, will be set by backend
}
