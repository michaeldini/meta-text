// Service to call backend for phrase explanation
import { apiPost } from '../../../utils/api';

export async function explainPhrase({ phrase, context, chunk }: { phrase: string, context?: string, chunk?: any }) {
    return apiPost('/api/explain_phrase', {
        phrase,
        context,
        chunk
    });
}
