// src/styles/pageStyles.js

export const uploadFormContainer = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    p: 4,
    mb: 16,
    bgcolor: 'background.paper',
};

export const uploadFormInner = {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    gap: 2,
};

export const outerList = {
    margin: 4,
    bgcolor: 'background.paper',
    borderRadius: 2,
};

export const navBarAppBar = {
    bgcolor: 'background.paper',
    color: 'text.primary',
    zIndex: 1201,
};

export const navBarToolbar = {
    display: 'flex',
    justifyContent: 'right',
    minHeight: 64,
};

export const navBarButton = (active, ml = 0) => ({
    fontWeight: active ? 600 : 400,
    borderRadius: 2,
    textTransform: 'none',
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
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 2,
    color: 'primary.main',
    pl: 2,
};
