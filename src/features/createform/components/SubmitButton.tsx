import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

interface SubmitButtonProps extends ButtonProps {
    loading: boolean;
    children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = React.memo(({
    loading,
    children,
    disabled,
    ...props
}) => {

    return (
        <Button
            type="submit"
            variant="contained"
            disabled={loading || disabled}
            sx={{ mt: 2 }}
            aria-busy={loading}
            {...props}
        >
            {loading ? <CircularProgress /> : null}
            {loading ? (typeof children === 'string' ? `Loading...` : children) : children}
        </Button>
    );
});

export default SubmitButton;
