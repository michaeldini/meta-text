import { Theme } from '@mui/material/styles';

export const uploadFormInner = (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'start' as const,
    gap: theme.spacing(2),
});

// Screen reader only styles
export const srOnly = (theme: Theme) => ({
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden' as const,
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: `1px solid ${theme.palette.divider}`,
});