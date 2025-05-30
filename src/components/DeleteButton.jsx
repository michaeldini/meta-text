import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton({ onClick, disabled, label = "Delete", icon }) {
    return (
        <Tooltip title={label} placement="top">
            <span>
                <IconButton
                    onClick={onClick}
                    disabled={disabled}
                    color="error"
                    aria-label={label}
                    size="large"
                >
                    {icon || <DeleteIcon />}
                </IconButton>
            </span>
        </Tooltip>
    );
}
