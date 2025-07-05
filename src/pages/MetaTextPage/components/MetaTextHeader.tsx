import React from 'react';
import { Typography, Paper, useTheme, Box } from '@mui/material';

import { SourceDocInfo } from 'features';
import { ReviewButton, FlexBox, TextSizeInput, FontFamilySelect, LineHeightInput } from 'components';
import { GenerateSourceDocInfoButton } from 'components';

import { getMetaTextPageStyles } from '../MetaText.styles';
import type { MetaTextDetail } from 'types';

interface MetaTextHeaderProps {
    metaText: MetaTextDetail;
}

const MetaTextHeader: React.FC<MetaTextHeaderProps> = ({
    metaText
}) => {
    const theme = useTheme();
    const styles = getMetaTextPageStyles(theme);

    return (
        <Box sx={styles.headerContainer}>
            <Paper elevation={10} sx={styles.headerPaper}>
                <Box sx={styles.headerTitleBox}>
                    <Typography variant="subtitle1" color={theme.palette.text.secondary}>Editing meta-text</Typography>
                    <Typography variant="h5" sx={{ mx: 1, flex: 1 }}>{metaText.title}</Typography>
                </Box>

                <ReviewButton metaTextId={metaText.id} />
                <GenerateSourceDocInfoButton
                    sourceDocumentId={metaText.source_document_id}
                />
                <TextSizeInput />
                <LineHeightInput />
                <FontFamilySelect />
            </Paper>
            <SourceDocInfo
                sourceDocumentId={metaText.source_document_id}
            />
        </Box >
    );
};

export default MetaTextHeader;
