import React from 'react';
import { Paper, List, ListItem, ListItemText, Box, Alert } from '@mui/material';
import SourceDocDetails from './SourceDocDetails';
import DeleteButton from './DeleteButton';
import aiStars from '../assets/ai-stars.png';

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
                {docs.map(doc => (
                    <React.Fragment key={doc.id}>
                        <ListItem disablePadding>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <SourceDocDetails
                                    doc={doc}
                                    summaryError={summaryError[doc.id]}
                                    onGenerateSummary={onGenerateSummary}
                                    summaryLoading={summaryLoading[doc.id]}
                                    aiIcon={<img src={aiStars} alt="AI" style={{ height: 18 }} />}
                                />
                                <DeleteButton
                                    onClick={e => { e.stopPropagation(); onDelete(doc.id); }}
                                    disabled={deleteLoading[doc.id]}
                                    label="Delete Source Document"
                                />
                            </Box>
                        </ListItem>
                        {deleteError[doc.id] && (
                            <ListItem>
                                <Alert severity="error">{deleteError[doc.id]}</Alert>
                            </ListItem>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
}
