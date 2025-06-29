import { Theme } from '@mui/material/styles';


export const getChunkToolsStyles = (theme: Theme) => ({

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
