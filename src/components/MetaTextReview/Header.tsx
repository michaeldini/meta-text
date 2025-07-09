/**
 * @fileoverview Header component for MetaText Review
 * 
 * The page header component that displays the review page title and optional
 * back navigation button. Provides consistent navigation and branding.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { Typography, IconButton, Tooltip } from '@mui/material';
import type { ReactElement } from 'react';
import { ArrowBackIcon } from 'icons';
import { FlexBox } from 'components';
import { getMetaTextReviewStyles } from '../../pages/MetaTextPage/MetaText.styles';

/**
 * Header Component Props
 */
interface HeaderProps {
    /** Optional MetaText ID for navigation context */
    metatextId?: number;
    /** React Router navigation function */
    navigate: (path: string) => void;
    /** Computed styles object from getMetaTextReviewStyles */
    styles: ReturnType<typeof getMetaTextReviewStyles>;
}

/**
 * Header Component
 * 
 * The page header component that displays the review page title and optional
 * back navigation button. Provides consistent navigation and branding.
 * 
 * @param props - Component props
 * @param props.metatextId - Optional MetaText ID for navigation context
 * @param props.navigate - React Router navigation function
 * @param props.styles - Computed styles object from getMetaTextReviewStyles
 * @returns {ReactElement} The header component
 * 
 * @example
 * ```tsx
 * <Header 
 *   metatextId={123}
 *   navigate={navigate}
 *   styles={styles}
 * />
 * ```
 */
export function Header({ metatextId, navigate, styles }: HeaderProps): ReactElement {
    return (
        <FlexBox sx={styles.header}>
            {metatextId && (
                <Tooltip title="Back to MetaText Detail">
                    <IconButton onClick={() => navigate(`/metaText/${metatextId}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
            )}
            <Typography variant="h4" gutterBottom sx={metatextId ? styles.title : undefined}>
                Review
            </Typography>
        </FlexBox>
    );
}
