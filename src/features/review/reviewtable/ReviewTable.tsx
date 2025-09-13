// A basic review table component to display summaries, notes, and images for chunks


// A basic review table component to display summaries, notes, and images for chunks
// ReviewTable migrated from Chakra UI to Stitches
import React from 'react';
import { Panel, TableRoot, THead, TRow, Th, TBody } from '@styles';
import { ChunkType } from '@mtypes/documents';

// ...existing code...

// Table header for the review table
function ReviewTableHeader() {
    return (
        <THead>
            <TRow>
                <Th>Summary</Th>
                <Th>Notes</Th>
                <Th>Image</Th>
            </TRow>
        </THead>
    );
}

// Table row for a single chunk
function ReviewTableRow({ chunk }: { chunk: ChunkType }) {
    const latestImage = chunk.images && chunk.images.length > 0
        ? chunk.images[chunk.images.length - 1]
        : null;
    return (
        <TRow key={chunk.id}>
            <td>{chunk.summary}</td>
            <td>{chunk.note}</td>
            <td>
                {latestImage && (
                    <img
                        src={`/${latestImage.path}`}
                        alt={latestImage.prompt}
                        style={{ height: '100px', width: '100px', objectFit: 'cover', borderRadius: '8px', background: '#eee' }}
                    />
                )}
            </td>
        </TRow>
    );
}

export interface ReviewTableProps {
    chunks: ChunkType[];
}

export default function ReviewTable({ chunks }: ReviewTableProps) {
    return (
        <Panel css={{ padding: 0 }}>
            <TableRoot>
                <ReviewTableHeader />
                <TBody>
                    {chunks.map(chunk => (
                        <ReviewTableRow key={chunk.id} chunk={chunk} />
                    ))}
                </TBody>
            </TableRoot>
        </Panel>
    );
}
