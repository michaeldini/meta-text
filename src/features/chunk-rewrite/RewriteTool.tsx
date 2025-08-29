import { HiPencilSquare } from 'react-icons/hi2';
/**
 * Rewrite Tool
 * Concept: If you have a text, you can REWRITE it in a specific STYLE
 * Example styles: "like I'm 5", "like a bro", "academic"
 */
import React, { useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import { TooltipButton } from '@components/TooltipButton';
import RewriteGenerationDisplay from './components/RewriteGenerationDisplay';
import { useDrawer } from '@store/drawerStore';
import { useRewriteTool } from './hooks/useRewriteTool';
import type { ChunkType } from '@mtypes/documents';


interface RewriteDisplayToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function RewriteDisplayTool(props: RewriteDisplayToolProps) {
    const { chunk, isVisible } = props;

    const {
        rewrites,
        style,
        setStyle,
        submitRewrite,
        isLoading,
        error,
        hasRewrites,
        reset,
    } = useRewriteTool(chunk);

    // Local selection is a pure UI concern
    const [selectedId, setSelectedId] = useState<number | ''>('');
    // Derive selected rewrite without side effects
    const selected = useMemo(() =>
        rewrites.find(r => r.id === selectedId), [rewrites, selectedId]);

    // Drawer scoped per chunk to avoid cross-instance interference
    const drawerId = `chunkRewrite:${chunk.id}` as const;
    const { isOpen, open, close } = useDrawer(drawerId);

    if (!isVisible) return null;
    return (
        <Box>
            <TooltipButton
                label="Rewrite"
                tooltip="Generate a rewrite for this chunk"
                icon={<HiPencilSquare />}
                onClick={() => { reset(); open(); }}
                disabled={!chunk}
                loading={isLoading}
            />
            <RewriteGenerationDisplay
                open={isOpen}
                onClose={() => { reset(); close(); }}
                styleValue={style}
                onStyleChange={setStyle}
                loading={isLoading}
                error={error}
                onSubmit={async () => { await submitRewrite(); }}
            />
            {/* Select to browse previous rewrites */}
            {hasRewrites && (
                <Box mt={6}>
                    <label htmlFor="rewrite-select">Browse previous rewrites:</label>
                    <select
                        id="rewrite-select"
                        value={selectedId === '' ? '' : String(selectedId)}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            const v = e.target.value;
                            setSelectedId(v === '' ? '' : Number(v));
                        }}
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
                <Text textAlign="right" color="fg.muted">No rewrites yet.</Text>)
            }
        </Box>
    );
}

export default RewriteDisplayTool;
