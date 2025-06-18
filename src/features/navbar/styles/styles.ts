
export const navBarAppBar = {
    marginBottom: 0,
    padding: 0,
};

export const navBarToolbar = {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    minHeight: 64,
};

// export const navBarButton = (active: boolean, ml = 0) => ({
//     fontWeight: active ? 600 : 400,
//     borderRadius: 2,
//     textTransform: 'none' as const,
//     px: 2,
//     boxShadow: active ? 2 : 0,
//     bgcolor: active ? 'primary.main' : 'transparent',
//     color: active ? 'background.paper' : 'text.primary',
//     '&:hover': {
//         bgcolor: active ? 'primary.dark' : 'action.hover',
//     },
//     ml,
// });

export const navBarTitle = {
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    letterSpacing: 2,
};
