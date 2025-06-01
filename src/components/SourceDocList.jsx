import React from 'react';
import { Paper, List, ListItem, ListItemText, Box, Alert, Tooltip } from '@mui/material';
import SourceDocDetails from './SourceDocDetails';
import DeleteButton from './DeleteButton';
import GenerateSummaryButton from './GenerateSummaryButton';
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
                                />
                                <Box sx={{ flexGrow: 1, flexDirection: 'column' }}>
                                    <Tooltip title="Generate or update the summary for this document" arrow>
                                        <span>
                                            <GenerateSummaryButton
                                                loading={summaryLoading[doc.id]}
                                                onClick={e => { e.stopPropagation(); onGenerateSummary(doc.id); }}
                                                icon={<img src={aiStars} alt="AI" />}
                                                size="small"
                                            />
                                        </span>
                                    </Tooltip>
                                    <DeleteButton
                                        onClick={e => { e.stopPropagation(); onDelete(doc.id); }}
                                        disabled={deleteLoading[doc.id]}
                                        label="Delete Source Document"
                                    />
                                </Box>

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
