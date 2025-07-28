// Utility to safely get uiPreferences with defaults
// Ensures all expected fields are present, so UI code never checks for undefined

import { UserConfig } from '../services/userConfigService';

export interface UiPreferences {
    textSizePx?: number;
    fontFamily?: string;
    lineHeight?: number;
    paddingX?: number;
    showChunkPositions: boolean;
}

const DEFAULT_UI_PREFERENCES: UiPreferences = {
    textSizePx: undefined,
    fontFamily: undefined,
    lineHeight: undefined,
    paddingX: undefined,
    showChunkPositions: false,
};

const getUiPreferences = (userConfig?: UserConfig): UiPreferences => {
    return {
        ...DEFAULT_UI_PREFERENCES,
        ...(userConfig?.uiPreferences ?? {}),
    };
};

export default getUiPreferences;
