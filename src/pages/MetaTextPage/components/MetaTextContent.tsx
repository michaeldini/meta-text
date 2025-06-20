import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import SourceDocInfo from '../../../features/info/components/SourceDocInfo';
import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';

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
}) => (
    <PageContainer>
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
    </PageContainer>
);
