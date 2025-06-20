import React from 'react';
import { Typography, Button, Paper, Box, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SourceDocInfo from '../../../features/info/components/SourceDocInfo';
import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';
import { useChunkStore } from '../../../store/chunkStore';
import { getMetaTextContentStyles, getFloatingToolbarPadding } from './MetaTextContent.styles';

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

    // Check if we're on the MetaTextDetailPage and if the floating toolbar should be visible
    const isOnMetaTextDetailPage = /^\/metaText\/[^\/]+$/.test(location.pathname);
    const shouldShowFloatingToolbar = Boolean(activeChunkId) && isOnMetaTextDetailPage;

    // TEMPORARILY DISABLED: Add right padding to prevent overlap with floating toolbar
    const contentStyles = shouldShowFloatingToolbar ? getFloatingToolbarPadding(theme) : {};
    // const contentStyles = {}; // Remove this line and uncomment above if you want floating toolbar padding

    return (
        <PageContainer>
            <Box sx={{
                ...contentStyles,
                ...styles.container,
            }}>
                {/* Header section with title and review button, and source document info */}
                <Paper
                    elevation={2}
                    sx={styles.headerPaper}
                >
                    <Typography
                        variant="subtitle1"
                        sx={styles.title}
                    >
                        {messages.META_TEXT_TITLE} {displayTitle}
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
                </Paper>
                {sourceDocSection && (
                    <SourceDocInfo
                        doc={sourceDocSection.doc}
                        onInfoUpdate={sourceDocSection.onInfoUpdate}
                    />
                )}
                <Chunks metaTextId={metaTextId} />
            </Box>
        </PageContainer>
    );
};
