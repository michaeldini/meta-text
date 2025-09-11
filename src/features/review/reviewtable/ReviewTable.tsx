// A basic review table component to display summaries, notes, and images for chunks


// A basic review table component to display summaries, notes, and images for chunks
// ReviewTable migrated from Chakra UI to Stitches
import React from 'react';
import { Box, Flex, Text, Panel } from '@styles';
import { styled } from '@styles';
import { ChunkType } from '@mtypes/documents';

// Table primitives using Stitches
const TableRoot = styled('div', {
    width: '100%',
    borderCollapse: 'collapse',
    overflowX: 'auto',
});

const TableHeader = styled('div', {
    display: 'flex',
    background: '#f6f6f6',
    fontWeight: 600,
    borderBottom: '1px solid #eaeaea',
});

const TableRow = styled('div', {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #eaeaea',
    '&:last-child': { borderBottom: 'none' },
});

const TableCell = styled('div', {
    flex: 1,
    padding: '12px',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
});

const TableColumnHeader = styled(TableCell, {
    fontWeight: 700,
    background: '#f6f6f6',
});

const TableBody = styled('div', {
    width: '100%',
});

const TableImage = styled('img', {
    height: '100px',
    width: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    background: '#eee',
});

// Table header for the review table
function ReviewTableHeader() {
    return (
        <TableHeader>
            <TableColumnHeader>Summary</TableColumnHeader>
            <TableColumnHeader>Notes</TableColumnHeader>
            <TableColumnHeader>Image</TableColumnHeader>
        </TableHeader>
    );
}

// Table row for a single chunk
function ReviewTableRow({ chunk }: { chunk: ChunkType }) {
    const latestImage = chunk.images && chunk.images.length > 0
        ? chunk.images[chunk.images.length - 1]
        : null;
    return (
        <TableRow key={chunk.id}>
            <TableCell>{chunk.summary}</TableCell>
            <TableCell>{chunk.note}</TableCell>
            <TableCell>
                {latestImage && (
                    <TableImage
                        src={`/${latestImage.path}`}
                        alt={latestImage.prompt}
                    />
                )}
            </TableCell>
        </TableRow>
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
                <TableBody>
                    {chunks.map(chunk => (
                        <ReviewTableRow key={chunk.id} chunk={chunk} />
                    ))}
                </TableBody>
            </TableRoot>
        </Panel>
    );
}
