import { Typography, IconButton, Tooltip, Box } from '@mui/material';
import type { ReactElement } from 'react';
import { ArrowBackIcon } from 'icons';
import { getMetaTextReviewStyles } from '../MetaText.styles';

interface HeaderProps {
    metatextId?: number;
    navigate: (path: string) => void;
    styles: ReturnType<typeof getMetaTextReviewStyles>;
}

export function Header({ metatextId, navigate, styles }: HeaderProps): ReactElement {
    return (
        <Box sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to MetaText Detail">
                    <IconButton onClick={() => navigate(`/metatext/${metatextId}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Typography variant="h4" gutterBottom sx={metatextId ? styles.title : undefined}>
                Review
            </Typography>
        </Box>
    );
}
