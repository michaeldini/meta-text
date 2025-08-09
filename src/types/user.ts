
/**
 * User config shape returned from backend. 
 * 
 */
export interface UserConfig {
    uiPreferences?: {
        textSizePx?: number;
        fontFamily?: string;
        lineHeight?: number;
        paddingX?: number;
        showChunkPositions?: boolean;
    };
}
