import React, { useState } from 'react';
import { Box, useTheme, Alert } from '@mui/material';

import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';
import { getMetaTextContentStyles } from './MetaText.styles';
import { generateSourceDocInfo } from '../../../services/sourceDocInfoService';
import { getErrorMessage } from '../../../types/error';
import MetaTextHeader from './MetaTextHeader';

interface MetaTextContentProps {
    metaTextId: string;
    displayTitle: string;
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
    onReviewClick: () => void;
    messages: {
        META_TEXT_TITLE: string;
        REVIEW_BUTTON: string;
    };
}

export const MetaTextContent: React.FC<MetaTextContentProps> = ({
    metaTextId,
    displayTitle,
    sourceDocSection,
    onReviewClick,
    messages,
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
        </PageContainer>
    );
};
