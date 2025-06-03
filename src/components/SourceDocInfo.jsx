import React from 'react';
import { Paper, Box, Typography, ListItem, Divider, Chip, Stack } from '@mui/material';

export default function SourceDocInfo({ doc, summaryError }) {
    // Parse details JSON string safely
    let details = undefined;
    if (doc.details) {
        try {
            details = typeof doc.details === 'string' ? JSON.parse(doc.details) : doc.details;
        } catch {
            details = undefined;
        }
    }

    // List of detail keys to display (excluding summary)
    const detailKeys = details ? Object.keys(details).filter(key => key !== 'summary') : [];

    return (
        <>
            <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 4 }}>
                {/* Summary row */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, p: 3, pl: 0, pr: 0, wordBreak: 'break-word', width: '100%', boxSizing: 'border-box' }}>
                    <strong>Summary:</strong> {details?.summary || 'No summary available.'}
                </Typography>
                {/* Details rows (dynamic) */}
                {details && (
                    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                        {detailKeys.map((key) => {
                            const value = details[key];
                            if (Array.isArray(value) && value.length > 0) {
                                return (
                                    <Stack key={key} direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></Typography>

                                        {value.map((item, i) => (
                                            <Chip key={i} label={item} size="small" />
                                        ))}
                                    </Stack>
                                );
                            }
                            return null;
                        })}
                    </Box>
                )}
                {summaryError && (
                    <ListItem>
                        <Typography color="error" variant="body2" sx={{ wordBreak: 'break-word', width: '100%' }}>{summaryError}</Typography>
                    </ListItem>
                )}
            </Paper>
            <Divider />
        </>
    );
}
