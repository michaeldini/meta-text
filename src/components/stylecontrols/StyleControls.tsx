
import React from 'react';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { TextSizeInput, LineHeightInput, PaddingXInput, FontFamilySelect } from '@components/stylecontrols';



const DEFAULTS = {
    textSizePx: 20,
    fontFamily: 'Inter, sans-serif',
    lineHeight: 1.5,
    paddingX: 0.3,
};

export function StyleControls(): React.ReactElement {

    const { data: userConfig, isLoading } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();

    const uiPreferences = userConfig?.uiPreferences || DEFAULTS;

    return (
        <>
            <TextSizeInput
                value={uiPreferences.textSizePx || DEFAULTS.textSizePx}
                onChange={(val: number) => updateUserConfig.mutate({ textSizePx: val })}
            />
            <LineHeightInput
                value={uiPreferences.lineHeight || DEFAULTS.lineHeight}
                onChange={(val: number) => updateUserConfig.mutate({ lineHeight: val })}
            />

            <PaddingXInput
                value={uiPreferences.paddingX || DEFAULTS.paddingX}
                onChange={(val: number) => updateUserConfig.mutate({ paddingX: val })}
            />

            <FontFamilySelect
                value={uiPreferences.fontFamily || DEFAULTS.fontFamily}
                onChange={(val: string) => updateUserConfig.mutate({ fontFamily: val })}
            />
        </>
    );
}

export default StyleControls;
