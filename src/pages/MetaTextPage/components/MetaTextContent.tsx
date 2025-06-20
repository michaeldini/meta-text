import React from 'react';
import { Typography, Button, Paper, Box, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SourceDocInfo from '../../../features/info/components/SourceDocInfo';
import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';
import { useChunkStore } from '../../../store/chunkStore';

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

    // Check if we're on the MetaTextDetailPage and if the floating toolbar should be visible
    const isOnMetaTextDetailPage = /^\/metaText\/[^\/]+$/.test(location.pathname);
    const shouldShowFloatingToolbar = Boolean(activeChunkId) && isOnMetaTextDetailPage;

    // Add right padding to prevent overlap with floating toolbar
    const contentStyles = shouldShowFloatingToolbar ? {
        paddingRight: {
            xs: theme.spacing(12), // Space for floating toolbar on mobile (96px)
            sm: theme.spacing(16), // Space for floating toolbar on desktop (128px)
        }
    } : {};

    return (
        <PageContainer>
            <Box sx={contentStyles}>
                <Paper elevation={3}>
                    <Typography variant="body1">
                        {messages.META_TEXT_TITLE} {displayTitle}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={onReviewClick}
                        aria-label={`Review ${displayTitle}`}
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
