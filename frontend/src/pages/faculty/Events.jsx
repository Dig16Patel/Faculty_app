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
} from '@mui/material';
import {
  Search as SearchIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    location: '',
    description: '',
    participants: '',
    role: '',
    status: 'upcoming',
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // First try to get events from localStorage
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
        setLoading(false);
        return;
      }

      // If no events in localStorage, try to fetch from API
      const response = await axios.get('/api/events');
      const eventsData = response.data;
      
      // Save to localStorage for future use
      localStorage.setItem('events', JSON.stringify(eventsData));
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      // If API fails, try to get from localStorage as fallback
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
        setError(null);
      } else {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
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
      location: '',
      description: '',
      participants: '',
      role: '',
      status: 'upcoming',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      type: '',
      date: '',
      location: '',
      description: '',
      participants: '',
      role: '',
      status: 'upcoming',
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
      const newEvent = {
        ...formData,
        facultyId: user.id,
        facultyName: user.name,
        date: new Date(formData.date).toISOString().split('T')[0],
        participants: parseInt(formData.participants),
        id: Date.now(), // Generate a unique ID
      };

      // Get existing events from localStorage
      const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
      
      // Add new event to the array
      const updatedEvents = [...existingEvents, newEvent];
      
      // Save updated events to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Update state
      setEvents(updatedEvents);
      
      // Close dialog and show success message
      handleCloseDialog();
      setError(null);
      alert('Event added successfully!');
    } catch (err) {
      setError('Failed to add event. Please try again.');
      console.error('Error adding event:', err);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEventDetails(event);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedEventDetails(null);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Get existing events from localStorage
        const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
        
        // Filter out the event to delete
        const updatedEvents = existingEvents.filter(event => event.id !== eventId);
        
        // Save updated events to localStorage
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        
        // Update state
        setEvents(updatedEvents);
        
        setError(null);
        alert('Event deleted successfully!');
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      type: event.type,
      date: event.date,
      location: event.location,
      description: event.description,
      participants: event.participants,
      role: event.role,
      status: event.status,
    });
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = {
        ...formData,
        id: selectedEvent.id,
        facultyId: user.id,
        facultyName: user.name,
        date: new Date(formData.date).toISOString().split('T')[0],
        participants: parseInt(formData.participants),
      };

      // Get existing events from localStorage
      const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
      
      // Update the event in the array
      const updatedEvents = existingEvents.map(event => 
        event.id === selectedEvent.id ? updatedEvent : event
      );
      
      // Save updated events to localStorage
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Update state
      setEvents(updatedEvents);
      
      // Close dialog and show success message
      handleCloseDialog();
      setError(null);
      alert('Event updated successfully!');
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', err);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return '#22c55e';
      case 'ongoing':
        return '#3b82f6';
      case 'completed':
        return '#64748b';
      default:
        return '#9ca3af';
    }
  };

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
          Events
        </Typography>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search events..."
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
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Button
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
                px: 3,
              }}
            >
              Add New Event
            </Button>
          </Grid>
        </Grid>

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
            {filteredEvents.map((event, index) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
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
                          label={event.status}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(event.status)}15`,
                            color: getStatusColor(event.status),
                            fontWeight: 600,
                            borderRadius: '6px',
                          }}
                        />
                        <Box>
                          <Tooltip title="Edit Event">
                            <IconButton 
                              size="small" 
                              sx={{ mr: 1 }}
                              onClick={() => handleEdit(event)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Event">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDelete(event.id)}
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
                        {event.title}
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
                        {event.description}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ fontSize: '1rem', color: '#64748b', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.participants} participants
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleViewDetails(event)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Event
          </Typography>
        </DialogTitle>
        <form onSubmit={selectedEvent ? handleUpdate : handleSubmit}>
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
                    <MenuItem value="Conference">Conference</MenuItem>
                    <MenuItem value="Workshop">Workshop</MenuItem>
                    <MenuItem value="Seminar">Seminar</MenuItem>
                    <MenuItem value="Training">Training</MenuItem>
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
                  label="Location"
                  name="location"
                  value={formData.location}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Number of Participants"
                  name="participants"
                  type="number"
                  value={formData.participants}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
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
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                    <MenuItem value="ongoing">Ongoing</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
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
              onClick={selectedEvent ? handleUpdate : handleSubmit}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                textTransform: 'none',
              }}
            >
              {selectedEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedEventDetails && (
          <>
            <DialogTitle sx={{ pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Event Details
                </Typography>
                <Chip
                  label={selectedEventDetails.status}
                  size="small"
                  sx={{
                    backgroundColor: `${getStatusColor(selectedEventDetails.status)}15`,
                    color: getStatusColor(selectedEventDetails.status),
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
                    {selectedEventDetails.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Event Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedEventDetails.type}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(selectedEventDetails.date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {selectedEventDetails.location}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedEventDetails.description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Number of Participants
                    </Typography>
                    <Typography variant="body1">
                      {selectedEventDetails.participants}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Your Role
                    </Typography>
                    <Typography variant="body1">
                      {selectedEventDetails.role}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                      Faculty Information
                    </Typography>
                    <Typography variant="body1">
                      {selectedEventDetails.facultyName}
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

export default Events; 