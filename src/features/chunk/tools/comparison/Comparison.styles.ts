import { Theme } from '@mui/material/styles';

export const getToolsStyles = (theme: Theme) => ({

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
    comparisonTextContainer: {
        p: 2,
        boxShadow: theme.shadows[1],
        minWidth: 400,
        minHeight: 100,
        maxHeight: 400,
        overflowY: 'auto',
        width: '100%',
    }
});