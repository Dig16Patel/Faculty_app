import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  Link as LinkIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './PublicationManagement.css';

const PublicationManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [publications, setPublications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [newPublication, setNewPublication] = useState({
    title: '',
    authors: [],
    type: 'journal',
    journal: '',
    conference: '',
    date: '',
    doi: '',
    impactFactor: '',
    department: '',
    faculty: '',
    isScopusIndexed: false,
    isWebOfScienceIndexed: false,
    url: '',
    abstract: '',
  });

  useEffect(() => {
    fetchPublications();
    fetchDepartments();
    fetchFaculty();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/publications');
      setPublications(response.data);
    } catch (err) {
      setError('Failed to fetch publications');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/admin/departments');
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('/api/admin/faculty');
      setFaculty(response.data);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
    }
  };

  const handleOpenDialog = (publication = null) => {
    if (publication) {
      setEditingPublication(publication);
      setNewPublication(publication);
    } else {
      setEditingPublication(null);
      setNewPublication({
        title: '',
        authors: [],
        type: 'journal',
        journal: '',
        conference: '',
        date: '',
        doi: '',
        impactFactor: '',
        department: '',
        faculty: '',
        isScopusIndexed: false,
        isWebOfScienceIndexed: false,
        url: '',
        abstract: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPublication(null);
    setNewPublication({
      title: '',
      authors: [],
      type: 'journal',
      journal: '',
      conference: '',
      date: '',
      doi: '',
      impactFactor: '',
      department: '',
      faculty: '',
      isScopusIndexed: false,
      isWebOfScienceIndexed: false,
      url: '',
      abstract: '',
    });
  };

  const handleSavePublication = async () => {
    setLoading(true);
    try {
      if (editingPublication) {
        await axios.put(`/api/admin/publications/${editingPublication._id}`, newPublication);
      } else {
        await axios.post('/api/admin/publications', newPublication);
      }
      setSuccess('Publication saved successfully');
      fetchPublications();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save publication');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePublication = async (id) => {
    try {
      await axios.delete(`/api/admin/publications/${id}`);
      setSuccess('Publication deleted successfully');
      fetchPublications();
    } catch (err) {
      setError('Failed to delete publication');
    }
  };

  const getPublicationTypeColor = (type) => {
    switch (type) {
      case 'journal':
        return 'primary';
      case 'conference':
        return 'secondary';
      case 'book':
        return 'info';
      case 'book_chapter':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box className="publication-management-container">
      <Typography variant="h4" className="page-title">
        Publication Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box className="publication-header">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Publication
        </Button>
      </Box>

      <TableContainer component={Paper} className="publication-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Indexing</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {publications.map((publication) => (
              <TableRow key={publication._id}>
                <TableCell>{publication.title}</TableCell>
                <TableCell>
                  <Chip
                    label={publication.type}
                    size="small"
                    color={getPublicationTypeColor(publication.type)}
                  />
                </TableCell>
                <TableCell>{publication.authors.join(', ')}</TableCell>
                <TableCell>{publication.department}</TableCell>
                <TableCell>{new Date(publication.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {publication.isScopusIndexed && (
                    <Chip
                      label="Scopus"
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                  )}
                  {publication.isWebOfScienceIndexed && (
                    <Chip
                      label="WoS"
                      size="small"
                      color="secondary"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(publication)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePublication(publication._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New/Edit Publication Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPublication ? 'Edit Publication' : 'New Publication'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newPublication.title}
                onChange={(e) =>
                  setNewPublication({ ...newPublication, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={newPublication.authors}
                onChange={(event, newValue) => {
                  setNewPublication({ ...newPublication, authors: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Authors"
                    placeholder="Add authors"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newPublication.type}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, type: e.target.value })
                  }
                  label="Type"
                >
                  <MenuItem value="journal">Journal Article</MenuItem>
                  <MenuItem value="conference">Conference Paper</MenuItem>
                  <MenuItem value="book">Book</MenuItem>
                  <MenuItem value="book_chapter">Book Chapter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newPublication.department}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, department: e.target.value })
                  }
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept.name}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={newPublication.faculty}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, faculty: e.target.value })
                  }
                  label="Faculty"
                >
                  {faculty.map((fac) => (
                    <MenuItem key={fac._id} value={fac.name}>
                      {fac.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Publication Date"
                value={newPublication.date}
                onChange={(e) =>
                  setNewPublication({ ...newPublication, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {newPublication.type === 'journal' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Journal Name"
                    value={newPublication.journal}
                    onChange={(e) =>
                      setNewPublication({ ...newPublication, journal: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Impact Factor"
                    value={newPublication.impactFactor}
                    onChange={(e) =>
                      setNewPublication({ ...newPublication, impactFactor: e.target.value })
                    }
                  />
                </Grid>
              </>
            )}
            {newPublication.type === 'conference' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Conference Name"
                  value={newPublication.conference}
                  onChange={(e) =>
                    setNewPublication({ ...newPublication, conference: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="DOI"
                value={newPublication.doi}
                onChange={(e) =>
                  setNewPublication({ ...newPublication, doi: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL"
                value={newPublication.url}
                onChange={(e) =>
                  setNewPublication({ ...newPublication, url: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Abstract"
                value={newPublication.abstract}
                onChange={(e) =>
                  setNewPublication({ ...newPublication, abstract: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newPublication.isScopusIndexed}
                    onChange={(e) =>
                      setNewPublication({
                        ...newPublication,
                        isScopusIndexed: e.target.checked,
                      })
                    }
                  />
                }
                label="Scopus Indexed"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newPublication.isWebOfScienceIndexed}
                    onChange={(e) =>
                      setNewPublication({
                        ...newPublication,
                        isWebOfScienceIndexed: e.target.checked,
                      })
                    }
                  />
                }
                label="Web of Science Indexed"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSavePublication}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <ArticleIcon />}
          >
            {editingPublication ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicationManagement; 