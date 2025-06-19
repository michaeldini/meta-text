import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import log from '../../utils/logger';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import { deleteMetaText } from '../../services/metaTextService';
import { usePageLogger } from '../../hooks/usePageLogger';
import CombinedCreateForm from '../../features/createform/components';
import { Typography } from '@mui/material';
import DocTypeSelect, { DocType } from '../../components/DocTypeSelect';
import type { SourceDocument } from '../../types/sourceDocument';
import type { MetaText } from '../../types/metaText';
import { useApi } from '../../services/useApi';

export default function HomePage() {
    // Use useApi for both source documents and meta texts
    const { data: sourceDocs, error: sourceDocsError, loading: sourceDocsLoading, request: fetchSourceDocs } = useApi<SourceDocument[]>();
    const { data: metaTexts, error: metaTextsError, loading: metaTextsLoading, request: fetchMetaTexts } = useApi<MetaText[]>();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [docType, setDocType] = React.useState<DocType>('sourceDoc');

    usePageLogger('HomePage', {
        watched: [
            ['sourceDocsLoading', sourceDocsLoading],
            ['sourceDocsError', sourceDocsError],
            ['sourceDocs', sourceDocs?.length || 0],
            ['metaTextsLoading', metaTextsLoading],
            ['metaTextsError', metaTextsError],
            ['metaTexts', metaTexts?.length || 0]
        ]
    });

    // Fetch data on mount
    React.useEffect(() => {
        fetchSourceDocs({ url: '/api/source-documents', method: 'GET' });
        fetchMetaTexts({ url: '/api/meta-texts', method: 'GET' });
    }, [fetchSourceDocs, fetchMetaTexts]);

    // Handlers for navigation
    const handleSourceDocClick = (id: number) => {
        log.info(`Navigating to source document with id: ${id}`);
        navigate(`/sourceDocs/${id}`);
    };
    const handleMetaTextClick = (id: number) => {
        log.info(`Navigating to meta text with id: ${id}`);
        navigate(`/metaText/${id}`);
    };

    // Delete handlers
    const handleDeleteSourceDoc = (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        fetchSourceDocs({ url: `/api/source-documents/${id}`, method: 'DELETE' })
            .then(() => fetchSourceDocs({ url: '/api/source-documents', method: 'GET' }))
            .catch(err => {
                log.error('Delete source doc failed', err);
                setDeleteError('Failed to delete the source document. Please try again.');
                setSnackbarOpen(true);
            });
    };
    const handleDeleteMetaText = (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        fetchMetaTexts({ url: `/api/meta-text/${id}`, method: 'DELETE' })
            .then(() => fetchMetaTexts({ url: '/api/meta-texts', method: 'GET' }))
            .catch(err => {
                log.error('Delete meta text failed', err);
                setDeleteError('Failed to delete the meta text. Please try again.');
                setSnackbarOpen(true);
            });
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <PageContainer>
            <DocTypeSelect value={docType} onChange={setDocType} />
            <Typography variant="h5" gutterBottom>
                Create
            </Typography>
            <CombinedCreateForm
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={() => {
                    fetchSourceDocs({ url: '/api/source-documents', method: 'GET' });
                    fetchMetaTexts({ url: '/api/meta-texts', method: 'GET' });
                }}
                docType={docType}
            />
            <ErrorBoundary>
                <LoadingBoundary loading={docType === 'sourceDoc' ? sourceDocsLoading : metaTextsLoading}>
                    <Typography variant="h5" gutterBottom>
                        Search
                    </Typography>
                    {docType === 'sourceDoc' ? (
                        <SearchableList
                            items={sourceDocs || []}
                            onItemClick={handleSourceDocClick}
                            onDeleteClick={handleDeleteSourceDoc}
                            filterKey="title"
                        />
                    ) : (
                        <SearchableList
                            items={metaTexts || []}
                            onItemClick={handleMetaTextClick}
                            onDeleteClick={handleDeleteMetaText}
                            filterKey="title"
                        />
                    )}
                </LoadingBoundary>
            </ErrorBoundary>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {deleteError}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}
