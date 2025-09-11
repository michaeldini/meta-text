// ProgressCircle migrated from Chakra UI to Stitches
import * as React from "react";
import { styled } from '@styles';

interface ProgressCircleProps {
    value: number;
    max?: number;
    showValueText?: boolean;
    valueText?: React.ReactNode;
    trackColor?: string;
    color?: string;
    cap?: 'round' | 'butt' | 'square';
    thickness?: number;
    size?: number;
    className?: string;
}

const CircleContainer = styled('div', {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ValueText = styled('div', {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'inherit',
    pointerEvents: 'none',
});

export const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
    function ProgressCircle({
        value,
        max = 100,
        showValueText,
        valueText,
        trackColor = '#e5e5e5',
        color = '#0ea5a4',
        cap = 'round',
        thickness = 8,
        size = 64,
        className,
        ...rest
    }, ref) {
        const radius = (size - thickness) / 2;
        const circumference = 2 * Math.PI * radius;
        const percent = Math.max(0, Math.min(1, value / max));
        const offset = circumference * (1 - percent);

        return (
            <CircleContainer ref={ref} className={className} style={{ width: size, height: size }} {...rest}>
                <svg width={size} height={size} style={{ display: 'block' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={trackColor}
                        strokeWidth={thickness}
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={thickness}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap={cap}
                        style={{ transition: 'stroke-dashoffset 0.4s cubic-bezier(.4,0,.2,1)' }}
                    />
                </svg>
                {showValueText && (
                    <ValueText>{valueText ?? Math.round(percent * 100) + '%'}</ValueText>
                )}
            </CircleContainer>
        );
    }
);
