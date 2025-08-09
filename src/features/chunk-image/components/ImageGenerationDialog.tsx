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
import { Button, CloseButton } from '@chakra-ui/react/button';
import { Drawer } from '@chakra-ui/react/drawer';
import { Textarea } from '@chakra-ui/react/textarea';
import { Box } from '@chakra-ui/react/box';
import { Spinner } from '@chakra-ui/react/spinner';
import { Text } from '@chakra-ui/react/text';
import { Stack } from '@chakra-ui/react/stack';
import { Badge } from '@chakra-ui/react/badge';
import { Portal } from '@chakra-ui/react/portal';


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


export interface ImageGenerationDialogProps {
    open: boolean;
    onClose: () => void;
    prompt: string;
    onPromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error: string | null;
}

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

    // Subcomponents
    const PromptInput = () => (
        <Box>
            <Textarea
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Describe the image you want to generate in detail..."
                minH="80px"
                maxH="180px"
                disabled={loading}
                borderColor={isPromptTooLong ? 'red.500' : "fg.info"}
                autoFocus
                resize="vertical"
            />
            <Text fontSize="sm" color={isPromptTooLong ? 'red.500' : 'gray.500'} mt={1}>
                {isPromptTooLong
                    ? `Prompt is too long (${promptLength}/${MAX_PROMPT_LENGTH} characters)`
                    : `${promptLength}/${MAX_PROMPT_LENGTH} characters`}
            </Text>
        </Box>
    );

    const SuggestedPrompts = () => (
        <Box>
            <Text fontSize="sm" color="gray.500" mb={1}>
                Suggested prompts:
            </Text>
            <Stack direction="row" flexWrap="wrap" gap={2}>
                {SUGGESTED_PROMPTS.map((suggestion, index) => (
                    <Badge
                        key={index}
                        variant="outline"
                        color="fg"
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
    );

    // const LoadingIndicator = () => (
    //     <Box textAlign="center">
    //         <Text fontSize="sm" color="gray.500" mb={2}>
    //             Generating your image...
    //         </Text>
    //         <Spinner size="md" color="blue.500" />
    //     </Box>
    // );

    const ErrorMessage = () => (
        <Box mt={2} borderRadius="md" bg="red.50" p={3} color="red.700">
            <Text fontWeight="bold" mb={1}>Error</Text>
            <Text>{error}</Text>
        </Box>
    );

    const FooterButtons = () => (
        <>
            {/* <Button onClick={onClose} disabled={loading} variant="ghost" mr={2}>
                Cancel
            </Button> */}
            <Button
                type="submit"
                colorScheme="blue"
                disabled={loading || !isPromptValid}
                minW={100}
                loading={loading}
            >
                {loading ? 'Generating...' : 'Generate'}
            </Button>
            <Drawer.CloseTrigger asChild>
                <CloseButton />
            </Drawer.CloseTrigger>
        </>
    );

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
                                    <PromptInput />
                                    {promptLength === 0 && <SuggestedPrompts />}
                                    {/* {loading && <LoadingIndicator />} */}
                                    {error && <ErrorMessage />}
                                </Stack>
                            </Drawer.Body>
                            <Drawer.Footer>
                                <FooterButtons />
                            </Drawer.Footer>
                        </form>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default ImageGenerationDialog;

/**
dialogue showed error, but main page showed image when it was done. check the response types
2025-08-09 14:27:12.322 | INFO     | backend.services.ai_service:generate_image:182 - Generating AI image for prompt: 'Abstract geometric patterns' and chunk_id: 725
2025-08-09 14:27:12.322 | DEBUG    | backend.services.openai_service:generate_image:178 - Generating image for prompt: 'Abstract geometric patterns...'
2025-08-09 14:27:31.074 | DEBUG    | backend.services.openai_service:generate_image:204 - Image generated successfully
2025-08-09 14:27:31.074 | DEBUG    | backend.services.file_service:save_base64_image:54 - Saving image to: /Users/michaeldini/Dev/meta-text/backend/api/../../public/generated_images/ai_image_20250809182731074587.png
2025-08-09 14:27:31.082 | INFO     | backend.services.file_service:save_base64_image:64 - Image saved successfully: generated_images/ai_image_20250809182731074587.png
2025-08-09 14:27:31.087 | INFO     | backend.services.ai_service:generate_image:199 - AI image generated and saved: generated_images/ai_image_20250809182731074587.png (chunk_id=725)
2025-08-09 14:27:31.090 | ERROR    | backend.api.logs:frontend_log:17 - [FRONTEND] [127.0.0.1] Request timed out: POST http://localhost:5173/api/generate-image
INFO:     127.0.0.1:59188 - "POST /api/frontend-log HTTP/1.1" 200 OK
INFO:     127.0.0.1:59183 - "POST /api/generate-image HTTP/1.1" 200 OK
 */