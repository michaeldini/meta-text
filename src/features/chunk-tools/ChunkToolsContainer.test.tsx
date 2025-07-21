// Test for ChunkToolsContainer
// Verifies conditional rendering of tool components and always-visible tools

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChunkToolsContainer from './ChunkToolsContainer';

// Mock subcomponents to simplify test output
vi.mock('../chunk-note/NotesTool', () => ({ default: () => <div data-testid="NotesTool" /> }));
vi.mock('../chunk-evaluation/EvaluationTool', () => ({ default: () => <div data-testid="EvaluationTool" /> }));
vi.mock('../chunk-image/ImageTool', () => ({ default: () => <div data-testid="ImageTool" /> }));
vi.mock('../chunk-rewrite/RewriteDisplayTool', () => ({ default: () => <div data-testid="RewriteDisplayTool" /> }));
vi.mock('../chunk-explanation/ExplanationTool', () => ({ default: () => <div data-testid="ExplanationTool" /> }));
vi.mock('features/chunk-copy', () => ({ CopyTool: () => <div data-testid="CopyTool" /> }));
vi.mock('../chunk-bookmark/ChunkBookmarkToggle', () => ({ default: () => <div data-testid="ChunkBookmarkToggle" /> }));
vi.mock('../chunk-favorite/ChunkFavoriteToggle', () => ({ default: () => <div data-testid="ChunkFavoriteToggle" /> }));
vi.mock('../chunk/Chunk.styles', () => ({ getChunkComponentsStyles: () => ({ chunkTabsContainer: {}, alwaysVisibleToolContainer: {} }) }));
vi.mock('components', () => ({ ErrorBoundary: ({ children }: any) => <>{children}</>, LoadingBoundary: ({ children }: any) => <>{children}</> }));

const baseChunk = { id: '1', text: 'Sample chunk text' } as any;
const noop = () => { };

describe('ChunkToolsContainer', () => {
    it('renders always-visible tools', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={[]}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('copy-tool')).toBeInTheDocument();
        expect(screen.getByTestId('ChunkBookmarkToggle')).toBeInTheDocument();
        expect(screen.getByTestId('ChunkFavoriteToggle')).toBeInTheDocument();
    });

    it('renders NotesTool when activeTools includes note-summary', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['note-summary'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('NotesTool')).toBeInTheDocument();
    });

    it('renders EvaluationTool when activeTools includes evaluation', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['evaluation'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('EvaluationTool')).toBeInTheDocument();
    });

    it('renders ImageTool when activeTools includes image', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['image'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('ImageTool')).toBeInTheDocument();
    });

    it('renders RewriteDisplayTool when activeTools includes rewrite', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['rewrite'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('RewriteDisplayTool')).toBeInTheDocument();
    });

    it('renders ExplanationTool when activeTools includes explanation', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['explanation'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('ExplanationTool')).toBeInTheDocument();
    });

    it('renders multiple tools if multiple activeTools are present', () => {
        render(
            <ChunkToolsContainer
                chunk={baseChunk}
                activeTools={['note-summary', 'evaluation', 'image', 'rewrite', 'explanation'] as any}
                updateChunkField={noop}
            />
        );
        expect(screen.getByTestId('NotesTool')).toBeInTheDocument();
        expect(screen.getByTestId('EvaluationTool')).toBeInTheDocument();
        expect(screen.getByTestId('ImageTool')).toBeInTheDocument();
        expect(screen.getByTestId('RewriteDisplayTool')).toBeInTheDocument();
        expect(screen.getByTestId('ExplanationTool')).toBeInTheDocument();
    });
});
