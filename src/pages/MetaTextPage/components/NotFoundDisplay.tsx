import React from 'react';
import { Typography } from '@mui/material';
import PageContainer from '../../../components/PageContainer';

interface NotFoundDisplayProps {
    metaTextId: string;
    messages: {
        NOT_FOUND_TITLE: string;
        NOT_FOUND_MESSAGE: string;
    };
}

/**
 * Component responsible for rendering "not found" state
 * Single responsibility: Display error state when MetaText is not found
 */
export const NotFoundDisplay: React.FC<NotFoundDisplayProps> = ({
    metaTextId,
    messages,
}) => (
    <PageContainer>
        <Typography variant="h6" role="alert">
            {messages.NOT_FOUND_TITLE}
        </Typography>
        <Typography variant="body2">
            {messages.NOT_FOUND_MESSAGE.replace('{id}', metaTextId)}
        </Typography>
    </PageContainer>
);
