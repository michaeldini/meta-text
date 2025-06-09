import React from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DeleteButton from '../components/DeleteButton';

/**
 * Generalized list for MetaText and SourceDoc items.
 * @param {Array} items - Array of objects with .id and .title
 * @param {Function} onItemClick - Called with id when item is clicked
 * @param {Function} onDeleteClick - Called with id and event when delete is clicked
 * @param {Object} deleteLoading - Map of id to loading state
 * @param {Object} deleteError - Map of id to error string
 * @param {string} emptyMessage - Message to show if no items
 */
export default function GeneralizedList({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    deleteError = {},
    emptyMessage = 'No items found.'
}) {
    return (
        <List>
            {items.length === 0 ? (
                <ListItem>
                    <ListItemText primary={emptyMessage} />
                </ListItem>
            ) : (
                items.map(obj => (
                    <React.Fragment key={obj.id}>
                        <ListItem disablePadding >
                            <ListItemButton onClick={() => onItemClick(obj.id)} >
                                <ListItemText primary={obj.title}
                                    slotProps={{ primary: { typography: 'h5' } }} />
                                <DeleteButton
                                    onClick={e => onDeleteClick(obj.id, e)}
                                    disabled={!!deleteLoading[obj.id]}
                                    label="Delete"
                                />
                            </ListItemButton>
                        </ListItem>
                        {deleteError[obj.id] && (
                            <ListItem>
                                <ListItemText
                                    primary={deleteError[obj.id]}
                                    slotProps={{ primary: { color: 'error', variant: 'body2' } }}
                                />
                            </ListItem>
                        )}
                    </React.Fragment>
                ))
            )}
        </List>
    );
}
