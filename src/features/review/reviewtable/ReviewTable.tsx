// A basic review table component to display summaries, notes, and images for chunks


// A basic review table component to display summaries, notes, and images for chunks
import React from 'react';
import { Table } from '@chakra-ui/react';
import { ImageDisplay } from 'features/chunk-image';
import { ChunkType } from 'types';

// Table header for the review table
function ReviewTableHeader() {
    return (
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader>Summary</Table.ColumnHeader>
                <Table.ColumnHeader>Notes</Table.ColumnHeader>
                <Table.ColumnHeader>Image</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
    );
}

// Table row for a single chunk
function ReviewTableRow({ chunk }: { chunk: ChunkType }) {
    const latestImage = chunk.images && chunk.images.length > 0
        ? chunk.images[chunk.images.length - 1]
        : null;
    return (
        <Table.Row key={chunk.id}>
            <Table.Cell>{chunk.summary}</Table.Cell>
            <Table.Cell>{chunk.note}</Table.Cell>
            <Table.Cell>
                {latestImage && (
                    <ImageDisplay
                        src={`/${latestImage.path}`}
                        alt={latestImage.prompt}
                        height="100px"
                        showModal={true}
                    />
                )}
            </Table.Cell>
        </Table.Row>
    );
}

export interface ReviewTableProps {
    chunks: ChunkType[];
}

export default function ReviewTable({ chunks }: ReviewTableProps) {
    return (
        <Table.Root striped size="lg" stickyHeader interactive>
            <ReviewTableHeader />
            <Table.Body>
                {chunks.map(chunk => (
                    <ReviewTableRow key={chunk.id} chunk={chunk} />
                ))}
            </Table.Body>
        </Table.Root>
    );
}
