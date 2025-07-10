
import { Alert } from '@mui/material';
import type { ReactElement } from 'react';

interface ErrorAlertProps {
    message: string;
}
export function ErrorAlert({ message }: ErrorAlertProps): ReactElement {
    return <Alert severity="error">{message}</Alert>;
}
