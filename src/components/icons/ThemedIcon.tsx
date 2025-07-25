import React from 'react';
import { useTheme } from '@mui/material/styles';

export interface ThemedIconProps {
    as: React.ElementType;
    style?: React.CSSProperties;
    [key: string]: any;
}

export function ThemedIcon({ as: Icon, style, ...rest }: ThemedIconProps): React.ReactElement {
    const defaultStyle = {
        width: 24,
        height: 24,
    };
    return <Icon style={{ ...defaultStyle, ...style }} {...rest} />;
}
