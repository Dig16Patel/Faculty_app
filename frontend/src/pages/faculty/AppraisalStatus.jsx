import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Fade,
} from '@mui/material';
import {
  Pending as PendingIcon,
  CheckCircle as CompletedIcon,
  Cancel as RejectedIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AppraisalStatus = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appraisals, setAppraisals] = useState({
    pending: [],
    completed: [],
    rejected: [],
  });

  useEffect(() => {
    const loadAppraisals = () => {
      try {
        // Get appraisals from localStorage
        const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        
        // Filter appraisals based on status and current user
        const userAppraisals = allAppraisals.filter(appraisal => appraisal.facultyEmail === user.email);
        
        setAppraisals({
          pending: userAppraisals.filter(appraisal => appraisal.status === 'pending'),
          completed: userAppraisals.filter(appraisal => appraisal.status === 'completed'),
          rejected: userAppraisals.filter(appraisal => appraisal.status === 'rejected'),
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading appraisals:', err);
        setError('Failed to load appraisal data');
        setLoading(false);
      }
    };

    loadAppraisals();
  }, [user.email]);

  const StatusCard = ({ title, count, icon, color, items }) => (
    <Fade in timeout={500}>
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          height: '100%',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {icon}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                ml: 1,
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Typography
            variant="h3"
            sx={{
              color: color,
              fontWeight: 700,
              mb: 2,
            }}
          >
            {count}
          </Typography>

          <Box sx={{ mt: 2 }}>
            {items.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: '12px',
                  backgroundColor: `${color}10`,
                  border: `1px solid ${color}20`,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.academicYear}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submitted on: {new Date(item.submissionDate).toLocaleDateString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#1e293b',
          mb: 3,
          letterSpacing: '-0.5px',
        }}
      >
        Appraisal Status
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatusCard
            title="Pending Appraisals"
            count={appraisals.pending.length}
            icon={<PendingIcon sx={{ color: '#f59e0b', fontSize: 28 }} />}
            color="#f59e0b"
            items={appraisals.pending}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard
            title="Completed Appraisals"
            count={appraisals.completed.length}
            icon={<CompletedIcon sx={{ color: '#10b981', fontSize: 28 }} />}
            color="#10b981"
            items={appraisals.completed}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard
            title="Rejected Appraisals"
            count={appraisals.rejected.length}
            icon={<RejectedIcon sx={{ color: '#ef4444', fontSize: 28 }} />}
            color="#ef4444"
            items={appraisals.rejected}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppraisalStatus; 