
import React from 'react';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { TextSizeInput, LineHeightInput, PaddingXInput, FontFamilySelect } from '@components/stylecontrols';
import { useUIPreferences } from '@hooks/useUIPreferences';
/**
 * StyleControls component for adjusting UI preferences.
 * Use 'mode' prop to control which inputs are rendered:
 * - 'metatext': shows all controls including PaddingXInput
 * - 'sourceDoc': excludes PaddingXInput
 */

type StyleControlsMode = 'metatext' | 'sourceDoc';

interface StyleControlsProps {
    mode?: StyleControlsMode;
}

export function StyleControls({ mode = 'metatext' }: StyleControlsProps): React.ReactElement {
    const { textSizePx, fontFamily, lineHeight, paddingX, updateUserConfig } = useUIPreferences();
    return (
        <>
            <TextSizeInput
                value={textSizePx}
                onChange={(val: number) => updateUserConfig.mutate({ textSizePx: val })}
            />
            <LineHeightInput
                value={lineHeight}
                onChange={(val: number) => updateUserConfig.mutate({ lineHeight: val })}
            />
            {mode === 'metatext' && (
                <PaddingXInput
                    value={paddingX}
                    onChange={(val: number) => updateUserConfig.mutate({ paddingX: val })}
                />
            )}
            <FontFamilySelect
                value={fontFamily}
                onChange={(val: string) => updateUserConfig.mutate({ fontFamily: val })}
            />
        </>
    );
}

export default StyleControls;
