import React from 'react';
import { Typography, Paper, useTheme } from '@mui/material';

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
        <FlexBox alignItems="center" sx={styles.headerContainer}>
            <Paper elevation={10} sx={styles.headerPaper}>
                <Typography variant="subtitle1" color={theme.palette.text.secondary}>Editing meta-text</Typography>
                <Typography variant="h5" sx={{ mx: 1 }}>{metaText.title}</Typography>
            </Paper>
            <FlexBox flexDirection="row" >
                <ReviewButton metaTextId={metaText.id} />
                <GenerateSourceDocInfoButton
                    sourceDocumentId={metaText.source_document_id}
                    prompt={metaText.title}
                />
                <TextSizeInput />
                <LineHeightInput />
                <FontFamilySelect />
            </FlexBox>
            <SourceDocInfo
                sourceDocumentId={metaText.source_document_id}
            />
        </FlexBox >
    );
};

export default MetaTextHeader;
