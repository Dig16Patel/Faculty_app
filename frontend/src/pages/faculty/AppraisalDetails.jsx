import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Faculty.css';

const AppraisalDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [appraisal, setAppraisal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get appraisals from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    
    // Find the specific appraisal
    const foundAppraisal = allAppraisals.find(a => {
      // Convert both IDs to strings for comparison
      const appraisalId = String(a.id);
      const searchId = String(id);
      return appraisalId === searchId && a.facultyEmail === user?.email;
    });

    console.log('Searching for appraisal:', {
      searchId: id,
      userEmail: user?.email,
      foundAppraisal,
      allAppraisals
    });

    if (foundAppraisal) {
      // Ensure all required fields are present
      const processedAppraisal = {
        ...foundAppraisal,
        title: foundAppraisal.title || 'Untitled Appraisal',
        description: foundAppraisal.description || 'No description provided',
        reviewerName: foundAppraisal.reviewerName || 'Admin',
        department: foundAppraisal.department || 'General',
        date: foundAppraisal.date || new Date().toISOString(),
        status: foundAppraisal.status || 'pending',
        facultyResponse: foundAppraisal.facultyResponse || '',
        adminResponse: foundAppraisal.adminResponse || ''
      };
      setAppraisal(processedAppraisal);
    }
    setLoading(false);
  }, [id, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'accepted':
        return 2;
      case 'rejected':
        return 2;
      case 'pending':
        return 1;
      default:
        return 0;
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      // Handle both ISO string and timestamp formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not specified';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not specified';
    }
  };

  const getAcademicYear = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not specified';
      }
      return date.getFullYear();
    } catch (error) {
      return 'Not specified';
    }
  };

  const getSemester = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      // If the semester is already a number, return it with "Semester" prefix
      if (!isNaN(dateString)) {
        return `Semester ${dateString}`;
      }
      // For backward compatibility with old data
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Not specified';
      }
      // Convert old semester format to new format
      const month = date.getMonth();
      if (month >= 0 && month <= 4) return 'Semester 1';
      if (month >= 7 && month <= 11) return 'Semester 2';
      return 'Semester 3';
    } catch (error) {
      return 'Not specified';
    }
  };

  if (loading) {
    return (
      <Box className="faculty-dashboard-container">
        <Container maxWidth="lg">
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  if (!appraisal) {
    return (
      <Box className="faculty-dashboard-container">
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Appraisal Not Found
            </Typography>
            <Typography color="text.secondary" paragraph>
              The appraisal you're looking for doesn't exist or you don't have permission to view it.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/faculty/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="faculty-dashboard-container">
      <Container maxWidth="lg">
        {/* Header */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/faculty/dashboard')}
            sx={{ mb: 2, color: 'white' }}
          >
            Back to Dashboard
          </Button>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Appraisal Details
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            View and track your appraisal status
          </Typography>
        </Paper>

        {/* Status Stepper */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
          <Stepper activeStep={getStatusStep(appraisal.status)} alternativeLabel>
            <Step>
              <StepLabel>Submitted</StepLabel>
            </Step>
            <Step>
              <StepLabel>Under Review</StepLabel>
            </Step>
            <Step>
              <StepLabel>
                {appraisal.status === 'accepted' ? 'Accepted' : 'Rejected'}
              </StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Appraisal Details */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, borderRadius: '12px' }}>
              <CardContent>
                <Stack spacing={3}>
                  {/* Title and Status */}
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {appraisal.title}
                    </Typography>
                    <Chip
                      label={appraisal.status.toUpperCase()}
                      color={getStatusColor(appraisal.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 500,
                        borderRadius: '16px',
                        px: 1,
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                      Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {appraisal.description}
                    </Typography>
                  </Box>

                  {/* Faculty Response */}
                  {appraisal.facultyResponse && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                        Your Response
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {appraisal.facultyResponse}
                      </Typography>
                    </Box>
                  )}

                  {/* Admin Response */}
                  {(appraisal.status === 'accepted' || appraisal.status === 'rejected') && (
                    <Box>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                        Admin's Response
                      </Typography>
                      <Paper 
                        sx={{ 
                          p: 2,
                          bgcolor: appraisal.status === 'accepted' 
                            ? 'success.light' 
                            : 'error.light',
                          color: 'white',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="body1">
                          {appraisal.adminResponse || 'No response provided'}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Information */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" gutterBottom>
                    Appraisal Information
                  </Typography>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reviewer
                    </Typography>
                    <Typography variant="body1">
                      {appraisal.reviewerName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {appraisal.department}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Submission Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(appraisal.date)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Academic Year
                    </Typography>
                    <Typography variant="body1">
                      {getAcademicYear(appraisal.date)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Semester
                    </Typography>
                    <Typography variant="body1">
                      {getSemester(appraisal.date)}
                    </Typography>
                  </Box>
                  {appraisal.status === 'pending' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AssessmentIcon />}
                      onClick={() => navigate(`/faculty/appraisal-response`)}
                      sx={{ mt: 2 }}
                    >
                      Respond to Appraisal
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AppraisalDetails; 