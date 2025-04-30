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
} from '@mui/material';
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    departments: [],
    scheduleDate: '',
    isScheduled: false,
    priority: 'normal',
  });

  useEffect(() => {
    fetchNotifications();
    fetchDepartments();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/notifications');
      setNotifications(response.data);
    } catch (err) {
      setError('Failed to fetch notifications');
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

  const handleOpenDialog = (notification = null) => {
    if (notification) {
      setEditingNotification(notification);
      setNewNotification(notification);
    } else {
      setEditingNotification(null);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        departments: [],
        scheduleDate: '',
        isScheduled: false,
        priority: 'normal',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNotification(null);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      departments: [],
      scheduleDate: '',
      isScheduled: false,
      priority: 'normal',
    });
  };

  const handleSendNotification = async () => {
    setLoading(true);
    try {
      if (editingNotification) {
        await axios.put(`/api/admin/notifications/${editingNotification._id}`, newNotification);
      } else {
        await axios.post('/api/admin/notifications', newNotification);
      }
      setSuccess('Notification sent successfully');
      fetchNotifications();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/api/admin/notifications/${id}`);
      setSuccess('Notification deleted successfully');
      fetchNotifications();
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Box className="notifications-container">
      <Typography variant="h4" className="page-title">
        System Notifications
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

      <Box className="notifications-header">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Notification
        </Button>
      </Box>

      <Paper className="notifications-list">
        <List>
          {notifications.map((notification) => (
            <ListItem key={notification._id} divider>
              <ListItemText
                primary={
                  <Box className="notification-title">
                    <Typography variant="subtitle1" component="span">
                      {notification.title}
                    </Typography>
                    <Chip
                      label={notification.priority}
                      size="small"
                      color={getPriorityColor(notification.priority)}
                      sx={{ ml: 1 }}
                    />
                    <Chip
                      label={notification.type}
                      size="small"
                      color={getTypeColor(notification.type)}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Box className="notification-meta">
                      <Typography variant="caption" color="text.secondary">
                        Departments: {notification.departments.join(', ')}
                      </Typography>
                      {notification.isScheduled && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Scheduled for: {new Date(notification.scheduleDate).toLocaleString()}
                        </Typography>
                      )}
                    </Box>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleOpenDialog(notification)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteNotification(notification._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* New/Edit Notification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNotification ? 'Edit Notification' : 'New Notification'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newNotification.title}
                onChange={(e) =>
                  setNewNotification({ ...newNotification, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={newNotification.message}
                onChange={(e) =>
                  setNewNotification({ ...newNotification, message: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newNotification.type}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, type: e.target.value })
                  }
                  label="Type"
                >
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newNotification.priority}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, priority: e.target.value })
                  }
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Departments</InputLabel>
                <Select
                  multiple
                  value={newNotification.departments}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, departments: e.target.value })
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
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newNotification.isScheduled}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        isScheduled: e.target.checked,
                      })
                    }
                  />
                }
                label="Schedule for later"
              />
            </Grid>
            {newNotification.isScheduled && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Schedule Date"
                  value={newNotification.scheduleDate}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      scheduleDate: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSendNotification}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {editingNotification ? 'Update' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications; 