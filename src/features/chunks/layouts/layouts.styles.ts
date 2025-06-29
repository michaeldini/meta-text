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

export const getLayoutsStyles = (theme: Theme) => ({
    wordActionDialogContainer: {
        padding: theme.spacing(1),
        display: 'flex',
        gap: theme.spacing(1),
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolsContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 2,
        padding: 0,
        margin: 0
    },
    toolButtonsContainer: {
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        marginTop: 1,
    },
    tooltipProps: {
        arrow: true,
        enterDelay: 200,
        placement: 'left' as const,
    },
});
