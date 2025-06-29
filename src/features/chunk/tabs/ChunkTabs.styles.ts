// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
import { CHUNK_WORDS_MIN_WIDTH, CHUNK_TABS_MIN_WIDTH, CHUNK_TABS_MAX_WIDTH } from '../../../constants/ui';
export const getToolsStyles = (theme: Theme) => ({

    // sticky container for tools
    toolDisplayContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start',
        gap: theme.spacing(1),
        paddingLeft: theme.spacing(10),
        padding: theme.spacing(2),
        position: 'sticky' as const,
        top: theme.spacing(5),
        alignSelf: 'flex-start',
        width: '100%',
        maxWidth: CHUNK_TABS_MAX_WIDTH,
        zIndex: theme.zIndex.appBar,
        boxShadow: 'none',
        transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.short,
        }),
        '&:hover': {
            opacity: 1,
        },
        compressedWords: {
            flexWrap: 'wrap' as const,
        },
    },
});