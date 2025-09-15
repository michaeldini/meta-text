import { HiOutlineSparkles } from 'react-icons/hi2';
/**
 * Image generation tool
 * Provides an interface for generating and displaying images for text chunks.
 */
import React, { useState } from 'react';
import { Box, Text, Button, Stack, TagRoot as Badge, Textarea } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/ui/TooltipButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateImage } from '@services/aiService';
import { queryKeys } from '@services/queryKeys';
import type { ChunkType } from '@mtypes/documents';
import { SimpleDialog } from '@components/ui';
import { Select } from '@components/ui/select';
import { AiImage } from '@mtypes/tools';

interface ImageToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function ImageTool(props: ImageToolProps) {
    const { chunk, isVisible } = props;

    // The new generation flow uses a contained dialog component (GenerateImageDialog)
    // which implements a react-query mutation and invalidates the `metatextDetail` key
    // so the page refreshes after generation completes.
    if (!isVisible) return null;
    return (
        <>
            <ImageViewer chunk={chunk} />
            <SimpleDialog
                title="Generate Image"
                triggerButton={<TooltipButton
                    label="Generate Image"
                    tooltip="Generate an image for this chunk using AI"
                    icon={<HiOutlineSparkles />}
                // generation state managed inside dialog component
                />}
            >
                <GenerateImageDialog chunk={chunk} />
            </SimpleDialog>
        </>
    );
}


// New simplified image viewing component
type ImageViewerProps = {
    chunk: ChunkType;
};


const ImageViewer: React.FC<ImageViewerProps> = ({ chunk }) => {
    // Assume chunk.images is an array of objects with a file location property (e.g., { file: string })
    const images = Array.isArray(chunk.images) ? chunk.images : [];
    // Ensure image src is correct for Vite public folder
    // Always prepend /generated_images/ to image filenames
    const imageFiles = images.map((img: AiImage) => {
        const file = typeof img === 'string' ? img : img.path || '';
        return `/generated_images/${file.replace(/^.*[\\\/]/, '')}`;
    });
    const [selectedImage, setSelectedImage] = useState(imageFiles[0] || '');

    if (!imageFiles.length) {
        return <Box>No images available for this chunk.</Box>;
    }

    return (
        <Box>
            <Select
                options={imageFiles.map((file: string, idx: number) => ({ label: `Image ${idx + 1}`, value: file }))}
                value={selectedImage}
                onChange={setSelectedImage}
                placeholder="Select image"
                label="Select image"
            />
            <Box css={{ marginTop: 16 }}>
                <img src={selectedImage} alt={`Chunk image`} style={{ maxWidth: '100%', maxHeight: 400 }} />
            </Box>
        </Box>
    );
};


function GenerateImageDialog({ chunk }: { chunk: ChunkType }) {
    const [prompt, setPrompt] = useState('');
    const queryClient = useQueryClient();
    const { id: chunkId, metatext_id: metatextId } = chunk;

    const mutation = useMutation({
        mutationFn: (p: string) => generateImage(p, chunkId),
        onSuccess: () => {
            // Invalidate both the single chunk and the metatext detail so
            // components reading either key will refetch updated image lists.
            queryClient.invalidateQueries({ queryKey: queryKeys.chunk(chunkId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.metatextDetail(metatextId) });
        },
    });

    const promptLength = prompt.length;
    const MIN_PROMPT_LENGTH = 3;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (promptLength < MIN_PROMPT_LENGTH) return;
        try {
            await mutation.mutateAsync(prompt);
        } catch (err) {
            // mutation will capture and expose error via mutation.error
        }
    };

    const SUGGESTED_PROMPTS = [
        'A serene landscape with mountains',
        'Abstract geometric patterns',
        'Vintage illustration style',
    ];

    return (
        <form onSubmit={handleSubmit}>
            <Stack css={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
                <Box>
                    <Textarea
                        emphasized
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to generate in detail..."
                        disabled={mutation.isPending}
                        autoFocus
                    />
                    <Text css={{ fontSize: '0.9rem', color: '$colors$subtle', marginTop: 4 }}>
                        {`${promptLength} characters`}
                    </Text>
                </Box>

                {promptLength === 0 && (
                    <Box>
                        <Text css={{ fontSize: '0.9rem', color: '$colors$subtle', marginBottom: 4 }}>
                            Suggested prompts:
                        </Text>
                        <Stack css={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {SUGGESTED_PROMPTS.map((suggestion, index) => (
                                <Badge
                                    key={index}
                                    colorPalette="gray"
                                    css={{ cursor: 'pointer', padding: '4px 10px', fontSize: '0.95rem', border: '1px solid $colors$border' }}
                                    onClick={() => setPrompt(suggestion)}
                                >
                                    {suggestion}
                                </Badge>
                            ))}
                        </Stack>
                    </Box>
                )}

                {mutation.isError && (
                    <ErrorAlert message={String((mutation.error as any)?.message ?? 'Failed to generate image')} />
                )}

                <Button
                    type="submit"
                    tone="primary"
                    disabled={mutation.isPending || promptLength < MIN_PROMPT_LENGTH}
                    css={{ minWidth: 100 }}
                >
                    {mutation.isPending ? 'Generating...' : 'Generate'}
                </Button>
            </Stack>
        </form>
    );
}

export default ImageTool;
