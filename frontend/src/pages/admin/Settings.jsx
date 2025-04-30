import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Backup as BackupIcon,
} from '@mui/icons-material';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      allowNewRegistrations: true,
      appraisalPeriod: '2024',
      backupFrequency: 'daily',
    },
    notifications: {
      emailNotifications: true,
      appraisalReminders: true,
      reportGeneration: true,
      systemUpdates: true,
    },
    security: {
      requireTwoFactor: false,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
    },
    appraisal: {
      minScore: 0,
      maxScore: 100,
      weightTeaching: 40,
      weightResearch: 30,
      weightService: 30,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Get settings from localStorage
      const storedSettings = JSON.parse(localStorage.getItem('adminSettings') || JSON.stringify(settings));
      setSettings(storedSettings);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch settings');
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save settings');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        System Settings
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
        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BackupIcon sx={{ mr: 1 }} />
                <Typography variant="h6">System Settings</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                  />
                }
                label="Maintenance Mode"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.system.allowNewRegistrations}
                    onChange={(e) => handleSettingChange('system', 'allowNewRegistrations', e.target.checked)}
                  />
                }
                label="Allow New Registrations"
              />
              <TextField
                fullWidth
                label="Appraisal Period"
                value={settings.system.appraisalPeriod}
                onChange={(e) => handleSettingChange('system', 'appraisalPeriod', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                select
                label="Backup Frequency"
                value={settings.system.backupFrequency}
                onChange={(e) => handleSettingChange('system', 'backupFrequency', e.target.value)}
                margin="normal"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notification Settings</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.appraisalReminders}
                    onChange={(e) => handleSettingChange('notifications', 'appraisalReminders', e.target.checked)}
                  />
                }
                label="Appraisal Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.reportGeneration}
                    onChange={(e) => handleSettingChange('notifications', 'reportGeneration', e.target.checked)}
                  />
                }
                label="Report Generation Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                  />
                }
                label="System Update Notifications"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Security Settings</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
                  />
                }
                label="Require Two-Factor Authentication"
              />
              <TextField
                fullWidth
                type="number"
                label="Password Expiry (days)"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Max Login Attempts"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Session Timeout (minutes)"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Appraisal Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Appraisal Settings</Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                label="Minimum Score"
                value={settings.appraisal.minScore}
                onChange={(e) => handleSettingChange('appraisal', 'minScore', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Maximum Score"
                value={settings.appraisal.maxScore}
                onChange={(e) => handleSettingChange('appraisal', 'maxScore', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Teaching Weight (%)"
                value={settings.appraisal.weightTeaching}
                onChange={(e) => handleSettingChange('appraisal', 'weightTeaching', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Research Weight (%)"
                value={settings.appraisal.weightResearch}
                onChange={(e) => handleSettingChange('appraisal', 'weightResearch', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Service Weight (%)"
                value={settings.appraisal.weightService}
                onChange={(e) => handleSettingChange('appraisal', 'weightService', parseInt(e.target.value))}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          size="large"
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default AdminSettings; 