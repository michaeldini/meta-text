/**
 * @fileoverview LoadingIndicator component for MetaText Review
 * 
 * A simple loading indicator component that displays a centered circular progress spinner.
 * Used to show loading state while data is being fetched in the MetaText Review page.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { Box, CircularProgress } from '@mui/material';
import type { ReactElement } from 'react';
import { getMetaTextReviewStyles } from '../../pages/MetaText/MetaText.styles';

/**
 * LoadingIndicator Component Props
 */
interface LoadingIndicatorProps {
    /** Computed styles object from getMetaTextReviewStyles */
    styles: ReturnType<typeof getMetaTextReviewStyles>;
}

/**
 * LoadingIndicator Component
 * 
 * A simple loading indicator component that displays a centered circular progress spinner.
 * Used to show loading state while data is being fetched.
 * 
 * @param props - Component props
 * @param props.styles - Computed styles object from getMetaTextReviewStyles
 * @returns {ReactElement} The loading indicator component
 * 
 * @example
 * ```tsx
 * const styles = getMetaTextReviewStyles(theme);
 * <LoadingIndicator styles={styles} />
 * ```
 */
export function LoadingIndicator({ styles }: LoadingIndicatorProps): ReactElement {
    return (
        <Box sx={styles.loadingBox}>
            <CircularProgress />
        </Box>
    );
}
