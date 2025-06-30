import React, { useState } from 'react';
import { Box, useTheme, Alert, Fade } from '@mui/material';

import { generateSourceDocInfo } from 'services';
import { Chunks } from 'features';
import { PageContainer } from 'components';

import MetaTextHeader from './MetaTextHeader';
import { getErrorMessage } from '../../../types/error';
import { getMetaTextContentStyles } from './MetaText.styles';

interface MetaTextContentProps {
    metaTextId: string;
    displayTitle: string;
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
    onReviewClick: () => void;
    messages: {
        META_TEXT_TITLE: string;
        REVIEW_BUTTON: string;
    };
    onHeaderRefresh?: () => void; // Optional prop to trigger header/content refresh
}

export const MetaTextContent: React.FC<MetaTextContentProps> = ({
    metaTextId,
    displayTitle,
    sourceDocSection,
    onReviewClick,
    messages,
    onHeaderRefresh,
}) => {
    const theme = useTheme();
    const styles = getMetaTextContentStyles(theme);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDownloadInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const prompt = sourceDocSection?.doc.text || '';
            if (!sourceDocSection?.doc.id || !prompt) {
                throw new Error('Document ID or text is missing.');
            }
            await generateSourceDocInfo({ id: sourceDocSection.doc.id, prompt });
            if (sourceDocSection.onInfoUpdate) sourceDocSection.onInfoUpdate();
            if (onHeaderRefresh) onHeaderRefresh(); // Trigger full header/content refresh if provided
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to generate info'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <Box sx={styles.container}>
                <MetaTextHeader
                    displayTitle={displayTitle}
                    sourceDocSection={sourceDocSection}
                    onReviewClick={onReviewClick}
                    messages={messages}
                    handleDownloadInfo={handleDownloadInfo}
                    loading={loading}
                />
                <Chunks metaTextId={metaTextId} />
                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            </Box>
        </PageContainer >
    );
};
