import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import log from '../../utils/logger';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { deleteSourceDocument } from '../../services/sourceDocumentService';
import { deleteMetaText } from '../../services/metaTextService';
import { usePageLogger } from '../../hooks/usePageLogger';
import CombinedCreateForm from '../../features/createform/components/Form';
import { Typography } from '@mui/material';

export default function HomePage() {
    const { sourceDocs, sourceDocsLoading, sourceDocsError, refresh: refreshSourceDocs } = useSourceDocuments();
    const { metaTexts, metaTextsLoading, metaTextsError, refresh: refreshMetaTexts } = useMetaTexts();
    const navigate = useNavigate();
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);

    usePageLogger('HomePage', {
        watched: [
            ['sourceDocsLoading', sourceDocsLoading],
            ['sourceDocsError', sourceDocsError],
            ['sourceDocs', sourceDocs.length],
            ['metaTextsLoading', metaTextsLoading],
            ['metaTextsError', metaTextsError],
            ['metaTexts', metaTexts.length]
        ]
    });

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
        deleteSourceDocument(id)
            .then(() => refreshSourceDocs())
            .catch(err => {
                log.error('Delete source doc failed', err);
                setDeleteError('Failed to delete the source document. Please try again.');
                setSnackbarOpen(true);
            });
    };
    const handleDeleteMetaText = (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        deleteMetaText(id)
            .then(() => refreshMetaTexts())
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
            <Typography variant="h4" gutterBottom>
                Create
            </Typography>
            <CombinedCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={() => {
                    refreshSourceDocs();
                    refreshMetaTexts();
                }}
            />
            <ErrorBoundary>
                <LoadingBoundary loading={sourceDocsLoading}>
                    <h2>Source Documents</h2>
                    <SearchableList
                        items={sourceDocs}
                        onItemClick={handleSourceDocClick}
                        onDeleteClick={handleDeleteSourceDoc}
                        filterKey="title"
                    />
                </LoadingBoundary>
            </ErrorBoundary>
            <ErrorBoundary>
                <LoadingBoundary loading={metaTextsLoading}>
                    <h2>Meta Texts</h2>
                    <SearchableList
                        items={metaTexts}
                        onItemClick={handleMetaTextClick}
                        onDeleteClick={handleDeleteMetaText}
                        filterKey="title"
                    />
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
