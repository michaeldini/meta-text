import React from 'react';
import { FontFamilySelect } from '@components/stylecontrols';
import { Box, Text, Input } from '@styles';
import { useUIPreferences } from '@hooks/useUIPreferences';
import { TooltipButton } from '@components/TooltipButton';


/**
 * StyleControls component for adjusting UI preferences.
 * Use boolean props to control which controls are rendered.
 */

interface StyleControlsProps {
    showTextSize?: boolean;
    showLineHeight?: boolean;
    showPaddingX?: boolean;
    showFontFamily?: boolean;
}


interface StyleNumberInputProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
    disabled?: boolean;
}

// DRY: Common number input for style controls
function StyleNumberInput({ label, value, min, max, step, onChange, disabled }: StyleNumberInputProps) {
    return (
        <Box css={{ width: 100, display: 'flex', flexDirection: 'column', gap: 4, mb: 12 }}>
            <Text css={{ fontSize: 14, color: '$gray11', mb: 2 }}>{label}</Text>
            <Input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
                disabled={disabled}
                css={{ width: '100%', fontSize: 16, padding: '6px 8px', borderRadius: 6, border: '1px solid $gray400' }}
            />
        </Box>
    );
}

export function StyleControls({
    showTextSize = true,
    showLineHeight = true,
    showPaddingX = true,
    showFontFamily = true,
}: StyleControlsProps): React.ReactElement {
    const { textSizePx, fontFamily, lineHeight, paddingX, updateUserConfig } = useUIPreferences();
    const [visible, setVisible] = React.useState(false);
    return (
        <>
            <TooltipButton
                label={visible ? "Hide" : "Styles"}
                tooltip={visible ? 'Hide Style Controls' : 'Show Style Controls'}
                onClick={() => setVisible(v => !v)}
            />
            {visible && (
                <>
                    {showTextSize && (
                        <StyleNumberInput
                            label="Text Size"
                            value={textSizePx}
                            min={8}
                            max={72}
                            step={1}
                            onChange={(val: number) => updateUserConfig.mutate({ textSizePx: val })}
                        />
                    )}
                    {showLineHeight && (
                        <StyleNumberInput
                            label="Line Height"
                            value={lineHeight}
                            min={1.0}
                            max={2.5}
                            step={0.05}
                            onChange={(val: number) => updateUserConfig.mutate({ lineHeight: val })}
                        />
                    )}
                    {showPaddingX && (
                        <StyleNumberInput
                            label="Padding X"
                            value={paddingX}
                            min={.1}
                            max={2}
                            step={.05}
                            onChange={(val: number) => updateUserConfig.mutate({ paddingX: val })}
                        />
                    )}
                    {showFontFamily && (
                        <FontFamilySelect
                            value={fontFamily}
                            onChange={(val: string) => updateUserConfig.mutate({ fontFamily: val })}
                        />
                    )}
                </>
            )}
        </>
    );
}

export default StyleControls;
