import React from 'react';
import { Paper, List, ListItem, ListItemButton, ListItemText, Divider, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function MetaTextList({ filteredMetaTexts, selectedMetaText, handleMetaTextClick }) {
    const navigate = useNavigate();
    const handleClick = (id) => {
        handleMetaTextClick(id);
        navigate(`/metaText/${id}`);
    };
    return (
        <Paper>
            <List>
                {filteredMetaTexts.length === 0 && (
                    <ListItem><ListItemText primary="No meta texts found." /></ListItem>
                )}
                {filteredMetaTexts.map((obj, idx) => {
                    // obj is now {id, title}
                    const id = obj.id;
                    const title = obj.title;
                    return (
                        <Grow in={true} timeout={350 + idx * 80} key={id}>
                            <div>
                                <ListItemButton onClick={() => handleClick(id)} selected={selectedMetaText === id}>
                                    <ListItemText primary={title} />
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
