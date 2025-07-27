// A basic review table component to display summaries, notes, and images for chunks

import React from 'react';
import { Table } from '@chakra-ui/react';
import { ImageDisplay } from 'features/chunk-image';
import { ChunkType } from 'types';

export interface ReviewTableProps {
    chunks: ChunkType[];
}

export default function ReviewTable({ chunks }: ReviewTableProps) {

    return (
        <Table.Root striped size="lg" stickyHeader interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Summary</Table.ColumnHeader>
                    <Table.ColumnHeader>Notes</Table.ColumnHeader>
                    <Table.ColumnHeader>Image</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {chunks.map(chunk => {
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
                })}
            </Table.Body>
        </Table.Root>
    );
}
