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
import { useUpdateUserConfig, useUserConfig, getPreferences } from '@services/userConfigService';

/**
 * import a select componenet for the font family selection
 */
import { Select } from '@components/ui/select';

/** UI components */
import { Text, Row, NumberInput } from '@styles';
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
            <NumberInput
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
                disabled={disabled}
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
interface UserConfigToolsProps {
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
}: UserConfigToolsProps): React.ReactElement {

    /**
     * Update user config mutation
     * 
     */
    const updateUserConfig = useUpdateUserConfig();
    const { data: userConfig } = useUserConfig();
    const { textSizePx, fontFamily, lineHeight, paddingX, showChunkPositions } = getPreferences(userConfig).uiPreferences;
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
                <Select
                    options={FONT_FAMILY_OPTIONS}
                    value={fontFamily}
                    onChange={(val: string) => updateUserConfig.mutate({ fontFamily: val })}
                    disabled={userConfig == null}
                />
            )}
        </>
    );
}

export default UserConfigTools;
