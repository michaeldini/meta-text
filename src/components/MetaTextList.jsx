import React from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';

function MetaTextList({ filteredMetaTexts, selectedMetaText, handleMetaTextClick }) {
    return (
        <Paper>
            <List>
                {filteredMetaTexts.length === 0 && (
                    <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                )}
                {filteredMetaTexts.map(obj => {
                    const name = obj.name || obj;
                    return (
                        <React.Fragment key={name}>
                            <ListItemButton onClick={() => handleMetaTextClick(name)} selected={selectedMetaText === name}>
                                <ListItemText primary={name} />
                            </ListItemButton>
                            <Divider />
                        </React.Fragment>
                    );
                })}
            </List>
        </Paper>
    );
}

export default MetaTextList;
