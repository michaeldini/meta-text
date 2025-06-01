import React from 'react';
import { Paper, List, ListItem, ListItemText, Box, Alert, Tooltip, Typography } from '@mui/material';
import SourceDocDetails from './SourceDocDetails';
import DeleteButton from './DeleteButton';
import GenerateSourceDocInfoButton from './GenerateSummaryButton';
import aiStars from '../assets/ai-stars.png';
import { useNavigate } from 'react-router-dom';

export default function SourceDocList({
    docs,
    summaryError,
    onGenerateSummary,
    summaryLoading,
    deleteLoading,
    deleteError,
    onDelete
}) {
    const navigate = useNavigate();
    return (
        <Paper>
            <List>
                {docs.length === 0 && (
                    <ListItem><ListItemText primary="No documents found." /></ListItem>
                )}
                {docs.map(doc => (
                    <React.Fragment key={doc.id}>
                        <ListItem disablePadding>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            flex: 1,
                                            cursor: 'pointer',
                                            transition: 'color 0.2s, transform 0.2s',
                                            '&:hover': {
                                                color: 'primary.main',
                                                transform: 'translateY(-2px) scale(1.03)',
                                                textDecoration: 'underline',
                                            },
                                        }}
                                        onClick={() => navigate(`/sourceDocs/${encodeURIComponent(doc.id)}`)}
                                        noWrap={false}
                                    >
                                        {doc.title}
                                    </Typography>
                                    <GenerateSourceDocInfoButton
                                        loading={summaryLoading[doc.id]}
                                        onClick={e => { e.stopPropagation(); onGenerateSummary(doc.id); }}
                                        icon={<img src={aiStars} alt="AI" />}
                                        label="Generate Summary"
                                    />
                                    <DeleteButton
                                        onClick={e => { e.stopPropagation(); onDelete(doc.id); }}
                                        disabled={deleteLoading[doc.id]}
                                        label="Delete Source Document"
                                    />
                                </Box>
                                <SourceDocDetails
                                    doc={doc}
                                    summaryError={summaryError[doc.id]}
                                />

                            </Box>
                        </ListItem>
                        {
                            deleteError[doc.id] && (
                                <ListItem>
                                    <Alert severity="error">{deleteError[doc.id]}</Alert>
                                </ListItem>
                            )
                        }
                    </React.Fragment>
                ))}
            </List>
        </Paper >
    );
}
