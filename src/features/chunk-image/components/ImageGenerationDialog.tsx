/**
 * ImageGenerationDialog Component
 * 
 * A modal dialog for inputting image generation prompts with enhanced UX features.
 * Provides real-time validation, character counting, and improved accessibility.
 */
/**
 * ImageGenerationDialog Component
 *
 * A modal dialog for inputting image generation prompts with enhanced UX features.
 * Provides real-time validation, character counting, and improved accessibility.
 * Uses Chakra UI v3 components.
 */
import React from 'react';
import {
    Button,
    Drawer,
    Textarea,
    Box,
    Spinner,
    Text,
    Stack,
    Badge,
    Portal,
} from '@chakra-ui/react';
import type { ImageGenerationDialogProps } from 'features/chunk-shared/types';

// Constants for prompt validation
const MIN_PROMPT_LENGTH = 3;
const MAX_PROMPT_LENGTH = 1000;
const SUGGESTED_PROMPTS = [
    'A serene landscape with mountains',
    'Abstract geometric patterns',
    'Vintage illustration style',
    'Modern minimalist design',
    'Watercolor painting style',
];


export function ImageGenerationDialog(props: ImageGenerationDialogProps) {
    const { open, prompt, loading, error, onClose, onPromptChange, onSubmit } = props;
    const promptLength = prompt.length;
    const isPromptValid = promptLength >= MIN_PROMPT_LENGTH && promptLength <= MAX_PROMPT_LENGTH;
    const isPromptTooLong = promptLength > MAX_PROMPT_LENGTH;

    // Accept both input and textarea change events
    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onPromptChange({
            target: { value: e.target.value }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleSuggestedPromptClick = (suggestedPrompt: string) => {
        onPromptChange({
            target: { value: suggestedPrompt }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    const borderColor = 'gray.200';

    return (
        <Drawer.Root open={open} onOpenChange={(e) => onClose()}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Generate AI Image</Drawer.Title>
                        </Drawer.Header>
                        <form onSubmit={onSubmit}>
                            <Drawer.Body>
                                <Stack direction="column" align="stretch" gap={4}>
                                    <Box>
                                        <Textarea
                                            value={prompt}
                                            onChange={handlePromptChange}
                                            placeholder="Describe the image you want to generate in detail..."
                                            minH="80px"
                                            maxH="180px"
                                            disabled={loading}
                                            borderColor={isPromptTooLong ? 'red.500' : borderColor}
                                            autoFocus
                                            resize="vertical"
                                        />
                                        <Text fontSize="sm" color={isPromptTooLong ? 'red.500' : 'gray.500'} mt={1}>
                                            {isPromptTooLong
                                                ? `Prompt is too long (${promptLength}/${MAX_PROMPT_LENGTH} characters)`
                                                : `${promptLength}/${MAX_PROMPT_LENGTH} characters`}
                                        </Text>
                                    </Box>

                                    {/* Suggested prompts */}
                                    {promptLength === 0 && (
                                        <Box>
                                            <Text fontSize="sm" color="gray.500" mb={1}>
                                                Suggested prompts:
                                            </Text>
                                            <Stack direction="row" flexWrap="wrap" gap={2}>
                                                {SUGGESTED_PROMPTS.map((suggestion, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        colorScheme="blue"
                                                        px={2}
                                                        py={1}
                                                        cursor="pointer"
                                                        onClick={() => handleSuggestedPromptClick(suggestion)}
                                                    >
                                                        {suggestion}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        </Box>
                                    )}

                                    {loading && (
                                        <Box textAlign="center">
                                            <Text fontSize="sm" color="gray.500" mb={2}>
                                                Generating your image...
                                            </Text>
                                            <Spinner size="md" color="blue.500" />
                                        </Box>
                                    )}

                                    {error && (
                                        <Box mt={2} borderRadius="md" bg="red.50" p={3} color="red.700">
                                            <Text fontWeight="bold" mb={1}>Error</Text>
                                            <Text>{error}</Text>
                                        </Box>
                                    )}
                                </Stack>
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Button onClick={onClose} disabled={loading} variant="ghost" mr={2}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    disabled={loading || !isPromptValid}
                                    minW={100}
                                >
                                    {loading ? 'Generating...' : 'Generate'}
                                </Button>
                                <Drawer.CloseTrigger asChild>
                                    <Button variant="ghost" size="sm" ml={2}>
                                        Close
                                    </Button>
                                </Drawer.CloseTrigger>
                            </Drawer.Footer>
                        </form>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default ImageGenerationDialog;
