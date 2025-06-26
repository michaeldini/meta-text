/**
 * Theme-aware styling utilities for chunks components
 * Phase 2 & 3 implementation: Remove hard-coded values and use theme-aware utilities
 */

import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

/**
 * Returns all theme-aware styles for Chunks components
 */
export const getChunksStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        height: '100%',
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        outline: 'none',
        boxShadow: 'none',
        '&:focus': {
            outline: 'none',
            boxShadow: 'none',
        },
        flex: 1,
        minHeight: 0,
    },

    chunkImageBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 240,
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
    },
    chunkImageLoadingOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal - 1,
        backdropFilter: 'blur(2px)',
    },
    chunkLightboxModal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(4),
        backgroundColor: alpha(theme.palette.common.black, 0.8),
    },
    chunkLightboxImgBox: {
        maxWidth: '90vw',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        boxShadow: theme.shadows[24],
    },
    chunkLightboxPromptBox: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: '600px',
    },
    chunkImageBtnBox: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-end',
        gap: theme.spacing(1),
    },
});
