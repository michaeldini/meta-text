import React, { useState } from 'react';
import { Typography, Button, Box, useTheme, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import SourceDocInfo from '../../../features/sourcedoc/components/SourceDocInfo';
import Chunks from '../../../features/chunks';
import PageContainer from '../../../components/PageContainer';
import AiGenerationButton from '../../../components/AiGenerationButton';
import { useChunkStore } from '../../../store/chunkStore';
import { getMetaTextContentStyles, getFloatingToolbarPadding } from './MetaTextContent.styles';
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

const HeaderLeftColumn: React.FC<{
    displayTitle: string;
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
    onReviewClick: () => void;
    messages: {
        REVIEW_BUTTON: string;
    };
    handleDownloadInfo: () => Promise<void>;
    loading: boolean;
}> = ({ displayTitle, sourceDocSection, onReviewClick, messages, handleDownloadInfo, loading }) => {
    const theme = useTheme();
    const styles = getMetaTextContentStyles(theme);

    return (
        <Box sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'start', gap: theme.spacing(2) }}>
            <Typography variant="h1" sx={styles.title}>{displayTitle}</Typography>
            <Typography variant="subtitle1">Source Doc: {sourceDocSection ? `${sourceDocSection.doc.title}` : ''}</Typography>
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
    );
};

const HeaderRightColumn: React.FC<{
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
}> = ({ sourceDocSection }) => {
    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
            {sourceDocSection && (
                <SourceDocInfo
                    doc={sourceDocSection.doc}
                    onInfoUpdate={sourceDocSection.onInfoUpdate}
                />
            )}
        </Box>
    );
};

const HeaderSection: React.FC<{
    displayTitle: string;
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
    onReviewClick: () => void;
    messages: {
        REVIEW_BUTTON: string;
    };
    handleDownloadInfo: () => Promise<void>;
    loading: boolean;
}> = ({ displayTitle, sourceDocSection, onReviewClick, messages, handleDownloadInfo, loading }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: theme.spacing(10), width: '100%', p: theme.spacing(2) }}>
            <HeaderLeftColumn
                displayTitle={displayTitle}
                sourceDocSection={sourceDocSection}
                onReviewClick={onReviewClick}
                messages={messages}
                handleDownloadInfo={handleDownloadInfo}
                loading={loading}
            />
            <HeaderRightColumn sourceDocSection={sourceDocSection} />
        </Box>
    );
};

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
            <Box sx={{ ...contentStyles, ...styles.container }}>
                <HeaderSection
                    displayTitle={displayTitle}
                    sourceDocSection={sourceDocSection}
                    onReviewClick={onReviewClick}
                    messages={messages}
                    handleDownloadInfo={handleDownloadInfo}
                    loading={loading}
                />

                {/* Remaining Content */}
                <Chunks metaTextId={metaTextId} />

                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
            </Box>
        </PageContainer>
    );
};
