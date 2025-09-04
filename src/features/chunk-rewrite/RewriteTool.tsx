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
import { useRewriteTool } from './hooks/useRewriteTool';
import type { ChunkType } from '@mtypes/documents';
import { SimpleDrawer, EmptyState } from '@components/ui';
import { Button } from '@chakra-ui/react/button';



const STYLE_OPTIONS = [
    { value: 'like im 5', label: 'Like I’m 5' },
    { value: 'like a bro', label: 'Like a Bro' },
    { value: 'academic', label: 'Academic' }
];


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
    } = useRewriteTool(chunk);

    // The selected rewrite currently being viewed
    const [selectedId, setSelectedId] = useState<number | ''>('');
    const selected = useMemo(() =>
        rewrites.find(r => r.id === selectedId), [rewrites, selectedId]);

    // Handle form submission to create a new rewrite
    const handleFormSubmit = async (e: React.FormEvent) => { e.preventDefault(); await submitRewrite(); };

    if (!isVisible) return null;
    return (
        <Box>
            <SimpleDrawer
                title="Generate Rewrite"
                triggerButton={<TooltipButton
                    label="Rewrite"
                    tooltip="Generate a rewrite for this chunk"
                    icon={<HiPencilSquare />}
                />}
            >
                <Box>
                    <form id="rewrite-gen-form" onSubmit={handleFormSubmit}>
                        <Button type="submit" form="rewrite-gen-form" disabled={isLoading} loading={isLoading}>Generate & Save</Button>
                        <Box>
                            <label htmlFor="rewrite-style">Rewrite style:</label>
                            <select
                                id="rewrite-style"
                                value={style}
                                onChange={e => setStyle(e.target.value)}
                                style={{ width: '100%', marginTop: 8 }}
                                disabled={isLoading}
                            >
                                {STYLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </Box>
                    </form>
                    {error && (
                        <Box mt={2} color="red.500">
                            {error}
                        </Box>
                    )}
                </Box>
            </SimpleDrawer>
            {/* Select to browse previous rewrites */}
            {hasRewrites && (
                <Box mt={6}>
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
                <EmptyState title="No Rewrites Yet" icon="✏️" description="Create a new rewrite to see it here." />
            )}
        </Box>
    );
}

export default RewriteDisplayTool;
