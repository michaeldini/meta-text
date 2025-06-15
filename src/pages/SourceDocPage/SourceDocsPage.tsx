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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { SourceDocument } from '../../types/sourceDocument';

export default function SourceDocsPage() {
    const { sourceDocs, sourceDocsLoading, sourceDocsError, refresh } = useSourceDocuments();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    React.useEffect(() => {
        log.info('SourceDocsPage mounted');
        return () => log.info('SourceDocsPage unmounted');
    }, []);

    React.useEffect(() => {
        if (sourceDocsLoading) log.info('Loading source documents...');
        if (sourceDocsError) log.error('Error loading source documents:', sourceDocsError);
        if (!sourceDocsLoading && sourceDocs.length > 0) log.info(`Loaded ${sourceDocs.length} source documents`);
    }, [sourceDocsLoading, sourceDocsError, sourceDocs]);

    const handleSourceDocClick = (id: number) => {
        log.info(`Navigating to source document with id: ${id}`);
        navigate(`/sourceDocs/${id}`);
    };

    // Simple delete handler (no confirmation)
    const handleDeleteClick = (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        deleteSourceDocument(id)
            .then(() => refresh())
            .catch(err => {
                log.error('Delete failed', err);
                setDeleteError('Failed to delete the document. Please try again.');
                setSnackbarOpen(true);
            });
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <PageContainer>
            <SourceDocUploadForm refresh={refresh} />
            <ErrorBoundary>
                <LoadingBoundary loading={sourceDocsLoading}>
                    <SearchableList
                        items={sourceDocs}
                        onItemClick={handleSourceDocClick}
                        onDeleteClick={handleDeleteClick}
                        filterKey="title"
                    />
                </LoadingBoundary>
            </ErrorBoundary>
            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {deleteError}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}
