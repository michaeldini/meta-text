import React from 'react';
import { Box, Typography, ListItem, ListItemText, Divider, ListItemButton, Chip, Stack } from '@mui/material';
export default function SourceDocDetails({ doc, summaryError }) {


    // Parse details JSON string safely
    let details = undefined;
    if (doc.details) {
        try {
            details = typeof doc.details === 'string' ? JSON.parse(doc.details) : doc.details;
        } catch {
            details = undefined;
        }
    }

    return (
        <>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Summary row */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Summary:</strong> {details?.summary || 'No summary available.'}
                </Typography>
                {/* Details rows */}
                {details && (
                    <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>

                        {details.characters && Array.isArray(details.characters) && details.characters.length > 0 && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary"><strong>Characters:</strong></Typography>
                                {details.characters.map((c, i) => (
                                    <Chip key={i} label={c} size="small" />
                                ))}
                            </Stack>
                        )}
                        {details.locations && Array.isArray(details.locations) && details.locations.length > 0 && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary"><strong>Locations:</strong></Typography>
                                {details.locations.map((l, i) => (
                                    <Chip key={i} label={l} size="small" />
                                ))}
                            </Stack>
                        )}
                        {details.themes && Array.isArray(details.themes) && details.themes.length > 0 && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary"><strong>Themes:</strong></Typography>
                                {details.themes.map((t, i) => (
                                    <Chip key={i} label={t} size="small" />
                                ))}
                            </Stack>
                        )}
                        {details.symbols && Array.isArray(details.symbols) && details.symbols.length > 0 && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary"><strong>Symbols:</strong></Typography>
                                {details.symbols.map((s, i) => (
                                    <Chip key={i} label={s} size="small" />
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
                {summaryError && (
                    <ListItem>
                        <Typography color="error" variant="body2">{summaryError}</Typography>
                    </ListItem>
                )}
            </Box>
            <Divider />
        </>
    );
}
