import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Fade,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Publications = () => {
  const { user } = useAuth();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    journal: '',
    description: '',
    authors: '',
    impactFactor: '',
    citations: '',
    url: '',
    status: 'published',
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPublicationDetails, setSelectedPublicationDetails] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      // First try to get publications from localStorage
      const savedPublications = localStorage.getItem('publications');
      if (savedPublications) {
        setPublications(JSON.parse(savedPublications));
        setLoading(false);
        return;
      }

      // If no publications in localStorage, try to fetch from API
      const response = await fetch('/api/publications');
      const publicationsData = await response.json();
      
      // Save to localStorage for future use
      localStorage.setItem('publications', JSON.stringify(publicationsData));
      setPublications(publicationsData);
      setError(null);
    } catch (err) {
      // If API fails, try to get from localStorage as fallback
      const savedPublications = localStorage.getItem('publications');
      if (savedPublications) {
        setPublications(JSON.parse(savedPublications));
        setError(null);
      } else {
        setError('Failed to fetch publications. Please try again later.');
        console.error('Error fetching publications:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDialog = () => {
      setFormData({
        title: '',
        type: '',
      date: '',
        journal: '',
      description: '',
      authors: '',
        impactFactor: '',
        citations: '',
        url: '',
      status: 'published',
      });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPublication(null);
    setFormData({
      title: '',
      type: '',
      date: '',
      journal: '',
      description: '',
      authors: '',
      impactFactor: '',
      citations: '',
      url: '',
      status: 'published',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const newPublication = {
          ...formData,
        facultyId: user.id,
        facultyName: user.name,
        date: new Date(formData.date).toISOString().split('T')[0],
        citations: parseInt(formData.citations),
        impactFactor: parseFloat(formData.impactFactor),
          id: Date.now(),
      };

      // Get existing publications from localStorage
      const existingPublications = JSON.parse(localStorage.getItem('publications') || '[]');
      
      // Add new publication to the array
      const updatedPublications = [...existingPublications, newPublication];
      
      // Save updated publications to localStorage
      localStorage.setItem('publications', JSON.stringify(updatedPublications));
      
      // Update state
      setPublications(updatedPublications);
      
      // Close dialog and show success message
      handleCloseDialog();
      setError(null);
      alert('Publication added successfully!');
    } catch (err) {
      setError('Failed to add publication. Please try again.');
      console.error('Error adding publication:', err);
    }
  };

  const handleViewDetails = (publication) => {
    setSelectedPublicationDetails(publication);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPublicationDetails(null);
  };

  const handleDelete = (publicationId) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        // Get existing publications from localStorage
        const existingPublications = JSON.parse(localStorage.getItem('publications') || '[]');
        
        // Filter out the publication to delete
        const updatedPublications = existingPublications.filter(pub => pub.id !== publicationId);
        
        // Save updated publications to localStorage
        localStorage.setItem('publications', JSON.stringify(updatedPublications));
        
        // Update state
        setPublications(updatedPublications);
        
        setError(null);
        alert('Publication deleted successfully!');
      } catch (err) {
        setError('Failed to delete publication. Please try again.');
        console.error('Error deleting publication:', err);
      }
    }
  };

  const handleEdit = (publication) => {
    setFormData({
      title: publication.title,
      type: publication.type,
      date: publication.date,
      journal: publication.journal,
      description: publication.description,
      authors: publication.authors,
      impactFactor: publication.impactFactor,
      citations: publication.citations,
      url: publication.url,
      status: publication.status,
    });
    setSelectedPublication(publication);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedPublication = {
        ...formData,
        id: selectedPublication.id,
        facultyId: user.id,
        facultyName: user.name,
        date: new Date(formData.date).toISOString().split('T')[0],
        citations: parseInt(formData.citations),
        impactFactor: parseFloat(formData.impactFactor),
      };

      // Get existing publications from localStorage
      const existingPublications = JSON.parse(localStorage.getItem('publications') || '[]');
      
      // Update the publication in the array
      const updatedPublications = existingPublications.map(pub => 
        pub.id === selectedPublication.id ? updatedPublication : pub
      );
      
      // Save updated publications to localStorage
      localStorage.setItem('publications', JSON.stringify(updatedPublications));
      
      // Update state
      setPublications(updatedPublications);
      
      // Close dialog and show success message
      handleCloseDialog();
      setError(null);
      alert('Publication updated successfully!');
    } catch (err) {
      setError('Failed to update publication. Please try again.');
      console.error('Error updating publication:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getStatusColor = (status) => {
    if (!status) return '#9ca3af';
    
    switch (status.toLowerCase()) {
      case 'published':
        return '#22c55e';
      case 'under_review':
        return '#3b82f6';
      case 'submitted':
        return '#f59e0b';
      default:
        return '#9ca3af';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return String(status).replace('_', ' ');
  };

  const calculateStatistics = () => {
    const total = publications.length;
    const published = publications.filter(pub => pub?.status === 'published').length;
    const underReview = publications.filter(pub => pub?.status === 'under_review').length;
    const submitted = publications.filter(pub => pub?.status === 'submitted').length;
    const averageImpactFactor = publications.reduce((sum, pub) => sum + (pub?.impactFactor || 0), 0) / total || 0;

    return {
      total,
      published,
      underReview,
      submitted,
      averageImpactFactor,
    };
  };

  const filteredPublications = publications
    .filter((publication) => {
      if (!publication) return false;
      
      const matchesSearch = 
        (publication.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (publication.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (publication.journal?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || publication.type === filterType;
      const matchesStatus = filterStatus === 'all' || publication.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      switch (sortBy) {
        case 'date':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'impactFactor':
          return (b.impactFactor || 0) - (a.impactFactor || 0);
        default:
          return 0;
      }
    });

  const stats = calculateStatistics();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, lg: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 2,
            letterSpacing: '-0.5px',
          }}
        >
            Publications
          </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArticleIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Publications
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Avg. Impact Factor
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.averageImpactFactor.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CategoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Published
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.published}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            mb: 4,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#3b82f6 !important',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Journal Article">Journal Article</MenuItem>
                  <MenuItem value="Conference Paper">Conference Paper</MenuItem>
                  <MenuItem value="Book Chapter">Book Chapter</MenuItem>
                  <MenuItem value="Book">Book</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="under_review">Under Review</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="impactFactor">Impact Factor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
          <Button
                fullWidth
            variant="contained"
            startIcon={<AddIcon />}
                onClick={handleOpenDialog}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                Add New
          </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6',
              height: 3,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
            },
          }}
        >
          <Tab label={`All (${stats.total})`} />
          <Tab label={`Published (${stats.published})`} />
          <Tab label={`Under Review (${stats.underReview})`} />
          <Tab label={`Submitted (${stats.submitted})`} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredPublications.map((publication, index) => (
              <Grid item xs={12} md={6} lg={4} key={publication.id}>
                <Fade in={true} timeout={300 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 25px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Chip
                          label={getStatusLabel(publication.status)}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(publication.status)}15`,
                            color: getStatusColor(publication.status),
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        />
                        <Box>
                          <Tooltip title="Edit Publication">
                    <IconButton
                              size="small" 
                              sx={{ mr: 1 }}
                              onClick={() => handleEdit(publication)}
                    >
                              <EditIcon fontSize="small" />
                    </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Publication">
                    <IconButton
                              size="small" 
                      color="error"
                      onClick={() => handleDelete(publication.id)}
                    >
                              <DeleteIcon fontSize="small" />
                    </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: '#1e293b',
                          lineHeight: 1.3,
                        }}
                      >
                        {publication.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {publication.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ArticleIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {publication.journal}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(publication.date)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Impact Factor: {publication.impactFactor}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleViewDetails(publication)}
                        sx={{
                          borderColor: '#3b82f6',
                          color: '#3b82f6',
                          '&:hover': {
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(59, 130, 246, 0.04)',
                          },
                          borderRadius: '8px',
                          textTransform: 'none',
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          {selectedPublication ? 'Edit Publication' : 'Add New Publication'}
          </DialogTitle>
        <form onSubmit={selectedPublication ? handleUpdate : handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label="Type"
                    >
                      <MenuItem value="Journal Article">Journal Article</MenuItem>
                      <MenuItem value="Conference Paper">Conference Paper</MenuItem>
                      <MenuItem value="Book Chapter">Book Chapter</MenuItem>
                      <MenuItem value="Book">Book</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Journal/Publisher"
                    name="journal"
                    value={formData.journal}
                    onChange={handleChange}
                    required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                  />
                </Grid>
              <Grid item xs={12}>
                  <TextField
                    fullWidth
                  label="Authors"
                  name="authors"
                  value={formData.authors}
                    onChange={handleChange}
                    required
                  sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Impact Factor"
                    name="impactFactor"
                    type="number"
                    value={formData.impactFactor}
                    onChange={handleChange}
                    required
                  sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="under_review">Under Review</MenuItem>
                    <MenuItem value="submitted">Submitted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                },
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                textTransform: 'none',
              }}
            >
              {selectedPublication ? 'Update Publication' : 'Add Publication'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPublicationDetails && (
          <>
            <DialogTitle sx={{ pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Publication Details
                <Chip
                  label={getStatusLabel(selectedPublicationDetails.status)}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(selectedPublicationDetails.status)}15`,
                    color: getStatusColor(selectedPublicationDetails.status),
                    fontWeight: 600,
                    borderRadius: '6px',
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 2,
                    }}
                  >
                    {selectedPublicationDetails.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedPublicationDetails.type}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedPublicationDetails.date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Journal/Publisher
                    </Typography>
                    <Typography variant="body1">
                      {selectedPublicationDetails.journal}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedPublicationDetails.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Authors
                    </Typography>
                    <Typography variant="body1">
                      {selectedPublicationDetails.authors}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Impact Factor
                    </Typography>
                    <Typography variant="body1">
                      {selectedPublicationDetails.impactFactor}
                    </Typography>
                  </Box>
                </Grid>
                {selectedPublicationDetails.url && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                        URL
                      </Typography>
                      <Button
                        startIcon={<LinkIcon />}
                        href={selectedPublicationDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: '#3b82f6',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.04)',
                          },
                          textTransform: 'none',
                        }}
                      >
                        View Publication
                      </Button>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Faculty Information
                    </Typography>
                    <Typography variant="body1">
                      {selectedPublicationDetails.facultyName}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleCloseViewDialog}
                sx={{
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 116, 139, 0.04)',
                  },
                  textTransform: 'none',
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
        </Dialog>
      </Container>
  );
};

export default Publications; 