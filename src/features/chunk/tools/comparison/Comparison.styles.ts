// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
import { CHUNK_WORDS_MIN_WIDTH, CHUNK_TABS_MIN_WIDTH, CHUNK_TABS_MAX_WIDTH } from '../../../../constants/ui';
export const getToolsStyles = (theme: Theme) => ({

    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 400
    },
});