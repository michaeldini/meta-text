import React, { useState } from 'react';
import { Typography, Button, Paper, Box, useTheme, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SourceDocInfo from '../../../features/sourcedoc/components/SourceDocInfo';
import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';
import { useChunkStore } from '../../../store/chunkStore';
import { getMetaTextContentStyles, getFloatingToolbarPadding } from './MetaTextContent.styles';
import AiGenerationButton from '../../../components/AiGenerationButton';
import { generateSourceDocInfo } from '../../../services/sourceDocInfoService';
import { getErrorMessage } from '../../../types/error';

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

/**
 * Component responsible for rendering MetaText content
 * Single responsibility: Display MetaText data and related components
 */
export const MetaTextContent: React.FC<MetaTextContentProps> = ({
    metaTextId,
    displayTitle,
    sourceDocSection,
    onReviewClick,
    messages,
}) => {
    const theme = useTheme();
    const location = useLocation();
    const activeChunkId = useChunkStore(state => state.activeChunkId);
    const styles = getMetaTextContentStyles(theme);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check if we're on the MetaTextDetailPage and if the floating toolbar should be visible
    const isOnMetaTextDetailPage = /^\/metaText\/[^\/]+$/.test(location.pathname);
    const shouldShowFloatingToolbar = Boolean(activeChunkId) && isOnMetaTextDetailPage;


    const contentStyles = shouldShowFloatingToolbar ? getFloatingToolbarPadding(theme) : {};

    const handleDownloadInfo = async () => {
        setLoading(true);
        setError('');
        try {
            const prompt = sourceDocSection?.doc.text || '';
            if (!sourceDocSection?.doc.id || !prompt) {
                throw new Error('Document ID or text is missing.');
            }
            const response = await generateSourceDocInfo({ id: sourceDocSection.doc.id, prompt });
            if (sourceDocSection.onInfoUpdate) sourceDocSection.onInfoUpdate();
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Failed to generate info'));
        } finally {
            setLoading(false);
        }
    };


    return (
        <PageContainer>
            <Box sx={{
                ...contentStyles,
                ...styles.container,
            }}>
                {/* Header Section with Two Columns */}
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: theme.spacing(2), width: '100%' }}>
                    {/* Left Column: Title, Subtitle, Buttons */}
                    <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'start', gap: theme.spacing(2) }}>
                        <Typography
                            variant="h1"
                            sx={styles.title}
                        >
                            {displayTitle}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                        >
                            Source Doc: {sourceDocSection ? `${sourceDocSection.doc.title}` : ''}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={onReviewClick}
                            aria-label={`Review ${displayTitle}`}
                            sx={styles.reviewButton}
                        >
                            {messages.REVIEW_BUTTON}
                        </Button>
                        <AiGenerationButton
                            label="Generate Info"
                            toolTip="Generate or update document info using AI"
                            onClick={handleDownloadInfo}
                            loading={loading}
                        />
                    </Box>

                    {/* Right Column: Info Items */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        {sourceDocSection && (
                            <SourceDocInfo
                                doc={sourceDocSection.doc}
                                onInfoUpdate={sourceDocSection.onInfoUpdate}
                            />
                        )}
                    </Box>
                </Box>

                {/* Remaining Content */}
                <Chunks metaTextId={metaTextId} />

                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            </Box>
        </PageContainer>
    );
};
