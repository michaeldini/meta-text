// import { useState, useCallback } from 'react';
// import { explainWordsOrChunk, ExplanationResponse } from '../../../../services/aiService';

// interface ExplainWordsParams {
//     words: string;
//     context?: string;
//     chunk?: any;
//     metaTextId?: string | number;
// }

// export function useExplainWords() {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const explain = useCallback(
//         async (params: ExplainWordsParams): Promise<ExplanationResponse | null> => {
//             setLoading(true);
//             setError(null);
//             const metaTextId = params.metaTextId ?? params.chunk?.meta_text_id;
//             try {
//                 const data = await explainWordsOrChunk({
//                     words: params.words,
//                     context: params.context || '',
//                     metaTextId: metaTextId ? Number(metaTextId) : undefined,
//                     chunkId: undefined
//                 });
//                 setLoading(false);
//                 if (data && (data.explanation || data.explanationWithContext)) {
//                     return data;
//                 }
//                 setError('Failed to explain words');
//                 return null;
//             } catch (err: any) {
//                 setLoading(false);
//                 setError(err.message || 'Failed to explain words');
//                 return null;
//             }
//         },
//         []
//     );

//     return { explain, loading, error };
// }
