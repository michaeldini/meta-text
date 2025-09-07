import React from 'react';
import { FontFamilySelect } from '@components/stylecontrols';
import { Field, NumberInput } from '@chakra-ui/react';
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
        <Field.Root width="100px">
            <Field.HelperText>{label}</Field.HelperText>
            <NumberInput.Root
                min={min}
                max={max}
                step={step}
                value={String(value)}
                onValueChange={details => onChange(Number((details as any).value || details))}
                disabled={disabled}
            >
                <NumberInput.Control />
                <NumberInput.Input />
            </NumberInput.Root>
        </Field.Root>
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
                            onChange={val => updateUserConfig.mutate({ textSizePx: val })}
                        />
                    )}
                    {showLineHeight && (
                        <StyleNumberInput
                            label="Line Height"
                            value={lineHeight}
                            min={1.0}
                            max={2.5}
                            step={0.05}
                            onChange={val => updateUserConfig.mutate({ lineHeight: val })}
                        />
                    )}
                    {showPaddingX && (
                        <StyleNumberInput
                            label="Padding X"
                            value={paddingX}
                            min={1}
                            max={5}
                            step={1}
                            onChange={val => updateUserConfig.mutate({ paddingX: val })}
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
