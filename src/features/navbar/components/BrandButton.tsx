import React from 'react';
import { Button, Typography } from '@mui/material';

interface BrandButtonProps {
    brandNavItem: { label: string };
    styles: any;
    handleClick: () => void;
}

const BrandButton: React.FC<BrandButtonProps> = ({ brandNavItem, styles, handleClick }) => (
    <Button
        sx={styles.brandButton}
        onClick={handleClick}
        aria-label={`Go to homepage - ${brandNavItem?.label}`}
        data-testid="nav-brand-button"
    >
        <Typography
            component="span"
            variant="h6"
            noWrap
            sx={styles.brandTypography}
            data-testid="nav-brand"
        >
            {brandNavItem.label}
        </Typography>
    </Button>
);

export default BrandButton;
