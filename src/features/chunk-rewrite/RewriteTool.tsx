import { Icon } from '@components/icons/Icon';
/**
 * Rewrite Tool
 * Concept: If you have a text, you can REWRITE it in a specific STYLE
 * Example styles: "like I'm 5", "like a bro", "academic"
 */
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import type { ChunkType } from '@mtypes/documents';
import { TooltipButton } from '@components/TooltipButton';
import { useRewriteTool } from './hooks/useRewriteTool';
import RewriteGenerationDialog from './components/RewriteGenerationDialog';


interface RewriteDisplayToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function RewriteDisplayTool(props: RewriteDisplayToolProps) {
    const { chunk, isVisible } = props;

    const {
        rewrites,
        selected,
        state,
        openDialog,
        closeDialog,
        setStyle,
        submitRewrite,
        setSelectedId,
        hasRewrites,
    } = useRewriteTool(chunk);

    if (!isVisible) return null;
    return (
        <Box>
            <TooltipButton
                label="Rewrite"
                tooltip="Generate a rewrite for this chunk"
                icon={<Icon name='EditSquare' />}
                onClick={openDialog}
                disabled={!chunk}
                loading={state.loading}
            />
            <RewriteGenerationDialog
                open={state.dialogOpen}
                onClose={closeDialog}
                styleValue={state.style}
                onStyleChange={setStyle}
                loading={state.loading}
                error={state.error}
                onSubmit={async () => { await submitRewrite(); }}
            />
            {/* Select to browse previous rewrites */}
            {hasRewrites && (
                <Box mt={6}>
                    <label htmlFor="rewrite-select">Browse previous rewrites:</label>
                    <select
                        id="rewrite-select"
                        value={state.selectedId === '' ? '' : String(state.selectedId)}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedId(Number(e.target.value))}
                        style={{ width: '100%', marginTop: 8, marginBottom: 8 }}
                    >
                        <option value="">Browse previous rewrites</option>
                        {rewrites.map(r => (
                            <option key={r.id} value={r.id}>{r.title || `Rewrite ${r.id}`}</option>
                        ))}
                    </select>
                    {selected && (
                        <Box p={3} borderWidth={1} borderRadius={4} mt={2}>
                            <Text>{selected.rewrite_text}</Text>
                        </Box>
                    )}

                </Box>
            )}
            {!hasRewrites && (
                <Text>No rewrites</Text>)
            }
        </Box>
    );
}

export default RewriteDisplayTool;
