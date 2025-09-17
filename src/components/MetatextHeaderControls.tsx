// import { HiArrowDownTray, HiBookmark, HiHashtag, HiOutlineStar, HiStar } from 'react-icons/hi2';
// // Header controls for the Metatext detail page
// // Contains bookmark navigation, favorites toggle, download, and position display controls
// // Self-contained component that manages its own state via hooks

// import React from 'react';
// import * as Toolbar from '@radix-ui/react-toolbar';
// import { styled } from '../stitches.config';

// import { TooltipButton } from '@components/ui/TooltipButton';
// import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
// import { useDownloadMetatext } from '@pages/Metatext/hooks/useDownloadMetatext';
// import { useBookmark } from '@hooks/useBookmark';
// import getUiPreferences from '@utils/getUiPreferences';
// import { useChunkFiltersStore } from '@features/chunk/hooks/useChunkFiltersStore';
// import { useChunkNavigationStore } from '@store/chunkNavigationStore';

// const StyledToolbarRoot = styled(Toolbar.Root, {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '8px',
//     backgroundColor: 'transparent',
//     borderRadius: '6px'
// });

// const StyledToggleGroup = styled(Toolbar.ToggleGroup, {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '4px'
// });

// const StyledSeparator = styled(Toolbar.Separator, {
//     width: '1px',
//     height: '24px',
//     backgroundColor: '$border',
//     margin: '0 4px'
// });

// interface MetatextHeaderControlsProps {
//     metatextId: number;
// }

// export function MetatextHeaderControls({
//     metatextId,
// }: MetatextHeaderControlsProps): React.ReactElement {
//     // Self-contained state management via hooks
//     const { data: userConfig } = useUserConfig();
//     const updateUserConfig = useUpdateUserConfig();
//     const uiPreferences = getUiPreferences(userConfig);

//     // Download functionality
//     const downloadMetatext = useDownloadMetatext(metatextId);

//     // Favorites state from store
//     const showOnlyFavorites = useChunkFiltersStore((s) => s.showOnlyFavorites);
//     const setShowOnlyFavorites = useChunkFiltersStore((s) => s.setShowOnlyFavorites);

//     // Navigation store for bookmark navigation
//     const requestNavigateToChunk = useChunkNavigationStore(state => state.requestNavigateToChunk);

//     // Bookmark state (direct)
//     const { bookmarkedChunkId, isLoading: bookmarkLoading } = useBookmark(metatextId);
//     const goToBookmark = () => {
//         if (!bookmarkedChunkId) return;
//         // Use the navigation store to request navigation - this will trigger page change + scroll
//         requestNavigateToChunk(bookmarkedChunkId);
//     };
//     return (
//         <StyledToolbarRoot orientation="horizontal">
//             <StyledToggleGroup type="multiple">
//                 <Toolbar.ToggleItem
//                     value="favorites"
//                     asChild
//                 >
//                     <TooltipButton
//                         label=""
//                         tooltip={showOnlyFavorites ? "Show all chunks" : "Show only favorites"}
//                         icon={showOnlyFavorites ? <HiStar /> : <HiOutlineStar />}
//                         onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
//                         aria-pressed={showOnlyFavorites}
//                         role="switch"
//                     />
//                 </Toolbar.ToggleItem>
//                 <Toolbar.ToggleItem
//                     value="positions"
//                     asChild
//                 >
//                     <TooltipButton
//                         label=""
//                         tooltip={uiPreferences?.showChunkPositions ? "Hide chunk positions" : "Show chunk positions"}
//                         icon={<HiHashtag />}
//                         onClick={() => updateUserConfig.mutate({ showChunkPositions: !uiPreferences?.showChunkPositions })}
//                         role="switch"
//                         aria-checked={!!uiPreferences?.showChunkPositions}
//                         disabled={uiPreferences == null}
//                     />
//                 </Toolbar.ToggleItem>
//             </StyledToggleGroup>
//             <StyledSeparator />
//             <Toolbar.Button asChild>
//                 <TooltipButton
//                     label=""
//                     tooltip="Navigate to the bookmarked chunk in this metatext"
//                     icon={<HiBookmark />}
//                     onClick={goToBookmark}
//                     disabled={!bookmarkedChunkId}
//                     loading={bookmarkLoading}
//                     data-testid="goto-bookmark-button"
//                 />
//             </Toolbar.Button>
//             <StyledSeparator />
//             <Toolbar.Button asChild>
//                 <TooltipButton
//                     label=""
//                     tooltip="Download MetaText as JSON"
//                     icon={<HiArrowDownTray />}
//                     onClick={() => void downloadMetatext.handleDownload()}
//                     disabled={downloadMetatext.disabled}
//                     loading={downloadMetatext.loading}
//                 />
//             </Toolbar.Button>
//         </StyledToolbarRoot>
//     );
// }

// export default MetatextHeaderControls;
