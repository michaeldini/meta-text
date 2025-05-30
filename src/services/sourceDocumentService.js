// src/services/sourceDocumentService.js

export async function fetchSourceDocuments(full = false) {
    const url = full ? '/api/source-documents?full=true' : '/api/source-documents';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch source documents');
    const data = await res.json();
    if (full) {
        return data.source_documents || [];
    }
    // Map array of strings to array of { label } objects if needed
    if (Array.isArray(data.source_documents) && typeof data.source_documents[0] === 'string') {
        return data.source_documents.map(label => ({ label }));
    }
    return data.source_documents || [];
}

export async function uploadSourceDocument(label, file) {
    const formData = new FormData();
    formData.append('label', label);
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

export async function deleteSourceDocument(label) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete source document');
    return true;
}

export async function fetchAiSummary(label) {
    const res = await fetch(`/api/ai-summary/${encodeURIComponent(label)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.result ? data.result : null;
}

export async function generateAiSummary(label, content) {
    const res = await fetch("/api/ai-complete-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content, label }),
    });
    if (!res.ok) {
        let err;
        try { err = await res.json(); } catch { err = {}; }
        throw new Error(err.detail || "Summary failed");
    }
    const data = await res.json();
    return data.result;
}

export async function fetchSourceDocument(label) {
    const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    return await res.json();
}
