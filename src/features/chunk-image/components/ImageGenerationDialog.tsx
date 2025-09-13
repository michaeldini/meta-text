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
import { Box, Text, Button, Stack, TagRoot as Badge } from '@styles';
import { styled } from '@styles';


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
    error?: string | null;
}

export function ImageGenerationDialog(props: ImageGenerationDialogProps) {
    const { prompt, loading, onPromptChange, onSubmit } = props;
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
    const StyledTextarea = styled('textarea', {
        width: '100%',
        minHeight: 80,
        maxHeight: 180,
        padding: '8px',
        fontSize: '1rem',
        border: '1px solid $colors$border',
        borderRadius: 6,
        resize: 'vertical',
        outline: 'none',
        background: 'white',
        color: 'inherit',
        marginBottom: 4,
        '&:disabled': { background: '$colors$border' },
    });
    function PromptInput() {
        return (
            <Box>
                <StyledTextarea
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Describe the image you want to generate in detail..."
                    disabled={loading}
                    autoFocus
                    style={{ borderColor: isPromptTooLong ? '#e53e3e' : '#aaa' }}
                />
                <Text css={{ fontSize: '0.9rem', color: isPromptTooLong ? '#e53e3e' : '$colors$subtle', marginTop: 4 }}>
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
        );
    }

    return (
        <form onSubmit={onSubmit}>
            <Stack css={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
                <PromptInput />
                {promptLength === 0 ? <SuggestedPrompts /> : null}
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
