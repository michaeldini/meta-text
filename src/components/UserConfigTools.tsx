/**
 * Buttons for adjusting styling:
 * 
 * Current style controls:
 * - Text Size
 * - Line Height
 * - Horizontal Padding
 * - Font Family
 * 
 */
import React from 'react';


/** Hook to fetch user configuration and ui preferences. */
import { useUpdateUserConfig, useUserConfig } from '@services/userConfigService';
import getUiPreferences from '@utils/getUiPreferences';
/**
 * import a select componenet for the font family selection
 */
import { Select } from '@components/ui/select';

/** UI components */
import { css } from '@stitches/react';
import { Box, Text, Input, Row } from '@styles';
import { TooltipButton } from '@components';
import { HiHashtag } from 'react-icons/hi2';

/** A list of available fonts the user can select */
const FONT_FAMILIES = [
    'Inter, sans-serif',
    'Roboto, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, Times, serif',
    'Courier New, Courier, monospace',
    'monospace',
    'Funnel Display, sans-serif',
    'Open Sans, sans-serif',
];

/** Options for the font family select component */
const FONT_FAMILY_OPTIONS = FONT_FAMILIES.map(font => ({
    value: font,
    label: font.split(',')[0],
    style: { fontFamily: font },
}));

/**
 * Font Family Select
 * 
 * Gives user the ability to choose a font. 
 * 
 */
interface FontFamilySelectProps {

    /**options passed to the select component */
    options: {
        value: string;
        label: string;
        style: { fontFamily: string };
    }[];

    /** Current selected value */
    value: string;

    /** onChange handler */
    onChange: (value: string) => void;

    /** Disable the select */
    disabled?: boolean;
}


/**
 * Font Selection Componenent
 * 
 */
function FontFamilySelect(props: FontFamilySelectProps) {
    const { options, value, onChange, disabled } = props;

    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder="Font"
            disabled={disabled}
        />
    );
}

/**
 * We need to use Stitches css function to modify the classes for number input buttons.
 * 
 * We define the styles here to hide the buttons. 
 * We pass the object to the component.
 * The inputs are easily changed by focusing and using the arrow keys.
 */
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

/**
 * 
 * A common component for number inputs used in StyleTools.
 * 
 * Uses custom CSS to hide the default number input buttons.
 * 
 */
function StyleNumberInput({ label, value, min, max, step, onChange, disabled }: StyleNumberInputProps) {
    return (
        <Row alignCenter p="0">
            <Text css={{ color: '$colors$altText' }}>{label}</Text>
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
        </Row>
    );
}

/**
 * StyleTools component for adjusting UI preferences.
 * 
 * Use boolean props to control which controls are rendered. This allows for flexible use of the component, only showing the controls needed in a given context.
 * 
 */
interface StyleToolsProps {
    showTextSize?: boolean;
    showLineHeight?: boolean;
    showPaddingX?: boolean;
    showFontFamily?: boolean;
    showShowChunkPositions?: boolean;
}

/**
 * StyleTools component for adjusting UI preferences.
 * 
 * Use boolean props to control which controls are rendered. This allows for flexible use of the component, only showing the controls needed in a given context.
 * 
 * Example usage:
 * <StyleTools showTextSize={true} showLineHeight={false}/>
 */
export function UserConfigTools({
    showTextSize = true,
    showLineHeight = true,
    showPaddingX = true,
    showFontFamily = true,
    showShowChunkPositions = false,
}: StyleToolsProps): React.ReactElement {
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const { textSizePx, fontFamily, lineHeight, paddingX, showChunkPositions } = getUiPreferences(userConfig);
    return (
        <>
            {showShowChunkPositions && (
                <TooltipButton
                    label=""
                    tooltip={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"}
                    icon={<HiHashtag />}
                    onClick={() => updateUserConfig.mutate({ showChunkPositions: !showChunkPositions })}
                    role="switch"
                    aria-checked={!!showChunkPositions}
                    disabled={userConfig == null}
                />
            )}

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
                    options={FONT_FAMILY_OPTIONS}
                    value={fontFamily}
                    onChange={(val: string) => updateUserConfig.mutate({ fontFamily: val })}
                />
            )}
        </>
    );
}

export default UserConfigTools;
