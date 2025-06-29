import { Theme } from '@mui/material/styles';
import { CHUNK_TABS_MAX_WIDTH, CHUNK_TABS_MIN_WIDTH } from 'constants';
import { grey, blue, blueGrey, deepPurple, cyan, indigo, yellow } from '@mui/material/colors';

export const getCompressionTabStyles = (theme: Theme) => ({
    root: {
        p: theme.spacing(1),
        width: '100%',
        border: '1px solid',
        borderColor: yellow[300],
        // backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: theme.shape.borderRadiusSm,
        minWidth: CHUNK_TABS_MIN_WIDTH,
        maxWidth: CHUNK_TABS_MAX_WIDTH
    },
    select: {
        '& .MuiInputBase-root': {
            height: 40,
            minHeight: 40,
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
    form: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(2),
        width: '100%',
        minWidth: 200,
        maxWidth: 400,

        // marginBottom: theme.spacing(2),
    },
    compressedWords: {
        flexWrap: 'wrap' as const,
        display: 'flex',
        p: theme.spacing(2),
        borderRadius: theme.shape.borderRadiusSm,
        boxShadow: theme.shadows[1],
        minHeight: 100,
        maxHeight: 300,
        overflowY: 'auto',
        width: '100%',

    }
});
