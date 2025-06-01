import React from 'react';
import { Paper, List, ListItem, ListItemText } from '@mui/material';
import SourceDocListItem from './SourceDocListItem';

export default function SourceDocList({
    docs,
    summaryError,
    onGenerateSummary,
    summaryLoading,
    deleteLoading,
    deleteError,
    onDelete
}) {
    return (
        <Paper>
            <List>
                {docs.length === 0 && (
                    <ListItem><ListItemText primary="No documents found." /></ListItem>
                )}
                {docs.map((doc) => (
                    <SourceDocListItem
                        key={doc.id}
                        doc={doc}
                        summaryError={summaryError}
                        onGenerateSummary={onGenerateSummary}
                        summaryLoading={summaryLoading}
                        deleteLoading={deleteLoading}
                        deleteError={deleteError}
                        onDelete={onDelete}
                    />
                ))}
            </List>
        </Paper>
    );
}
