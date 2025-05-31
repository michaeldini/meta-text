import React from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider, Grow } from '@mui/material';

function MetaTextList({ filteredMetaTexts, selectedMetaText, handleMetaTextClick }) {
    return (
        <Paper>
            <List>
                {filteredMetaTexts.length === 0 && (
                    <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                )}
                {filteredMetaTexts.map((obj, idx) => {
                    const name = obj.name || obj;
                    return (
                        <Grow in={true} timeout={350 + idx * 80} key={name}>
                            <div>
                                <ListItemButton onClick={() => handleMetaTextClick(name)} selected={selectedMetaText === name}>
                                    <ListItemText primary={name} />
                                </ListItemButton>
                                <Divider />
                            </div>
                        </Grow>
                    );
                })}
            </List>
        </Paper>
    );
}

export default MetaTextList;
