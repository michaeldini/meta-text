import React, { useState } from 'react';
import { IconButton, Popover, Typography } from '@mui/material';

interface InfoPopoverButtonProps {
    icon: React.ReactElement;
    popoverId: string;
    title: string;
    content: string;
    typographyVariant?: 'body1' | 'body2';
}

const InfoPopoverButton: React.FC<InfoPopoverButtonProps> = ({
    icon,
    popoverId,
    title,
    content,
    typographyVariant = 'body2',
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton
                size="small"
                color="secondary"
                aria-owns={open ? popoverId : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                {icon}
            </IconButton>
            <Popover
                id={popoverId}
                sx={{ pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography sx={{ p: 1 }} variant="subtitle2" gutterBottom>{title}</Typography>
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }} variant={typographyVariant}>{content}</Typography>
            </Popover>
        </>
    );
};

export default InfoPopoverButton;
