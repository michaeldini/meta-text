// src/services/sourceDocumentService.js

export async function fetchSourceDocuments(full = false) {
    const url = full ? '/api/source-documents?full=true' : '/api/source-documents';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch source documents');
    const data = await res.json();
    if (full) {
        return data.source_documents || [];
    }
    // Map array of strings to array of { title } objects if needed
    if (Array.isArray(data.source_documents) && typeof data.source_documents[0] === 'string') {
        return data.source_documents.map(title => ({ title }));
    }
    return data.source_documents || [];
}

export async function uploadSourceDocument(title, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    const res = await fetch('/api/source-documents', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        let data;
        try { data = await res.json(); } catch { data = {}; }
        throw new Error(data.detail || 'Upload failed.');
    }
    return true;
}

export async function deleteSourceDocument(title) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(title)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete source document');
    return true;
}

export async function fetchAiSummary(title) {
    const res = await fetch(`/api/ai-summary/${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.result ? data.result : null;
}

export async function generateAiSummary(title, text) {
    const res = await fetch("/api/ai-complete-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, title }),
    });
    if (!res.ok) {
        let err;
        try { err = await res.json(); } catch { err = {}; }
        throw new Error(err.detail || "Summary failed");
    }
    const data = await res.json();
    return data.result;
}

export async function fetchSourceDocument(title) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    return await res.json();
}

export async function fetchSourceDocumentsWithDetails() {
    const res = await fetch('/api/source-documents-with-details');
    if (!res.ok) throw new Error('Failed to fetch source documents with details');
    const data = await res.json();
    return data.source_documents || [];
}
