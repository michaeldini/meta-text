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
import { Box, Text, Button, Stack, TagRoot as Badge, Textarea } from '@styles';


// Constants for prompt validation
const MIN_PROMPT_LENGTH = 3;
const SUGGESTED_PROMPTS = [
    'A serene landscape with mountains',
    'Abstract geometric patterns',
    'Vintage illustration style',
    'Modern minimalist design',
    'Watercolor painting style',
];

// Use shared `Textarea` from stitches with the `emphasized` variant for dialog inputs


export interface ImageGenerationDialogProps {
    prompt: string;
    onPromptChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    error?: string | null;
}

export function ImageGenerationDialog({ prompt, onPromptChange, onSubmit, loading, error }: ImageGenerationDialogProps) {
    const promptLength = prompt.length;
    const isPromptValid = promptLength >= MIN_PROMPT_LENGTH;

    const handleSuggestedPromptClick = (suggestedPrompt: string) => {
        onPromptChange({
            target: { value: suggestedPrompt }
        } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <form onSubmit={onSubmit}>
            <Stack css={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
                <Box>
                    <Textarea
                        emphasized
                        value={prompt}
                        onChange={onPromptChange}
                        placeholder="Describe the image you want to generate in detail..."
                        disabled={loading}
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
                                    onClick={() => handleSuggestedPromptClick(suggestion)}
                                >
                                    {suggestion}
                                </Badge>
                            ))}
                        </Stack>
                    </Box>
                )}
                <Button
                    type="submit"
                    tone="primary"
                    disabled={loading || !isPromptValid}
                    css={{ minWidth: 100 }}
                >
                    {loading ? 'Generating...' : 'Generate'}
                </Button>
            </Stack>
        </form>
    );
}

export default ImageGenerationDialog;
