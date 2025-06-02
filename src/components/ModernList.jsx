import React from 'react';
import { Paper, List, ListItem, ListItemText } from '@mui/material';

/**
 * ModernList - A reusable, modern Material UI list component.
 * @param {Array} items - The array of items to render.
 * @param {function|Component} renderItem - Function or component to render each item. Receives (item, index).
 * @param {string} emptyMessage - Message to display when items is empty.
 * @param {object} listProps - Additional props for the MUI List component.
 * @param {object} paperProps - Additional props for the MUI Paper component.
 */
export default function ModernList({
    items = [],
    renderItem,
    emptyMessage = 'No items found.',
    listProps = {},
    paperProps = {},
}) {
    return (
        <Paper elevation={2} sx={{ borderRadius: 2, ...paperProps.sx }} {...paperProps}>
            <List {...listProps}>
                {items.length === 0 ? (
                    <ListItem>
                        <ListItemText primary={emptyMessage} />
                    </ListItem>
                ) : (
                    items.map((item, idx) => renderItem(item, idx))
                )}
            </List>
        </Paper>
    );
}
