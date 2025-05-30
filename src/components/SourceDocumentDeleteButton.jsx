import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SourceDocumentDeleteButton({ onClick, disabled, label = "Delete Source Document" }) {
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
                    <DeleteIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
}
