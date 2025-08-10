/**
 * Icon component wrapper.
 * - Resolves semantic icon name via registry.
 * - Standardizes size & accessibility handling.
 */
import React from 'react';
import { icons, type IconName } from './registry';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    name: IconName;
    size?: number | string;
    title?: string;
}

// Minimal vendor icon type
type VendorIconComponent = (props: { size?: number | string } & React.SVGProps<SVGSVGElement>) => React.ReactElement;

export const Icon: React.FC<IconProps> = ({ name, size = 20, title, ...rest }) => {
    const Cmp = icons[name] as unknown as VendorIconComponent;
    const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };
    return (
        <Cmp size={size} {...ariaProps} {...rest}>
            {title ? <title>{title}</title> : null}
        </Cmp>
    );
};
