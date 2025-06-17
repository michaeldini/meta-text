import React from 'react';
import { Button, CircularProgress, ButtonProps } from '@mui/material';

interface SubmitButtonProps extends ButtonProps {
    loading: boolean;
    children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, children, disabled, ...props }) => (
    <Button
        type="submit"
        variant="contained"
        disabled={loading || disabled}
        sx={{ mt: 2 }}
        {...props}
    >
        {loading ? <CircularProgress size={20} sx={{ color: 'inherit', mr: 1 }} /> : null}
        {loading ? (typeof children === 'string' ? `Loading...` : children) : children}
    </Button>
);

export default SubmitButton;
