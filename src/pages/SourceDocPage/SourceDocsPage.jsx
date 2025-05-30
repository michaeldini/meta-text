import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSourceDocuments } from '../../hooks/useSourceDocuments';
import { uploadSourceDocument, fetchAiSummary } from '../../services/sourceDocumentService';
import SourceDocumentUploadForm from '../../components/SourceDocumentUploadForm';
import { TextField, Paper, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Box, Divider } from '@mui/material';

export default function SourceDocsPage() {
    const navigate = useNavigate();
    const { docs, loading, error } = useSourceDocuments();
    const [search, setSearch] = useState('');
    const [file, setFile] = useState(null);
    const [uploadLabel, setUploadLabel] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [summaries, setSummaries] = useState({});

    // Filtered docs by search
    const filteredDocs = useMemo(() => {
        if (!search) return docs;
        return docs.filter(doc => doc.label.toLowerCase().includes(search.toLowerCase()));
    }, [docs, search]);

    // Fetch AI summaries for visible docs
    React.useEffect(() => {
        filteredDocs.forEach(doc => {
            const label = doc.label;
            if (!summaries[label]) {
                fetchAiSummary(label).then(data => {
                    setSummaries(prev => ({ ...prev, [label]: data }));
                });
            }
        });
        // eslint-disable-next-line
    }, [filteredDocs]);

    const handleFileChange = e => {
        setFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleLabelChange = e => setUploadLabel(e.target.value);
    const handleSubmit = async e => {
        e.preventDefault();
        setUploadError('');
        setUploadSuccess('');
        setUploadLoading(true);
        try {
            await uploadSourceDocument(uploadLabel, file);
            setUploadSuccess('Upload successful!');
            setFile(null);
            setUploadLabel('');
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploadLoading(false);
        }
    };
    const handleDocClick = label => navigate(`/sourceDocs/${encodeURIComponent(label)}`);

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Source Documents</Typography>
            <Paper sx={{ p: 2, mb: 3 }}>
                <SourceDocumentUploadForm
                    file={file}
                    uploadLabel={uploadLabel}
                    uploadError={uploadError}
                    uploadSuccess={uploadSuccess}
                    uploadLoading={uploadLoading}
                    onFileChange={handleFileChange}
                    onLabelChange={handleLabelChange}
                    onSubmit={handleSubmit}
                />
            </Paper>
            <TextField
                label="Search Source Documents"
                variant="outlined"
                fullWidth
                value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ mb: 2 }}
            />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <Paper>
                    <List>
                        {filteredDocs.length === 0 && (
                            <ListItem><ListItemText primary="No documents found." /></ListItem>
                        )}
                        {filteredDocs.map(doc => (
                            <React.Fragment key={doc.label}>
                                <ListItemButton onClick={() => handleDocClick(doc.label)}>
                                    <ListItemText
                                        primary={doc.label}
                                        secondary={summaries[doc.label] ? summaries[doc.label].summary : 'No summary available.'}
                                    />
                                </ListItemButton>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}
