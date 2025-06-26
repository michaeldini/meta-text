import React from 'react';
import { useTheme } from '@mui/material/styles';

export interface ThemedIconProps {
    as: React.ElementType;
    style?: React.CSSProperties;
    [key: string]: any;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({ as: Icon, style, ...rest }) => {
    const theme = useTheme();
    const defaultStyle = theme.icons.default
    return <Icon style={{ ...defaultStyle, color: theme.palette.text.secondary, ...style }} {...rest} />;
};
