import React from 'react';
import { css } from '@stitches/react';

// import { FontFamilySelect } from '@components/stylecontrols';
import { Box, Text, Input } from '@styles';
import { useUIPreferences } from '@hooks/useUIPreferences';
import { Select } from '@components/ui/select';
import { useFontFamilySelect } from '@hooks/stylecontrols/useFontFamilySelect';


interface FontFamilySelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

function FontFamilySelect(props: FontFamilySelectProps) {
    const { value, onChange, disabled } = props;
    const { fontFamilyOptions } = useFontFamilySelect({ value, onChange });
    return (
        <Select
            options={fontFamilyOptions.items}
            value={value}
            onChange={onChange}
            placeholder="Font"
            disabled={disabled}
        // label="Font"
        />
    );
}

// Custom CSS for always visible and cleaner spin buttons
const numberInputStyle = css({
    // Hide spin buttons in Webkit browsers
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        display: 'none',
        WebkitAppearance: 'none',
        margin: 0,
    },
    // Hide spin buttons in Firefox
    '&': {
        MozAppearance: 'textfield',
    },
});

/**
 * StyleControls component for adjusting UI preferences.
 * Use boolean props to control which controls are rendered.
 */


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
        <Box css={{ padding: 1, display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
            <Text css={{ backgroundColor: 'transparent', color: '$colors$altText' }}>{label}</Text>
            <Input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
                disabled={disabled}
                className={numberInputStyle()} // Apply custom CSS class
            />
        </Box>
    );
}


interface StyleToolsProps {
    showTextSize?: boolean;
    showLineHeight?: boolean;
    showPaddingX?: boolean;
    showFontFamily?: boolean;
}

export function StyleTools({
    showTextSize = true,
    showLineHeight = true,
    showPaddingX = true,
    showFontFamily = true,
}: StyleToolsProps): React.ReactElement {
    const { textSizePx, fontFamily, lineHeight, paddingX, updateUserConfig } = useUIPreferences();
    return (
        <>
            {showTextSize && (
                <StyleNumberInput
                    label="Size"
                    value={textSizePx}
                    min={8}
                    max={72}
                    step={1}
                    onChange={(val: number) => updateUserConfig.mutate({ textSizePx: val })}
                />
            )}
            {showLineHeight && (
                <StyleNumberInput
                    label="Height"
                    value={lineHeight}
                    min={1.0}
                    max={2.5}
                    step={0.1}
                    onChange={(val: number) => updateUserConfig.mutate({ lineHeight: val })}
                />
            )}
            {showPaddingX && (
                <StyleNumberInput
                    label="Gap"
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
    );
}

export default StyleTools;
