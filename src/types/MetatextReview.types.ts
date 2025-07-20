

export interface Explanation {
    id: number;
    words: string;
    context: string;
    explanation: string;
    explanation_in_context: string;
    type: 'word' | 'phrase';
    created_at: string;
    user_id: number;
    metatext_id: number;
}

