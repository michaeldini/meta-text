import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

export interface DeleteButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    label?: string;
    icon?: React.ReactNode;
}

export default function DeleteButton({ onClick, disabled, label = "Delete", icon }: DeleteButtonProps) {
    return (
        <Tooltip title={label} placement="top">
            <span>
                <IconButton
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
