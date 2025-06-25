import type { Theme } from '@mui/material/styles';
import type { TypographyVariant } from '@mui/material';

// Styles for SourceDocInfo component
export const sourceDocContainerStyle = (theme: Theme) => ({
    p: theme.spacing(2),
});
export const slotPropsStyles = {
    primaryTitle: {
        variant: 'h5' as TypographyVariant,
        sx: { fontWeight: 600, py: 0, my: 0 },
    },
    primaryListItem: {
        variant: 'h6' as TypographyVariant,
        color: 'secondary',
        fontWeight: 600,
    },
    primaryListItemText: {
        variant: 'h6' as TypographyVariant,
        sx: { lineHeight: 1.0 },
    },
    primaryCollapsibleText: {
        variant: 'body1' as TypographyVariant,
    },
};
