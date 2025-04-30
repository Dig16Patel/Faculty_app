import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      bio: '',
      avatar: '',
    },
    notifications: {
      appraisalReminders: true,
      publicationUpdates: true,
      eventNotifications: true,
      deadlineAlerts: true,
      emailNotifications: true,
      pushNotifications: false,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
    },
    security: {
      twoFactorAuth: false,
      emailVerification: true,
      loginAlerts: true,
      sessionTimeout: 30,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/faculty/settings');
      setSettings(response.data);
    } catch (err) {
      setError('Failed to fetch settings');
    }
  };

  const handleChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post('/api/faculty/settings/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleChange('profile', 'avatar', response.data.avatarUrl);
      setSuccess('Avatar updated successfully');
    } catch (err) {
      setError('Failed to upload avatar');
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/faculty/settings', settings);
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="settings-container">
      <Typography variant="h4" className="page-title">
        Settings
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

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper className="settings-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <PersonIcon className="section-icon" /> Profile Settings
              </Typography>
            </Box>

            <Box className="avatar-container">
              <Avatar
                src={settings.profile.avatar}
                alt={settings.profile.name}
                className="profile-avatar"
              />
              <input
                accept="image/*"
                type="file"
                id="avatar-upload"
                className="avatar-input"
                onChange={handleAvatarUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  color="primary"
                  component="span"
                  className="avatar-upload-button"
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  value={settings.profile.name}
                  onChange={(e) =>
                    handleChange('profile', 'name', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) =>
                    handleChange('profile', 'email', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={settings.profile.phone}
                  onChange={(e) =>
                    handleChange('profile', 'phone', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department"
                  value={settings.profile.department}
                  onChange={(e) =>
                    handleChange('profile', 'department', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={settings.profile.designation}
                  onChange={(e) =>
                    handleChange('profile', 'designation', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={settings.profile.bio}
                  onChange={(e) =>
                    handleChange('profile', 'bio', e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper className="settings-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <NotificationsIcon className="section-icon" /> Notification
                Settings
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.appraisalReminders}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'appraisalReminders',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Appraisal Reminders"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.publicationUpdates}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'publicationUpdates',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Publication Updates"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.eventNotifications}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'eventNotifications',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Event Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.deadlineAlerts}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'deadlineAlerts',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Deadline Alerts"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'emailNotifications',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) =>
                        handleChange(
                          'notifications',
                          'pushNotifications',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Push Notifications"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Paper className="settings-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <LanguageIcon className="section-icon" /> Preferences
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.preferences.language}
                    label="Language"
                    onChange={(e) =>
                      handleChange('preferences', 'language', e.target.value)
                    }
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={settings.preferences.theme}
                    label="Theme"
                    onChange={(e) =>
                      handleChange('preferences', 'theme', e.target.value)
                    }
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.preferences.timezone}
                    label="Timezone"
                    onChange={(e) =>
                      handleChange('preferences', 'timezone', e.target.value)
                    }
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">EST</MenuItem>
                    <MenuItem value="PST">PST</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.preferences.dateFormat}
                    label="Date Format"
                    onChange={(e) =>
                      handleChange('preferences', 'dateFormat', e.target.value)
                    }
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper className="settings-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <SecurityIcon className="section-icon" /> Security Settings
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) =>
                        handleChange(
                          'security',
                          'twoFactorAuth',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Two-Factor Authentication"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.emailVerification}
                      onChange={(e) =>
                        handleChange(
                          'security',
                          'emailVerification',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Email Verification"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.security.loginAlerts}
                      onChange={(e) =>
                        handleChange(
                          'security',
                          'loginAlerts',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Login Alerts"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Session Timeout (minutes)</InputLabel>
                  <Select
                    value={settings.security.sessionTimeout}
                    label="Session Timeout (minutes)"
                    onChange={(e) =>
                      handleChange(
                        'security',
                        'sessionTimeout',
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Box className="action-buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default Settings; 