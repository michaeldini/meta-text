import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../features/searchablelist/components/SearchableList';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import log from '../../utils/logger';
import { usePageLogger } from '../../hooks/usePageLogger';
import CreateForm from '../../features/createform/components';
import { Typography } from '@mui/material';
import { getErrorMessage } from '../../types/error';
import DocTypeSelect, { DocType } from '../../components/DocTypeSelect';
import { useDocumentsStore } from '../../store/documentsStore';
import { useNotifications } from '../../store/notificationStore';

export default function HomePage() {
    // Use Zustand stores
    const {
        sourceDocs,
        sourceDocsLoading,
        sourceDocsError,
        metaTexts,
        metaTextsLoading,
        metaTextsError,
        fetchSourceDocs,
        fetchMetaTexts,
        deleteSourceDoc,
        deleteMetaText,
    } = useDocumentsStore();

    const { showSuccess, showError } = useNotifications();
    const navigate = useNavigate();
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
        fetchSourceDocs();
        fetchMetaTexts();
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
    const handleDeleteSourceDoc = async (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        try {
            await deleteSourceDoc(id);
            showSuccess('Source document deleted successfully.');
        } catch (error: unknown) {
            log.error('Delete source document failed', error);
            showError(getErrorMessage(error, 'Failed to delete the source document. Please try again.'));
        }
    };

    const handleDeleteMetaText = async (id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        try {
            await deleteMetaText(id);
            showSuccess('Meta text deleted successfully.');
        } catch (error: unknown) {
            log.error('Delete meta text failed', error);
            showError(getErrorMessage(error, 'Failed to delete the meta text. Please try again.'));
        }
    };

    return (
        <PageContainer>
            <DocTypeSelect value={docType} onChange={setDocType} />
            <Typography variant="h5" gutterBottom>
                Create
            </Typography>
            <CreateForm
                sourceDocs={sourceDocs || []}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onSuccess={() => {
                    fetchSourceDocs();
                    fetchMetaTexts();
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
        </PageContainer>
    );
}
