// // Toggle component for showing/hiding chunk positions
// // Similar pattern to other StyleControls components

// import React from 'react';
// import { IconButton, Tooltip } from '@mui/material';
// import { useUserConfig, useUpdateUserConfig } from 'services/userConfigService';
// import { HashtagIcon } from 'icons';

// const ChunkPositionToggle: React.FC = () => {
//     const { data: userConfig } = useUserConfig();
//     const updateUserConfig = useUpdateUserConfig();
//     const showChunkPositions = userConfig?.uiPreferences?.showChunkPositions ?? false;

//     return (
//         <Tooltip title={showChunkPositions ? "Hide chunk positions" : "Show chunk positions"} arrow>
//             <IconButton
//                 onClick={() => updateUserConfig.mutate({ showChunkPositions: !showChunkPositions })}
//                 color={showChunkPositions ? "primary" : "default"}
//                 data-testid="chunk-position-toggle"
//                 disabled={updateUserConfig.status === 'pending'}
//             >
//                 <HashtagIcon />
//             </IconButton>
//         </Tooltip>
//     );
// };

// export default ChunkPositionToggle;
