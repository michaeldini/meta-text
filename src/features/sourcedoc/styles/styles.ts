import type { TypographyVariant } from '@mui/material';

// Styles for SourceDocInfo component
export const sourceDocContainerStyle = {
    p: 4,
};
export const slotPropsStyles = {
    primaryTitle: {
        variant: 'h6' as TypographyVariant,
        sx: { fontWeight: 600, py: 0, my: 0 },
    },
    primaryListItem: {
        variant: 'caption' as TypographyVariant,
        color: 'secondary',
        fontWeight: 600,
    },
    primaryListItemText: {
        variant: 'caption' as TypographyVariant,
        sx: { lineHeight: 1.0 },
    },
    primaryCollapsibleText: {
        variant: 'body1' as TypographyVariant,
    },
};
