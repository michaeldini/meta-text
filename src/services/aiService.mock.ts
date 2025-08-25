// Development-only mock for AI service calls used by ExperimentsPage2.
// Purpose: Provide hardcoded responses with a small delay so the UI can be
// tested without hitting real APIs. Manually switch imports back to
// `./aiService` for production.

export interface ExplanationRequest2 {
    word: string;
    context?: string;
}

export interface ExplanationResponse2 {
    word: string;
    concise: string;
    comprehensive: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Tiny helper to generate some varied but deterministic text per word
function makeMockText(word: string) {
    const base = word.trim() || 'concept';
    const related = [
        'context', 'meaning', 'usage', 'origin', 'nuance',
        'example', 'pattern', 'contrast', 'similarity', 'implication',
    ];
    const pick = (n: number) => related.slice(0, Math.max(2, Math.min(5, (base.length % related.length) + n)));

    const comprehensive = `"${base}" is a placeholder term used in this mock to help you iterate on layout and interactions. In plain words, it refers to the idea you're exploring. In context, ${base} might relate to ${pick(1).join(', ')}. Try clicking any word to branch further, compare perspectives, or discover connections.`;

    const concise = `Quick take on ${base}: a mock explanation so you can test the UI without real API calls. Click words to expand.`;

    return { comprehensive, concise };
}

// Mocked explain2 used by ExperimentsPage2
export async function explain2(params: ExplanationRequest2): Promise<ExplanationResponse2> {
    // Simulate a small network delay so spinners and loading states can be tested
    await sleep(450 + Math.floor(Math.random() * 400));

    const { comprehensive, concise } = makeMockText(params.word);
    const ctxNote = params.context && params.context.trim()
        ? ` In this context, it appears near: "${params.context.slice(0, 120)}${params.context.length > 120 ? '…' : ''}"`
        : '';

    return {
        word: params.word,
        concise: concise + ctxNote,
        comprehensive: comprehensive + ctxNote,
    };
}

// Optional: named export to make it obvious in logs when the mock is in use
export const __USING_MOCK_AI__ = true;
