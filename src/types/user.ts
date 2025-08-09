
/**
 * User config shape returned from backend. 
 * 
 */

export interface uiPreferences {
    textSizePx?: number;
    fontFamily?: string;
    lineHeight?: number;
    paddingX?: number;
    showChunkPositions?: boolean;
}

export interface UserConfig {
    uiPreferences?: uiPreferences;
};
