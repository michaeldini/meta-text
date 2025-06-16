import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import PageContainer from '../../components/PageContainer';
import SearchableList from '../../components/SearchableList';
import MetaTextCreateForm from '../../components/MetaTextCreateForm';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { useMetaTexts } from '../../hooks/useMetaTexts';
import { deleteMetaText } from '../../services/metaTextService';
import log from '../../utils/logger';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import { usePageLogger } from '../../hooks/usePageLogger';
import type { MetaText } from '../../types/metaText';
import type { SourceDocument } from '../../types/sourceDocument';

export default function MetaTextPage() {
    const { sourceDocs, sourceDocsLoading, sourceDocsError } = useSourceDocuments();
    const { metaTexts, metaTextsLoading, metaTextsError, refresh } = useMetaTexts();
    const navigate = useNavigate();

    usePageLogger('MetaTextPage', {
        watched: [
            ['metaTextsLoading', metaTextsLoading],
            ['metaTextsError', metaTextsError],
            ['metaTexts', metaTexts?.length],
            ['sourceDocsLoading', sourceDocsLoading],
            ['sourceDocsError', sourceDocsError],
            ['sourceDocs', sourceDocs?.length]
        ]
    });

    // Log when the page loads
    React.useEffect(() => {
        log.info('MetaTextPage mounted');
        return () => log.info('MetaTextPage unmounted');
    }, []);

    // Log when meta texts are loaded or error occurs
    React.useEffect(() => {
        if (metaTextsLoading) log.info('Loading meta texts...');
        if (metaTextsError) log.error('Error loading meta texts:', metaTextsError);
        if (!metaTextsLoading && metaTexts && metaTexts.length > 0) log.info(`Loaded ${metaTexts.length} meta texts`);
    }, [metaTextsLoading, metaTextsError, metaTexts]);

    // Log when source docs are loaded or error occurs
    React.useEffect(() => {
        if (sourceDocsLoading) log.info('Loading source documents for MetaTextPage...');
        if (sourceDocsError) log.error('Error loading source documents:', sourceDocsError);
        if (!sourceDocsLoading && sourceDocs && sourceDocs.length > 0) log.info(`Loaded ${sourceDocs.length} source documents for MetaTextPage`);
    }, [sourceDocsLoading, sourceDocsError, sourceDocs]);

    // Memoized handler for navigating to a meta text
    const handleMetaTextClick = React.useCallback((id: number) => {
        log.info(`Navigating to meta text with id: ${id}`);
        navigate(`/metaText/${id}`);
    }, [navigate]);

    // Memoized delete handler
    const handleDeleteClick = React.useCallback((id: number, e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        deleteMetaText(id)
            .then(() => refresh())
            .catch(err => log.error('Delete failed', err));
    }, [refresh]);

    return (
        <PageContainer>
            <MetaTextCreateForm
                sourceDocs={sourceDocs}
                sourceDocsLoading={sourceDocsLoading}
                sourceDocsError={sourceDocsError}
                onCreateSuccess={refresh}
            />
            <ErrorBoundary>
                <LoadingBoundary loading={metaTextsLoading}>
                    <SearchableList
                        items={metaTexts}
                        onItemClick={handleMetaTextClick}
                        onDeleteClick={handleDeleteClick}
                        filterKey="title"
                    />
                </LoadingBoundary>
            </ErrorBoundary>
        </PageContainer>
    );
}
