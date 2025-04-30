import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Chip,
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  MarkEmailRead as MarkEmailReadIcon,
  MarkEmailUnread as MarkEmailUnreadIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/faculty/notifications');
      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notifications');
      setLoading(false);
    }
  };

  const handleMenuClick = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notification) => {
    try {
      await axios.put(`/api/faculty/notifications/${notification._id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAsUnread = async (notification) => {
    try {
      await axios.put(`/api/faculty/notifications/${notification._id}/unread`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, read: false } : n
        )
      );
    } catch (err) {
      setError('Failed to mark notification as unread');
    }
  };

  const handleDelete = async (notification) => {
    try {
      await axios.delete(`/api/faculty/notifications/${notification._id}`);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== notification._id)
      );
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appraisal':
        return <AssessmentIcon />;
      case 'publication':
        return <ArticleIcon />;
      case 'event':
        return <EventIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  return (
    <Box className="notifications-container">
      <Typography variant="h4" className="page-title">
        Notifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper className="notifications-section">
        <Box className="section-header">
          <Typography variant="h6" className="section-title">
            <NotificationsIcon className="section-icon" /> All Notifications
          </Typography>
          <Box className="filter-buttons">
            <Button
              startIcon={<FilterListIcon />}
              color={filter === 'all' ? 'primary' : 'default'}
              onClick={() => handleFilterChange('all')}
            >
              All
            </Button>
            <Button
              color={filter === 'unread' ? 'primary' : 'default'}
              onClick={() => handleFilterChange('unread')}
            >
              Unread
            </Button>
            <Button
              color={filter === 'appraisal' ? 'primary' : 'default'}
              onClick={() => handleFilterChange('appraisal')}
            >
              Appraisals
            </Button>
            <Button
              color={filter === 'publication' ? 'primary' : 'default'}
              onClick={() => handleFilterChange('publication')}
            >
              Publications
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box className="loading-container">
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  className={`notification-item ${
                    !notification.read ? 'unread' : ''
                  }`}
                >
                  <ListItemIcon>
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={notification.read}
                    >
                      {getNotificationIcon(notification.type)}
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuClick(e, notification)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && (
          <>
            <MenuItem
              onClick={() => {
                handleMarkAsRead(selectedNotification);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <MarkEmailReadIcon fontSize="small" />
              </ListItemIcon>
              Mark as Read
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMarkAsUnread(selectedNotification);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <MarkEmailUnreadIcon fontSize="small" />
              </ListItemIcon>
              Mark as Unread
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDelete(selectedNotification);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default Notifications; 