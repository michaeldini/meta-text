// Remove leading/trailing punctuation or symbol characters and trim whitespace.
// Uses Unicode property escapes to target punctuation (P) and symbols (S).
export const trimPunctuation = (text: string): string => {
    return text.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '').trim();
};
