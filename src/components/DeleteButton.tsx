import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DeleteIcon } from './icons';
import { useTheme } from '@mui/material/styles';
export interface DeleteButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    label?: string;
    icon?: React.ReactNode;
}

export default function DeleteButton({ onClick, disabled, label = "Delete", icon }: DeleteButtonProps) {
    const theme = useTheme();
    return (
        <Tooltip title={label} placement="top">
            <span>
                <IconButton
                    // sx={{ color: theme.palette.text.primary, opacity: .5 }}
                    data-testid="delete-button"
                    onClick={onClick}
                    disabled={disabled}
                    color="primary"
                    aria-label={label}
                    size="large"
                >
                    {icon || <DeleteIcon />}
                </IconButton>
            </span>
        </Tooltip>
    );
}
