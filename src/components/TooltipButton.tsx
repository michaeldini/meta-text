import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { styled, tooltipContentStyles, tooltipArrowStyles, Button } from '@styles';

// Generic button with tooltip for consistent UI usage. Accepts label, icon, onClick, disabled.
export interface TooltipButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'> {
    label: string;
    icon?: React.ReactNode;
    tooltip?: string;
    disabled?: boolean;
    onClick?: (() => void) | ((event: React.MouseEvent<HTMLButtonElement>) => void);
    onKeyDown?: (event: React.KeyboardEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    color?: string;
    role?: string;
    // loose positioning object; we map common props to Radix Content props
    positioning?: { side?: 'top' | 'right' | 'bottom' | 'left'; sideOffset?: number; align?: 'start' | 'center' | 'end' } | any;
    tone?: 'default' | 'primary' | 'danger';
    loading?: boolean;
    iconSize?: string | number;
}

export function TooltipButton({
    label,
    tooltip,
    icon,
    disabled = false,
    onClick,
    onKeyDown,
    type = 'button',
    color = 'inherit',
    tone = 'default',
    role = 'button',
    positioning = { side: 'left', align: 'end', sideOffset: 6 },
    loading = false,
    iconSize,
    ...rest
}: TooltipButtonProps): React.ReactElement {
    // Use centralized Button primitive from stitches.config.ts

    const IconWrapper = styled('span', {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5em',
        background: 'transparent',
    });

    const TooltipContent = styled(Tooltip.Content, tooltipContentStyles as any);
    const TooltipArrow = styled(Tooltip.Arrow, tooltipArrowStyles as any);

    const side = positioning?.side ?? 'left';
    const sideOffset = positioning?.sideOffset ?? 6;
    const align = positioning?.align;

    // map tone fallback for inline style color prop
    const toneProp = (tone as any) || 'default';

    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Button
                        onClick={onClick}
                        disabled={disabled}
                        aria-label={label}
                        type={type}
                        onKeyDown={onKeyDown}
                        role={role}
                        tone={toneProp}
                        {...rest}
                        style={{ ...(rest.style || {}) }}
                    >
                        {icon ? <IconWrapper style={{ fontSize: iconSize as any }}>{icon}</IconWrapper> : null}
                        {loading ? '…' : label}
                    </Button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <TooltipContent side={side} sideOffset={sideOffset} align={align}>
                        {tooltip || label}
                        <TooltipArrow />
                    </TooltipContent>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}

export default TooltipButton;
