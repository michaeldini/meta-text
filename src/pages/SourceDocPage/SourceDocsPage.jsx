import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../components/SearchableList';
import SourceDocUploadForm from '../../components/SourceDocUploadForm';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import log from '../../utils/logger';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';

export default function SourceDocsPage() {
    const { docs = [], loading, error, refresh } = useSourceDocuments();
    const navigate = useNavigate();

    React.useEffect(() => {
        log.info('SourceDocsPage mounted');
        return () => log.info('SourceDocsPage unmounted');
    }, []);

    React.useEffect(() => {
        if (loading) log.info('Loading source documents...');
        if (error) log.error('Error loading source documents:', error);
        if (!loading && docs.length > 0) log.info(`Loaded ${docs.length} source documents`);
    }, [loading, error, docs]);

    const handleSourceDocClick = id => {
        log.info(`Navigating to source document with id: ${id}`);
        navigate(`/sourceDocs/${id}`);
    };

    // Simple delete handler (no confirmation)
    const handleDeleteClick = async (id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        try {
            await deleteSourceDocument(id);
            refresh();
        } catch (err) {
            log.error('Delete failed', err);
        }
    };

    return (
        <PageContainer>
            <SourceDocUploadForm refresh={refresh} />
            <ErrorBoundary>
                <LoadingBoundary loading={loading}>
                    <SearchableList
                        items={docs}
                        onItemClick={handleSourceDocClick}
                        onDeleteClick={handleDeleteClick}
                        filterKey="title"
                    />
                </LoadingBoundary>
            </ErrorBoundary>
        </PageContainer>
    );
}
