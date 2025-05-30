import React, { useState, useEffect } from 'react';
import './DocumentManagePage.css';
import './DocumentManageSidebar.css';
import { fetchSourceDocuments, uploadSourceDocument, deleteSourceDocument } from '../../services/sourceDocumentService';
import { fetchMetaTexts, createMetaText, deleteMetaText } from '../../services/metaTextService';
import SourceDocumentUploadForm from '../../components/SourceDocumentUploadForm';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import DocumentTable from '../../components/DocumentTable';

export default function DocumentManagePage() {
    // Shared state
    const [docs, setDocs] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // SourceDoc state
    const [file, setFile] = useState(null);
    const [sourceDocLabel, setSourceDocLabel] = useState('');
    const [sourceDocError, setSourceDocError] = useState('');
    const [sourceDocSuccess, setSourceDocSuccess] = useState('');
    const [sourceDocLoading, setSourceDocLoading] = useState(false);

    // Meta-text state
    const [selectedDoc, setSelectedDoc] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [metaError, setMetaError] = useState('');
    const [metaSuccess, setMetaSuccess] = useState('');
    const [metaLoading, setMetaLoading] = useState(false);

    // Meta-texts state
    const [metaTexts, setMetaTexts] = useState([]);
    const [loadingMetaTexts, setLoadingMetaTexts] = useState(false);

    // Fetch docs
    const fetchDocs = () => {
        setLoadingDocs(true);
        fetchSourceDocuments()
            .then(setDocs)
            .catch(() => setDocs([]))
            .finally(() => setLoadingDocs(false));
    };

    // Fetch meta-texts
    const fetchMetaTextsHandler = () => {
        setLoadingMetaTexts(true);
        fetchMetaTexts()
            .then(setMetaTexts)
            .catch(() => setMetaTexts([]))
            .finally(() => setLoadingMetaTexts(false));
    };

    useEffect(() => {
        fetchDocs();
        fetchMetaTextsHandler();
    }, [sourceDocSuccess, metaSuccess]);

    // SourceDoc handlers
    const handleSourceDocFileChange = (e) => {
        setFile(e.target.files[0]);
        setSourceDocError('');
        setSourceDocSuccess('');
    };
    const handleSourceDocLabelChange = (e) => {
        setSourceDocLabel(e.target.value);
        setSourceDocError('');
        setSourceDocSuccess('');
    };
    const handleSourceDocumentSubmit = async (e) => {
        e.preventDefault();
        if (!file || !sourceDocLabel) {
            setSourceDocError('Please select a file and enter a label.');
            return;
        }
        setSourceDocLoading(true);
        setSourceDocError('');
        setSourceDocSuccess('');
        try {
            await uploadSourceDocument(sourceDocLabel, file);
            setSourceDocSuccess('File uploaded successfully!');
            setFile(null);
            setSourceDocLabel('');
        } catch (err) {
            setSourceDocError(err.message);
        }
        setSourceDocLoading(false);
    };

    // Meta-text handlers
    const handleMetaSubmit = async (e) => {
        e.preventDefault();
        setMetaError('');
        setMetaSuccess('');
        if (!selectedDoc || !newLabel) {
            setMetaError('Please select a document and enter a label.');
            return;
        }
        setMetaLoading(true);
        try {
            await createMetaText(selectedDoc, newLabel);
            setMetaSuccess('Meta-text created!');
            setNewLabel('');
            setSelectedDoc('');
        } catch (err) {
            setMetaError(err.message);
        }
        setMetaLoading(false);
    };

    // Delete a single source document
    const handleDeleteSourceDoc = async (label) => {
        if (!window.confirm(`Delete source document '${label}'?`)) return;
        setLoadingDocs(true);
        try {
            await deleteSourceDocument(label);
            setDocs(docs.filter(doc => doc !== label));
        } finally {
            setLoadingDocs(false);
        }
    };
    // Delete a single meta-text
    const handleDeleteMetaText = async (label) => {
        if (!window.confirm(`Delete meta-text '${label}'?`)) return;
        setLoadingMetaTexts(true);
        try {
            await deleteMetaText(label);
            setMetaTexts(metaTexts.filter(meta => meta !== label));
        } finally {
            setLoadingMetaTexts(false);
        }
    };

    return (
        <div className="document-manage-page sidebar-layout">
            <aside className="sidebar">
                <SourceDocumentUploadForm
                    file={file}
                    uploadLabel={sourceDocLabel}
                    uploadError={sourceDocError}
                    uploadSuccess={sourceDocSuccess}
                    uploadLoading={sourceDocLoading}
                    onFileChange={handleSourceDocFileChange}
                    onLabelChange={handleSourceDocLabelChange}
                    onSubmit={handleSourceDocumentSubmit}
                />
                <MetaTextCreateForm
                    docs={docs}
                    selectedDoc={selectedDoc}
                    newLabel={newLabel}
                    metaError={metaError}
                    metaSuccess={metaSuccess}
                    metaLoading={metaLoading}
                    loadingDocs={loadingDocs}
                    onDocChange={e => setSelectedDoc(e.target.value)}
                    onLabelChange={e => setNewLabel(e.target.value)}
                    onSubmit={handleMetaSubmit}
                />
            </aside>
            <main className="main-content">
                <h2>Manage Documents</h2>
                <div className="manage-sections">
                </div>
                <DocumentTable
                    title="Source Documents"
                    items={docs}
                    loading={loadingDocs}
                    emptyMessage="No texts available."
                    onDelete={handleDeleteSourceDoc}
                />
                <DocumentTable
                    title="Meta-Texts"
                    items={metaTexts}
                    loading={loadingMetaTexts}
                    emptyMessage="No meta-texts available."
                    onDelete={handleDeleteMetaText}
                />
            </main>
        </div>
    );
}
