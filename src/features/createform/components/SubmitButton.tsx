import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';
import { FORM_STYLES } from '../constants';

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
    const buttonStyles = {
        mt: FORM_STYLES.SUBMIT_BUTTON_SPACING
    };

    const spinnerStyles = {
        color: 'inherit',
        mr: 1,
        size: FORM_STYLES.LOADING_SPINNER_SIZE
    };

    return (
        <Button
            type="submit"
            variant="contained"
            disabled={loading || disabled}
            sx={buttonStyles}
            aria-busy={loading}
            {...props}
        >
            {loading ? <CircularProgress sx={spinnerStyles} /> : null}
            {loading ? (typeof children === 'string' ? `Loading...` : children) : children}
        </Button>
    );
});

export default SubmitButton;
