// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
import { CHUNK_WORDS_MIN_WIDTH, CHUNK_TABS_MIN_WIDTH, CHUNK_TABS_MAX_WIDTH } from '../../../../constants/ui';
export const getExplanationStyles = (theme: Theme) => ({

    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 400
    },
    explanationTextContainer: {
        p: 2,
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
        color: theme.palette.text.disabled,
        minHeight: 100,
        maxHeight: 300,
        overflowY: 'auto',
        width: '100%',
        minWidth: CHUNK_TABS_MIN_WIDTH,
        maxWidth: CHUNK_TABS_MAX_WIDTH
    }
});