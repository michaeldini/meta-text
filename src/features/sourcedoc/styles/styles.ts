import type { Theme } from '@mui/material/styles';
import type { TypographyVariant } from '@mui/material';

export const getSourceDocumentStyles = (theme: Theme) => ({
    container: {
        width: '100%',
        paddingX: theme.spacing(2),
    },
});
