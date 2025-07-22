
// // UI Preferences hooks using TanStack Query for server sync
// import { useUserConfig, useUpdateUserConfig } from '../services/userConfigService';

// export const FONT_FAMILIES = [
//     'Inter, sans-serif',
//     'Roboto, sans-serif',
//     'Arial, sans-serif',
//     'Georgia, serif',
//     'Times New Roman, Times, serif',
//     'Courier New, Courier, monospace',
//     'monospace',
//     'Funnel Display, sans-serif',
//     'Open Sans, sans-serif',
// ];

// // Hook to get UI preferences (from user config)
// // Returns the user's UI preferences from the server, or sensible defaults if not set
// export function useUIPreferences() {
//     const { data } = useUserConfig();
//     return data?.uiPreferences || {
//         textSizePx: 28,
//         fontFamily: FONT_FAMILIES[0],
//         lineHeight: 1.5,
//         paddingX: 0.3,
//         showChunkPositions: false,
//     };
// }

// // Hook to update UI preferences
// export function useUpdateUIPreferences() {
//     const updateUserConfig = useUpdateUserConfig();
//     return updateUserConfig;
// }


