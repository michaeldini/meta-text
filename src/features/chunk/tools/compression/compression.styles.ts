import { Theme } from '@mui/material/styles';

export const getCompressionTabStyles = (theme: Theme) => ({
    compressionSelectInline: {
        minWidth: 80,
        maxWidth: 160,
        height: 40,
        '& .MuiInputBase-root': {
            height: 40,
            minHeight: 40,
            fontSize: theme.typography.body2.fontSize,
            paddingRight: theme.spacing(2),
        },
        '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(1, 2, 1, 1),
        },
        '& .MuiInputLabel-root': {
            fontSize: theme.typography.body2.fontSize,
        },

    },
    compressedWords: {
        flexWrap: 'wrap' as const,
        display: 'flex',


    },
});
