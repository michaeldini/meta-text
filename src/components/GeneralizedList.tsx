import React from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import DeleteButton from '../components/DeleteButton';

export interface GeneralizedListItem {
    id: string | number;
    title: string;
}

export interface GeneralizedListProps {
    items: GeneralizedListItem[];
    onItemClick: (id: string | number) => void;
    onDeleteClick: (id: string | number, event: React.MouseEvent<HTMLButtonElement>) => void;
    deleteLoading?: Record<string | number, boolean>;
    deleteError?: Record<string | number, string>;
    emptyMessage?: string;
}

const GeneralizedList: React.FC<GeneralizedListProps> = ({
    items = [],
    onItemClick,
    onDeleteClick,
    deleteLoading = {},
    deleteError = {},
    emptyMessage = 'No items found.'
}) => {
    return (
        <List data-testid="generalized-list">
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
};

export default GeneralizedList;
