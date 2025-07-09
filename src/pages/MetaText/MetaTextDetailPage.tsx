import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer, ReviewButton } from 'components';
import { ChunkToolButtons, SourceDocInfo } from 'features';
import { PaginatedChunks } from 'features';
import { useMetaTextDetailData } from './useMetaTextDetailData';

import { getMetaTextDetailStyles } from './MetaText.styles';
import {
    GenerateSourceDocInfoButton,
    StyleControls,
    DocumentHeader,
} from 'components';

function MetaTextDetailPage(): ReactElement | null {
    const { metaTextId } = useParams<{ metaTextId: string }>();

    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    const theme: Theme = useTheme();
    const styles = getMetaTextDetailStyles(theme);
    const { metaText, loading } = useMetaTextDetailData(metaTextId);

    return (
        <PageContainer loading={loading} data-testid="metatext-detail-page">
            {metaText ? (
                <Slide in={true} direction="up" timeout={500}>
                    <Box
                        sx={styles.container}
                        data-testid="metatext-detail-content"
                    >
                        <DocumentHeader title={metaText.title}>
                            <ReviewButton metaTextId={metaText.id} />
                            <GenerateSourceDocInfoButton
                                sourceDocumentId={metaText.source_document_id}
                            />
                            <StyleControls />
                            <SourceDocInfo
                                sourceDocumentId={metaText.source_document_id}
                            />
                        </DocumentHeader>

                        <PaginatedChunks metaTextId={metaText.id} />

                        <ChunkToolButtons />
                    </Box>
                </Slide>
            ) : null}
        </PageContainer>
    );
}

export { MetaTextDetailPage };
export default MetaTextDetailPage;
