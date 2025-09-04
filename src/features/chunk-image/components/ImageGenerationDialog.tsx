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
import { Button } from '@chakra-ui/react/button';
import { Textarea } from '@chakra-ui/react/textarea';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import { Stack } from '@chakra-ui/react/stack';
import { Badge } from '@chakra-ui/react/badge';


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
    prompt: string;
    onPromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error: string | null;
}

export function ImageGenerationDialog(props: ImageGenerationDialogProps) {
    const { prompt, loading, error, onPromptChange, onSubmit } = props;
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
    function PromptInput() {
        return (
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
    }

    function SuggestedPrompts() {
        return (
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
    }

    return (

        <form onSubmit={onSubmit}>
            <Stack direction="column" align="stretch" gap={4}>
                <PromptInput />
                {promptLength === 0 ? <SuggestedPrompts /> : null}
                <Button
                    type="submit"
                    colorScheme="blue"
                    disabled={loading || !isPromptValid}
                    minW={100}
                    loading={loading}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </Button>

            </Stack>
        </form>
    );
}

export default ImageGenerationDialog;
