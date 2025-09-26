
import React from 'react';
import { Text } from '@styles';

interface ChunkPositionProps {
    position: number;
    visible: boolean;
}
/** Component to display the position of a chunk within the document.
 * 
 * @param position The position of the chunk (1-based index).
 * @param visible Whether to show the position. If false, renders nothing.
 * 
 * @returns A Text component displaying the chunk position, or null if not visible.
 */
export function ChunkPosition({ position, visible }: ChunkPositionProps) {
    if (!visible) return null;
    return (<Text>{position}</Text>
    );
};

export default ChunkPosition;
