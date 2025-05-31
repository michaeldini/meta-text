import React from 'react';
import { Box, Typography, ListItem, ListItemText, Divider, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GenerateSummaryButton from './GenerateSummaryButton';

export default function SourceDocDetails({ doc, summaryError, onGenerateSummary, summaryLoading, aiIcon }) {
    const navigate = useNavigate();
    const handleDocClick = () => navigate(`/sourceDocs/${encodeURIComponent(doc.id)}`);
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 0 }}>
                <ListItemButton sx={{ pl: 2, flex: 1 }} onClick={handleDocClick}>
                    <ListItemText
                        primary={doc.title}
                        secondary={doc.details?.summary || 'No summary available.'}
                    />
                </ListItemButton>
            </Box>
            {/* Display other attributes */}
            {doc.details && (
                <Box sx={{ p: 2, gap: 1, display: 'flex', flexDirection: 'column' }}>
                    {Object.entries(doc.details)
                        .filter(([key]) => key !== 'summary')
                        .map(([key, value]) => (
                            <Typography key={key} variant="body2" color="text.secondary">
                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
                            </Typography>
                        ))}
                    <GenerateSummaryButton
                        loading={summaryLoading}
                        onClick={e => { e.stopPropagation(); onGenerateSummary(doc.id); }}
                        icon={aiIcon}
                    >
                        Generate Summary
                    </GenerateSummaryButton>
                </Box>
            )}
            {summaryError && (
                <ListItem>
                    <Typography color="error" variant="body2">{summaryError}</Typography>
                </ListItem>
            )}
            <Divider />
        </>
    );
}
