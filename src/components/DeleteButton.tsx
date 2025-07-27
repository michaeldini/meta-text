import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { HiOutlineTrash } from "react-icons/hi2";

import { useTheme } from '@mui/material/styles';

export interface DeleteButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    label?: string;
    icon?: React.ReactNode;
}

export function DeleteButton(props: DeleteButtonProps): React.ReactElement {
    const { onClick, disabled, label = "Delete", icon } = props;
    const theme = useTheme();
    return (
        <Tooltip content={label} >
            <span>
                <IconButton
                    data-testid="delete-button"
                    onClick={onClick}
                    disabled={disabled}
                    color="primary"
                    aria-label={label}
                    variant="ghost"
                >
                    {icon || <HiOutlineTrash />}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default DeleteButton;
