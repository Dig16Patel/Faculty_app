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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './EventManagement.css';

const EventManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'conference',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    departments: [],
    maxParticipants: 0,
    registrationDeadline: '',
    isVirtual: false,
    meetingLink: '',
    status: 'upcoming',
  });

  useEffect(() => {
    fetchEvents();
    fetchDepartments();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
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

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setNewEvent(event);
    } else {
      setEditingEvent(null);
      setNewEvent({
        title: '',
        description: '',
        type: 'conference',
        startDate: '',
        endDate: '',
        location: '',
        organizer: '',
        departments: [],
        maxParticipants: 0,
        registrationDeadline: '',
        isVirtual: false,
        meetingLink: '',
        status: 'upcoming',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      type: 'conference',
      startDate: '',
      endDate: '',
      location: '',
      organizer: '',
      departments: [],
      maxParticipants: 0,
      registrationDeadline: '',
      isVirtual: false,
      meetingLink: '',
      status: 'upcoming',
    });
  };

  const handleSaveEvent = async () => {
    setLoading(true);
    try {
      if (editingEvent) {
        await axios.put(`/api/admin/events/${editingEvent._id}`, newEvent);
      } else {
        await axios.post('/api/admin/events', newEvent);
      }
      setSuccess('Event saved successfully');
      fetchEvents();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`/api/admin/events/${id}`);
      setSuccess('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'success';
      case 'ongoing':
        return 'primary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'conference':
        return 'primary';
      case 'workshop':
        return 'secondary';
      case 'seminar':
        return 'info';
      case 'training':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box className="event-management-container">
      <Typography variant="h4" className="page-title">
        Event Management
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

      <Box className="event-header">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Event
        </Button>
      </Box>

      <TableContainer component={Paper} className="event-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>
                  <Chip
                    label={event.type}
                    size="small"
                    color={getEventTypeColor(event.type)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(event.startDate).toLocaleDateString()} -{' '}
                  {new Date(event.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {event.isVirtual ? 'Virtual Event' : event.location}
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.status}
                    size="small"
                    color={getStatusColor(event.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(event)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New/Edit Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, type: e.target.value })
                  }
                  label="Event Type"
                >
                  <MenuItem value="conference">Conference</MenuItem>
                  <MenuItem value="workshop">Workshop</MenuItem>
                  <MenuItem value="seminar">Seminar</MenuItem>
                  <MenuItem value="training">Training</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newEvent.status}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, status: e.target.value })
                  }
                  label="Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={newEvent.startDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={newEvent.endDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newEvent.isVirtual}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, isVirtual: e.target.checked })
                    }
                  />
                }
                label="Virtual Event"
              />
            </Grid>
            {!newEvent.isVirtual ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meeting Link"
                  value={newEvent.meetingLink}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, meetingLink: e.target.value })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organizer"
                value={newEvent.organizer}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, organizer: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Departments</InputLabel>
                <Select
                  multiple
                  value={newEvent.departments}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, departments: e.target.value })
                  }
                  label="Departments"
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
              <TextField
                fullWidth
                type="number"
                label="Max Participants"
                value={newEvent.maxParticipants}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    maxParticipants: Number(e.target.value),
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Registration Deadline"
                value={newEvent.registrationDeadline}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    registrationDeadline: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveEvent}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CalendarIcon />}
          >
            {editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManagement; 