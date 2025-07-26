
import React from 'react';
import { Box, Stack } from '@chakra-ui/react';
import { useUserConfig, useUpdateUserConfig } from 'services/userConfigService';
import { TextSizeInput, LineHeightInput, PaddingXInput, FontFamilySelect } from 'components';



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
        // <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap sx={{ alignItems: 'center' }}>
        <>
            <TextSizeInput
                value={uiPreferences.textSizePx || DEFAULTS.textSizePx}
                onChange={val => updateUserConfig.mutate({ textSizePx: val })}
            />
            <LineHeightInput
                value={uiPreferences.lineHeight || DEFAULTS.lineHeight}
                onChange={val => updateUserConfig.mutate({ lineHeight: val })}
            />

            <PaddingXInput
                value={uiPreferences.paddingX || DEFAULTS.paddingX}
                onChange={val => updateUserConfig.mutate({ paddingX: val })}
            />

            <FontFamilySelect
                value={uiPreferences.fontFamily || DEFAULTS.fontFamily}
                onChange={val => updateUserConfig.mutate({ fontFamily: val })}
            />
        </>
        // </Stack>
    );
}

export default StyleControls;
