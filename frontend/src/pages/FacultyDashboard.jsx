import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    appraisals: 0,
    publications: 0,
    events: 0,
    profile: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get registered users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Get current user's data
        const currentUser = registeredUsers.find(u => u.email === user.email);
        
        if (!currentUser) {
          setError('User data not found');
          return;
        }

        // Get appraisals data
        const appraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        const userAppraisals = appraisals.filter(a => a.facultyId === currentUser.id);

        // Get publications data
        const publications = JSON.parse(localStorage.getItem('publications') || '[]');
        const userPublications = publications.filter(p => p.facultyId === currentUser.id);

        // Get events data
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const userEvents = events.filter(e => e.facultyId === currentUser.id);

        // Update stats
        setStats({
          appraisals: userAppraisals.length,
          publications: userPublications.length,
          events: userEvents.length,
          profile: currentUser ? 1 : 0,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.email]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
        color: 'white',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
      }}
    >
      <Icon sx={{ fontSize: 40, mb: 2 }} />
      <Typography variant="h4" component="div" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: 'primary.main',
          mb: 4,
        }}
      >
        Welcome, {user?.name || 'Faculty Member'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Appraisals"
            value={stats.appraisals}
            icon={AssessmentIcon}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Publications"
            value={stats.publications}
            icon={ArticleIcon}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Events"
            value={stats.events}
            icon={EventIcon}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Profile"
            value={stats.profile}
            icon={PersonIcon}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacultyDashboard; 