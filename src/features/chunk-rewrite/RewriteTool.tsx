import { HiPencilSquare } from 'react-icons/hi2';
/**
 * Rewrite Tool
 * Concept: If you have a text, you can REWRITE it in a specific STYLE
 * Example styles: "like I'm 5", "like a bro", "academic"
 */
import React, { useMemo, useState } from 'react';
import { Box, Text } from '@styles';
import { useRewriteTool } from './hooks/useRewriteTool';
import type { ChunkType } from '@mtypes/documents';
import { SimpleDialog, EmptyState, Button } from '@components/ui';
import { Select } from '@components/ui/select';



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
            <SimpleDialog
                title="Generate Rewrite"
                tooltip="Generate a rewrite for this chunk using AI"
                triggerButton={<Button
                    icon={<HiPencilSquare />}
                >Generate Rewrite</Button>}
            >
                <Box>
                    <form id="rewrite-gen-form" onSubmit={handleFormSubmit}>
                        <Button
                            type="submit"
                            form="rewrite-gen-form"
                            disabled={isLoading}
                            tone="primary"
                            css={{ minWidth: 120 }}
                        >
                            {isLoading ? 'Generating…' : 'Generate & Save'}
                        </Button>
                        <Box>
                            <label htmlFor="rewrite-style">Rewrite style:</label>
                            <Select
                                options={STYLE_OPTIONS}
                                value={style}
                                onChange={(val: string) => setStyle(val)}
                                disabled={isLoading}
                                placeholder="Select style"
                            />
                        </Box>
                    </form>
                    {error && (
                        <Box>
                            {error}
                        </Box>
                    )}
                </Box>
            </SimpleDialog>
            {/* Select to browse previous rewrites */}
            {hasRewrites && (
                <Box>
                    <Select
                        options={[{ label: "Browse previous rewrites", value: "" }, ...rewrites.map(r => ({ label: r.title || `Rewrite ${r.id}`, value: String(r.id) }))]}
                        value={selectedId === '' ? '' : String(selectedId)}
                        onChange={(val: string) => setSelectedId(val === '' ? '' : Number(val))}
                        placeholder="Browse previous rewrites"
                    />
                    {selected && (
                        <Box>
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
