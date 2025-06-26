import React, { useState } from 'react';
import { Typography, Button, Box, useTheme } from '@mui/material';
import SourceDocInfo from '../../../features/sourcedoc/components/SourceDocInfo';
import AiGenerationButton from '../../../components/AiGenerationButton';
import { getMetaTextContentStyles } from './MetaText.styles';
import FlexBox from '../../../components/FlexBox';

interface MetaTextHeaderProps {
    displayTitle: string;
    sourceDocSection: { doc: any; onInfoUpdate: () => void } | null;
    onReviewClick: () => void;
    messages: {
        REVIEW_BUTTON: string;
    };
    handleDownloadInfo: () => Promise<void>;
    loading: boolean;
}

const MetaTextHeader: React.FC<MetaTextHeaderProps> = ({
    displayTitle,
    sourceDocSection,
    onReviewClick,
    messages,
    handleDownloadInfo,
    loading,
}) => {
    const theme = useTheme();
    const styles = getMetaTextContentStyles(theme);
    // Add state to force SourceDocInfo remount
    const [infoRefreshKey, setInfoRefreshKey] = useState(0);

    // Wrap handleDownloadInfo to refresh SourceDocInfo after download
    const handleDownloadAndRefresh = async () => {
        await handleDownloadInfo();
        setInfoRefreshKey(k => k + 1);
    };

    return (
        <FlexBox alignItems="start" sx={{ ...styles.headerContainer, width: '100%' }}>
            <FlexBox alignItems="flex-end" flexDirection="row" sx={{ width: '100%' }}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>Editing the meta-text named</Typography>
                <Typography variant="h4" sx={{ mx: 1 }}>{displayTitle}</Typography>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>that was derived from</Typography>
                <Typography variant="h5" sx={{ mx: 1 }}>{sourceDocSection ? `${sourceDocSection.doc.title}` : ''}</Typography>
            </FlexBox>
            <FlexBox flexDirection="row" sx={{ width: '100%', mt: 2, gap: 2 }}>
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
                    onClick={handleDownloadAndRefresh}
                    loading={loading}
                />
            </FlexBox>
            {sourceDocSection && (
                <SourceDocInfo
                    doc={sourceDocSection.doc}
                    key={infoRefreshKey}
                />
            )}
        </FlexBox>
    );
};

export default MetaTextHeader;
