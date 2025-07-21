import { Typography, IconButton, Tooltip, Box } from '@mui/material';
import type { ReactElement } from 'react';
import { ArrowBackIcon } from 'icons';
import { getMetatextReviewStyles } from '../Metatext.styles';

interface HeaderProps {
    metatextId?: number;
    navigate: (path: string) => void;
    styles: ReturnType<typeof getMetatextReviewStyles>;
}

/**
 * Header component for the Metatext Review page.
 * Displays a back button to navigate to the Metatext Detail page and the title "Review".
 *
 * @returns {ReactElement} The rendered Header component.
 */
export function Header({ metatextId, navigate, styles }: HeaderProps): ReactElement {
    return (
        <Box sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to Metatext Detail">
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
