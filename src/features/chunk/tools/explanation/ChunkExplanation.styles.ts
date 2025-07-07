// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
export const getExplanationStyles = (theme: Theme) => ({

    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        // minWidth: 400,
        borderLeft: `4px solid ${theme.palette.secondary.main}`,

    },
    explanationTextContainer: {
        p: 2,
        // borderRadius: 1,
        boxShadow: theme.shadows[1],
        minWidth: 400,
        minHeight: 100,
        maxHeight: 300,
        overflowY: 'auto',
        width: '100%',
    }
});