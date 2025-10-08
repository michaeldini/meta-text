import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { tooltipFade, styled } from "@styles";


const TooltipContent = styled(TooltipPrimitive.Content, {
    background: '$colors$altBackground',
    color: '$colors$primary',
    padding: '8px 10px',
    border: '2px solid $colors$primary',
    borderRadius: '6px',
    fontSize: '1.1rem',
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    animation: `${tooltipFade} 160ms ease`,
    zIndex: 1000,
});

export interface TooltipProps {
    children: React.ReactNode;
    content: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
    children,
    content,
    open,
    defaultOpen,
    onOpenChange,
    ...props
}: TooltipProps) {
    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root
                open={open}
                defaultOpen={defaultOpen}
                onOpenChange={onOpenChange}
            >
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipContent side="top" align="center" sideOffset={10} {...props}
                    onFocusCapture={e => e.stopPropagation()} // prevent focus stealing
                >
                    {content}
                </TooltipContent>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}