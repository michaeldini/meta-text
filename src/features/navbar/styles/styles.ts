
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

export const navBarTitle = {
    textTransform: 'uppercase' as const,
    fontWeight: 700,
    letterSpacing: 2,
};

export const menuButtonStyles = {
    textDecoration: 'none',
    color: 'inherit',
    marginLeft: 2,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
} as const;
