import React from 'react';
import { TextSizeInput, LineHeightInput, PaddingXInput, FontFamilySelect } from '@components/stylecontrols';
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
                        <TextSizeInput
                            value={textSizePx}
                            onChange={(val: number) => updateUserConfig.mutate({ textSizePx: val })}
                        />
                    )}
                    {showLineHeight && (
                        <LineHeightInput
                            value={lineHeight}
                            onChange={(val: number) => updateUserConfig.mutate({ lineHeight: val })}
                        />
                    )}
                    {showPaddingX && (
                        <PaddingXInput
                            value={paddingX}
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
