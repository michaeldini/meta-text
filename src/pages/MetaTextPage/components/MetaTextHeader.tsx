import React, { useState } from 'react';
import { Typography, Paper, useTheme } from '@mui/material';

import { SourceDocInfo } from 'features';
import { AiGenerationButton, ReviewButton, FlexBox } from 'components';
import { TextSizeInput } from 'components';
import FontFamilySelect from '../../../components/FontFamilySelect';
import LineHeightInput from '../../../components/LineHeightInput';

import { getMetaTextContentStyles } from './MetaText.styles';

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
        <FlexBox alignItems="center" sx={styles.headerContainer}>
            <Paper elevation={10} sx={styles.headerPaper}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>Editing the meta-text named</Typography>
                <Typography variant="h5" sx={{ mx: 1 }}>{displayTitle}</Typography>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>that was derived from</Typography>
                <Typography variant="h6" sx={{ mx: 1 }}>{sourceDocSection ? `${sourceDocSection.doc.title}` : ''}</Typography>
            </Paper>
            <FlexBox flexDirection="row" >
                <ReviewButton
                    label={messages.REVIEW_BUTTON}
                    toolTip="Review this meta-text"
                    onClick={onReviewClick}
                />
                <AiGenerationButton
                    label="Generate Info"
                    toolTip="Generate or update document info using AI"
                    onClick={handleDownloadAndRefresh}
                    loading={loading}
                />
                <TextSizeInput />
                <LineHeightInput />
                <FontFamilySelect />

            </FlexBox>
            {
                sourceDocSection && (
                    <SourceDocInfo
                        doc={sourceDocSection.doc}
                        key={infoRefreshKey}
                    />
                )
            }
        </FlexBox >
    );
};

export default MetaTextHeader;
