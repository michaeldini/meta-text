
import { Theme } from '@mui/material/styles';

/**
 * Navigation bar styles with consistent naming and optimized performance
 */

export const appBarStyles = (theme: Theme) => ({
    marginBottom: 0,
    padding: 0,
    backgroundColor: theme.palette.primary.main,
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.appBar,
});

export const toolbarStyles = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: {
        xs: 56, // Mobile
        sm: 64, // Desktop
    },
    paddingX: {
        xs: theme.spacing(1),
        sm: theme.spacing(2),
    },
    gap: theme.spacing(1),
});

export const brandTitleStyles = (theme: Theme) => ({
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    letterSpacing: 2,
    color: theme.palette.primary.contrastText,
    fontSize: {
        xs: '1rem',
        sm: '1.25rem',
    },
    cursor: 'pointer',
    transition: theme.transitions.create(['opacity'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        opacity: 0.8,
    },
});

export const menuTriggerButtonStyles = (theme: Theme) => ({
    textDecoration: 'none',
    color: 'inherit',
    marginLeft: theme.spacing(1),
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    transition: theme.transitions.create(['background-color'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        outline: `2px solid ${theme.palette.primary.contrastText}`,
        outlineOffset: 2,
    },
    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
});

export const dropdownMenuStyles = (theme: Theme) => ({
    '& .MuiPaper-root': {
        marginTop: theme.spacing(1),
        minWidth: 120,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[8],
        border: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiList-root': {
        padding: theme.spacing(0.5),
    },
});

export const menuItemStyles = (theme: Theme) => ({
    fontSize: theme.typography.body2.fontSize,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.25, 0),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
        '&:hover': {
            backgroundColor: theme.palette.action.selected,
        },
    },
    '&.Mui-disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
});

export const toolbarSectionStyles = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
});

export const menuItemIconStyles = (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary,
    '& > *': {
        fontSize: '1.25rem',
    },
});

export const menuItemBadgeStyles = (theme: Theme) => ({
    '& .MuiBadge-badge': {
        fontSize: '0.75rem',
        height: 16,
        minWidth: 16,
        padding: theme.spacing(0, 0.5),
    },
});

// Backward compatibility exports (deprecated - use new names)
/** @deprecated Use appBarStyles instead */
export const navBarAppBar = appBarStyles;
/** @deprecated Use toolbarStyles instead */
export const navBarToolbar = toolbarStyles;
/** @deprecated Use brandTitleStyles instead */
export const navBarTitle = brandTitleStyles;
/** @deprecated Use menuTriggerButtonStyles instead */
export const menuButtonStyles = menuTriggerButtonStyles;
/** @deprecated Use dropdownMenuStyles instead */
export const menuStyles = dropdownMenuStyles;
