// all styles related to chunk tools

import { Theme } from '@mui/material/styles';
export const getToolsStyles = (theme: Theme) => ({
    // styles for each tool section
    toolTabContainer: {
        p: 1,
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: "30vw",
        borderLeft: `4px solid ${theme.palette.secondary.main}`,
        flex: 1,

    },
});
