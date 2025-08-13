/**
 * Icon component wrapper.
 * - Resolves semantic icon name via registry.
 * - Standardizes size & accessibility handling.
 */
import React from 'react';
import { icons, type IconName } from './registry';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    name: IconName;
    /**
     * Numeric pixel size, CSS length (e.g. '1em', '24px'), or semantic token
     * (xs, sm, md, lg, xl, 2xl, 3xl). Tokens map to pixel values below.
     */
    size?: number | string;
    title?: string;
}

// Minimal vendor icon type
type VendorIconComponent = (props: { size?: number | string } & React.SVGProps<SVGSVGElement>) => React.ReactElement;

// Map semantic size tokens to pixel values (kept small & opinionated)
const SIZE_TOKENS: Record<string, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
};

function normalizeSize(raw: IconProps['size']): number | string {
    if (raw == null) return 20; // default
    if (typeof raw === 'number') return raw;
    const token = raw.trim();
    // CSS length pattern (allow decimal); let react-icons pass it through
    if (/^\d+(?:\.\d+)?(px|rem|em|%)$/.test(token)) return token;
    if (SIZE_TOKENS[token]) return SIZE_TOKENS[token];
    // Fallback: attempt to parse numeric string
    const asNum = Number(token);
    return Number.isFinite(asNum) ? asNum : 20;
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
    const Cmp = icons[name] as unknown as VendorIconComponent;
    const ariaProps = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };
    const normalized = normalizeSize(size);
    return (
        <Cmp size={normalized} {...ariaProps} {...rest}>
            {title ? <title>{title}</title> : null}
        </Cmp>
    );
}
