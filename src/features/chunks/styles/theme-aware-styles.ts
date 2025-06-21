/**
 * Theme-aware styling utilities for chunks components
 * Phase 2 & 3 implementation: Remove hard-coded values and use theme-aware utilities
 */

import { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

// ============================================================================
// Chunks-specific theme-aware utilities
// ============================================================================

/**
 * Creates container styles that adapt to theme
 */
export const createChunksContainerStyles = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
});

/**
 * Creates main chunk box styles with theme awareness
 */
export const createChunkMainBoxStyles = (theme: Theme) => ({
    minWidth: '100%',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' } as const,
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        borderColor: theme.palette.secondary.main,
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows[4],
    },
});

/**
 * Creates text box styles for chunk content
 */
export const createChunkTextBoxStyles = (theme: Theme) => ({
    padding: theme.spacing(2),
    fontSize: theme.typography.h6.fontSize,
    lineHeight: 1.5,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
});

/**
 * Creates enhanced text field styles
 */
export const createChunkTextFieldStyles = (theme: Theme) => ({
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['box-shadow', 'transform'], {
        duration: theme.transitions.duration.short,
    }),
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
        },
        '&.Mui-focused': {
            boxShadow: theme.shadows[6],
            transform: 'scale(1.01)',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
    },
});

/**
 * Creates tool panel styles
 */
export const createToolStyles = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    minWidth: '400px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[2],
});

/**
 * Creates interactive word styles
 */
export const createChunkWordBoxStyles = (theme: Theme) => ({
    display: 'inline-block',
    borderRadius: theme.spacing(0.5),
    position: 'relative',
    cursor: 'pointer',
    padding: theme.spacing(0.25, 0.5),
    margin: theme.spacing(0.125),
    transition: theme.transitions.create(['background-color', 'color', 'transform'], {
        duration: theme.transitions.duration.shorter,
    }),
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        transform: 'scale(1.05)',
    },
    '&:focus': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        outline: `2px solid ${theme.palette.primary.light}`,
        outlineOffset: 2,
    },
});

/**
 * Creates container for words
 */
export const createWordsContainerStyles = (theme: Theme) => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: theme.spacing(0.5),
    padding: theme.spacing(1),
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
    borderRadius: theme.shape.borderRadius,
});

/**
 * Creates animated undo button styles
 */
export const createChunkUndoIconButtonStyles = (theme: Theme) => ({
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(['transform', 'color'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        transform: 'rotate(-45deg)',
        color: theme.palette.primary.main,
    },
    '&:focus': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
    },
});

/**
 * Creates image container styles
 */
export const createChunkImageBoxStyles = (theme: Theme) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 240,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
});

/**
 * Creates loading overlay styles
 */
export const createChunkImageLoadingOverlayStyles = (theme: Theme) => ({
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
});

/**
 * Creates lightbox modal styles
 */
export const createChunkLightboxModalStyles = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: alpha(theme.palette.common.black, 0.8),
});

/**
 * Creates lightbox image container styles
 */
export const createChunkLightboxImgBoxStyles = (theme: Theme) => ({
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
});

/**
 * Creates lightbox prompt box styles
 */
export const createChunkLightboxPromptBoxStyles = (theme: Theme) => ({
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    maxWidth: '600px',
});

/**
 * Creates button container styles
 */
export const createChunkImageBtnBoxStyles = (theme: Theme) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: theme.spacing(1),
});

// ============================================================================
// Composite style creators
// ============================================================================

/**
 * Creates a complete set of chunks styles
 */
export const createChunksStyles = (theme: Theme) => ({
    container: createChunksContainerStyles(theme),
    chunkMainBox: createChunkMainBoxStyles(theme),
    chunkTextBox: createChunkTextBoxStyles(theme),
    chunkTextField: createChunkTextFieldStyles(theme),
    toolStyles: createToolStyles(theme),
    chunkWordBox: createChunkWordBoxStyles(theme),
    wordsContainer: createWordsContainerStyles(theme),
    chunkUndoIconButton: createChunkUndoIconButtonStyles(theme),
    chunkImageBox: createChunkImageBoxStyles(theme),
    chunkImageLoadingOverlay: createChunkImageLoadingOverlayStyles(theme),
    chunkLightboxModal: createChunkLightboxModalStyles(theme),
    chunkLightboxImgBox: createChunkLightboxImgBoxStyles(theme),
    chunkLightboxPromptBox: createChunkLightboxPromptBoxStyles(theme),
    chunkImageBtnBox: createChunkImageBtnBoxStyles(theme),
});
