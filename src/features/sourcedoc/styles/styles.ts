import type { Theme } from '@mui/material/styles';
import type { TypographyVariant } from '@mui/material';

export const getSourceDocumentStyles = (theme: Theme) => ({
    container: {
        p: theme.spacing(2),
    },
    slotProps: {
        primaryTitle: {
            variant: 'h5' as TypographyVariant,
            sx: { fontWeight: 600, py: 0, my: 0 },
        },
        primaryListItem: {
            variant: 'h6' as TypographyVariant,
            color: theme.palette.secondary.main,
            fontWeight: 600,
        },
        primaryListItemText: {
            variant: 'h6' as TypographyVariant,
            sx: { lineHeight: 1.0 },
        },
        primaryCollapsibleText: {
            variant: 'body1' as TypographyVariant,
        },
    },
});
