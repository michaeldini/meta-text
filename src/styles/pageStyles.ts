// src/styles/pageStyles.ts

export const uploadFormContainer = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    p: 4,
    mb: 8,
    bgcolor: 'background.paper',
};

export const uploadFormInner = {
    width: '75%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'start' as const,
    gap: 2,
};

export const navBarAppBar = {
    bgcolor: 'background.paper',
    color: 'text.primary',
    zIndex: 1201,
};

export const navBarToolbar = {
    display: 'flex',
    justifyContent: 'right' as const,
    minHeight: 64,
};

export const navBarButton = (active: boolean, ml = 0) => ({
    fontWeight: active ? 600 : 400,
    borderRadius: 2,
    textTransform: 'none' as const,
    px: 2,
    boxShadow: active ? 2 : 0,
    bgcolor: active ? 'primary.main' : 'transparent',
    color: active ? 'background.paper' : 'text.primary',
    '&:hover': {
        bgcolor: active ? 'primary.dark' : 'action.hover',
    },
    ml,
});

export const navBarTitle = {
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    letterSpacing: 2,
    color: 'primary.main',
    pl: 2,
};

export const sourceDocDetailContainer = {
    maxWidth: '90vw',
    mx: 'auto',
    mt: 4,
};
