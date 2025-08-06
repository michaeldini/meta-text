
import React, { useState } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import { Button } from '@chakra-ui/react/button';
import { Drawer } from '@chakra-ui/react/drawer';
import type { ChunkType } from '@mtypes/documents';
import RewriteToolButton from './components/RewriteToolButton';
import { useRewrite } from './hooks/useRewrite';
import { generateRewrite } from '@services/chunkService';


interface RewriteDisplayToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function RewriteDisplayTool(props: RewriteDisplayToolProps) {
    const { chunk, isVisible } = props;
    if (!isVisible) return null;
    const { rewrites } = useRewrite(chunk);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [style, setStyle] = useState('like im 5');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | ''>('');

    // Open drawer for new rewrite
    const handleOpenDrawer = () => {
        setDrawerOpen(true);
        setError(null);
        setStyle('like im 5');
    };
    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setError(null);
        setStyle('like im 5');
    };

    // Submit new rewrite
    const handleSubmitRewrite = async () => {
        setLoading(true);
        setError(null);
        try {
            // generate a new rewrite
            await generateRewrite(chunk.id, style); // Simulate rewrite creation
            handleCloseDrawer();
        } catch (err) {
            setError('Failed to generate rewrite.');
        } finally {
            setLoading(false);
        }
    };

    // Select previous rewrite
    const selectedRewrite = rewrites.find(r => r.id === selectedId);

    return (
        <Box>
            {/* Button to open drawer for new rewrite */}
            <RewriteToolButton onClick={handleOpenDrawer} disabled={!chunk} />

            {/* Drawer for creating new rewrite */}
            <Drawer.Root open={drawerOpen} onOpenChange={e => { if (!e.open) handleCloseDrawer(); }}>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW="sm" w="full">
                        <Drawer.Header>
                            <Drawer.Title>Generate Rewrite</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Box w="full" mb={4}>
                                <label htmlFor="style-select">Rewrite style:</label>
                                <select
                                    id="style-select"
                                    value={style}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStyle(e.target.value)}
                                    style={{ width: '100%', marginTop: 8 }}
                                >
                                    <option value="like im 5">like I’m 5</option>
                                    <option value="like a bro">Like a bro</option>
                                    <option value="academic">Like an Academic</option>
                                </select>
                            </Box>
                            {error && <Text color="red.500" mt={2}>{error}</Text>}
                        </Drawer.Body>
                        <Drawer.Footer mb="10">
                            <Button
                                onClick={handleCloseDrawer}
                                color="fg"
                                disabled={loading}>Cancel</Button>
                            <Button
                                onClick={handleSubmitRewrite}
                                disabled={loading || !style || !chunk}
                                loading={loading}>
                                Generate & Save
                            </Button>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>

            {/* Select to browse previous rewrites */}
            {rewrites.length > 0 && (
                <Box mt={6}>
                    <label htmlFor="rewrite-select">Browse previous rewrites:</label>
                    <select
                        id="rewrite-select"
                        value={selectedId === '' ? '' : String(selectedId)}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedId(Number(e.target.value))}
                        style={{ width: '100%', marginTop: 8, marginBottom: 8 }}
                    >
                        <option value="">Browse previous rewrites</option>
                        {rewrites.map(r => (
                            <option key={r.id} value={r.id}>{r.title || `Rewrite ${r.id}`}</option>
                        ))}
                    </select>
                    {selectedRewrite && (
                        <Box p={3} borderWidth={1} borderRadius={4} mt={2}>
                            <Text>{selectedRewrite.rewrite_text}</Text>
                        </Box>
                    )}

                </Box>
            )}
            {rewrites.length == 0 && (
                <Text>No rewrites</Text>)
            }
        </Box>
    );
}

export default RewriteDisplayTool;
