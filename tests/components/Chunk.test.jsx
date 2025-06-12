import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Chunk from '../../src/features/Chunk';
import '@testing-library/jest-dom';
import * as useImageGenerationModule from '../../src/hooks/useImageGeneration';

// Mock dependencies
vi.mock('../../src/features/ChunkWords', () => ({
    default: (props) => <div data-testid="chunk-words">Words {props.chunkIdx}</div>
}));
vi.mock('../../src/features/ChunkComparison', () => ({
    default: (props) => <div data-testid="chunk-comparison">Comparison {props.chunkId}</div>
}));
vi.mock('../../src/components/ChunkTextField', () => ({
    default: (props) => (
        <input
            data-testid={`chunk-textfield-${props.label}`}
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
        />
    )
}));
vi.mock('../../src/components/GenerateImageButton', () => ({
    default: (props) => (
        <button data-testid="generate-image-btn" onClick={props.onClick} disabled={props.disabled} />
    )
}));
vi.mock('../../src/components/ChunkImageDisplay', () => ({
    default: (props) => <img data-testid="chunk-image" src={props.imgSrc} alt="chunk" />
}));
vi.mock('../../src/components/GenerateImageDialog', () => ({
    default: (props) => props.open ? <div data-testid="generate-image-dialog">Dialog</div> : null
}));
vi.mock('../../src/hooks/useDebouncedField', () => ({
    useDebouncedField: (initial) => [initial, vi.fn()]
}));
vi.mock('../../src/hooks/useImageGeneration', () => ({
    useImageGeneration: () => ({
        imageState: { loading: false, error: null, data: null, dialogOpen: false, prompt: '', loaded: false, lightboxOpen: false },
        getImgSrc: () => 'test.png',
        openDialog: vi.fn(),
        closeDialog: vi.fn(),
        handleGenerate: vi.fn(),
        setLightboxOpen: vi.fn(),
        setImageLoaded: vi.fn(),
    })
}));
vi.mock('../../src/utils/logger', () => ({
    default: { info: vi.fn(), error: vi.fn() }
}));

describe('Chunk component', () => {
    let baseProps;
    beforeEach(() => {
        baseProps = {
            chunk: {
                id: 1,
                content: 'word1 word2 word3',
                summary: 'summary',
                notes: 'notes',
                comparison: 'comparison',
                ai_image: { created_at: '2025-06-12' }
            },
            chunkIdx: 0,
            handleWordClick: vi.fn(),
            handleRemoveChunk: vi.fn(),
            handleChunkFieldChange: vi.fn(),
        };
    });

    it('renders chunk words and details', () => {
        render(<Chunk {...baseProps} />);
        expect(screen.getByTestId('chunk-words')).toBeInTheDocument();
        expect(screen.getByTestId('chunk-comparison')).toBeInTheDocument();
        expect(screen.getByTestId('chunk-textfield-Summary')).toBeInTheDocument();
        expect(screen.getByTestId('chunk-textfield-Notes')).toBeInTheDocument();
    });

    it('calls handleChunkFieldChange on blur for summary and notes', () => {
        render(<Chunk {...baseProps} />);
        const summaryField = screen.getByTestId('chunk-textfield-Summary');
        const notesField = screen.getByTestId('chunk-textfield-Notes');
        fireEvent.blur(summaryField);
        fireEvent.blur(notesField);
        expect(baseProps.handleChunkFieldChange).toHaveBeenCalledWith(0, 'summary', 'summary');
        expect(baseProps.handleChunkFieldChange).toHaveBeenCalledWith(0, 'notes', 'notes');
    });

    it('renders generate image button and dialog', () => {
        render(<Chunk {...baseProps} />);
        expect(screen.getByText('Generate Image')).toBeInTheDocument();
        // Dialog should not be open by default
        expect(screen.queryByTestId('generate-image-dialog')).toBeNull();
    });
    it('renders image display if imageState.data is present', () => {
        // Patch useImageGeneration to return data
        vi.spyOn(useImageGenerationModule, 'useImageGeneration').mockReturnValue({
            imageState: { loading: false, error: null, data: true, dialogOpen: false, prompt: '', loaded: false, lightboxOpen: false },
            getImgSrc: () => 'test.png',
            openDialog: vi.fn(),
            closeDialog: vi.fn(),
            handleGenerate: vi.fn(),
            setLightboxOpen: vi.fn(),
            setImageLoaded: vi.fn(),
        });
        render(<Chunk {...baseProps} />);
        expect(screen.getByTestId('chunk-image')).toBeInTheDocument();
    });
});

