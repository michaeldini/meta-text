import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';

export default function WordActionDialog({ open, onClose, word, onSplit, onLookupDefinition, onLookupContext }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Word Actions</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    What would you like to do with <b>{word}</b>?
                </Typography>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onSplit}>
                            <ListItemText primary="Split text here" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onLookupDefinition} disabled>
                            <ListItemText primary="Look up word definition" secondary="Coming soon" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={onLookupContext} disabled>
                            <ListItemText primary="Look up word in context" secondary="Coming soon" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}
