import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  useTheme,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { useNavigate } from 'react-router-dom';
import './Faculty.css';

const FacultyAppraisal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appraisalData, setAppraisalData] = useState({
    title: '',
    description: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '',
    department: user?.department || '',
    facultyId: user?.email || '',
    facultyName: user?.name || '',
    course: '',
    teaching: {
      courses: [],
      totalStudents: 0,
      averageFeedback: 0,
    },
    research: {
      publications: [],
      projects: [],
    },
    service: {
      committees: [],
      activities: [],
    },
    achievements: [],
    challenges: '',
    goals: '',
    status: 'pending',
    date: new Date().toISOString(),
  });

  const handleChange = (section, field, value) => {
    if (section === 'teaching' || section === 'research' || section === 'service') {
      // Handle numeric fields
      if (field === 'totalStudents' || field === 'averageFeedback') {
        const numValue = value === '' ? 0 : Number(parseFloat(value).toFixed(2));
        setAppraisalData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: numValue
          }
        }));
      } else if (field === 'teachingScore' || field === 'researchScore' || field === 'serviceScore') {
        // Handle percentage fields with 2 decimal places
        const numValue = value === '' ? 0 : Number(parseFloat(value).toFixed(2));
        setAppraisalData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: numValue
          }
        }));
      } else {
        setAppraisalData(prev => ({
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }));
      }
    } else {
      setAppraisalData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!appraisalData.title || !appraisalData.description || !appraisalData.semester || !appraisalData.course) {
        throw new Error('Please fill in all required fields');
      }

      // Get existing appraisals
      const existingAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Check if faculty already has a pending appraisal
      const hasPendingAppraisal = existingAppraisals.some(
        a => a.facultyId === appraisalData.facultyId && a.status === 'pending'
      );

      if (hasPendingAppraisal) {
        throw new Error('You already have a pending appraisal');
      }

      // Add new appraisal
      const newAppraisal = {
        ...appraisalData,
        id: Date.now().toString(), // Generate unique ID
      };

      // Save to localStorage
      localStorage.setItem('appraisals', JSON.stringify([...existingAppraisals, newAppraisal]));

      setSuccess('Appraisal submitted successfully!');
      setTimeout(() => {
        navigate('/faculty/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="appraisal-form-container">
      <Container maxWidth="lg">
        {/* Header */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            color: 'white',
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontSize: '2.5rem',
                }}
              >
                <AssessmentIcon />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                Faculty Appraisal
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Submit your performance appraisal for review
              </Typography>
            </Grid>
          </Grid>
        </Paper>

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

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={appraisalData.title}
                  onChange={(e) => handleChange('', 'title', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={appraisalData.description}
                  onChange={(e) => handleChange('', 'description', e.target.value)}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Academic Year"
                  name="academicYear"
                  value={appraisalData.academicYear}
                  onChange={(e) => handleChange('', 'academicYear', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Semester</InputLabel>
                  <Select
                    name="semester"
                    value={appraisalData.semester}
                    onChange={(e) => handleChange('', 'semester', e.target.value)}
                    label="Semester"
                  >
                    <MenuItem value="1">Semester 1</MenuItem>
                    <MenuItem value="2">Semester 2</MenuItem>
                    <MenuItem value="3">Semester 3</MenuItem>
                    <MenuItem value="4">Semester 4</MenuItem>
                    <MenuItem value="5">Semester 5</MenuItem>
                    <MenuItem value="6">Semester 6</MenuItem>
                    <MenuItem value="7">Semester 7</MenuItem>
                    <MenuItem value="8">Semester 8</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Course"
                  name="course"
                  value={appraisalData.course}
                  onChange={(e) => handleChange('', 'course', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <BookIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={appraisalData.department}
                  onChange={(e) => handleChange('', 'department', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Faculty ID"
                  name="facultyId"
                  value={appraisalData.facultyId}
                  onChange={(e) => handleChange('', 'facultyId', e.target.value)}
                  required
                  disabled
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Teaching Performance */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Teaching Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teaching Score (%)"
                  name="teachingScore"
                  type="number"
                  value={appraisalData.teaching.teachingScore || ''}
                  onChange={(e) => handleChange('teaching', 'teachingScore', e.target.value)}
                  required
                  inputProps={{ 
                    min: 0, 
                    max: 100,
                    step: 0.01,
                    pattern: "[0-9]*[.,]?[0-9]{0,2}"
                  }}
                  helperText="Enter percentage with up to 2 decimal places"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Students"
                  name="totalStudents"
                  type="number"
                  value={appraisalData.teaching.totalStudents || ''}
                  onChange={(e) => handleChange('teaching', 'totalStudents', e.target.value)}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teaching Summary"
                  name="teachingSummary"
                  value={appraisalData.teaching.courses.join('\n')}
                  onChange={(e) => handleChange('teaching', 'courses', e.target.value.split('\n'))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Research Performance */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Research Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Research Score (%)"
                  name="researchScore"
                  type="number"
                  value={appraisalData.research.researchScore || ''}
                  onChange={(e) => handleChange('research', 'researchScore', e.target.value)}
                  required
                  inputProps={{ 
                    min: 0, 
                    max: 100,
                    step: 0.01,
                    pattern: "[0-9]*[.,]?[0-9]{0,2}"
                  }}
                  helperText="Enter percentage with up to 2 decimal places"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Research Summary"
                  name="researchSummary"
                  value={appraisalData.research.projects.join('\n')}
                  onChange={(e) => handleChange('research', 'projects', e.target.value.split('\n'))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Service Performance */}
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Service Performance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Service Score (%)"
                  name="serviceScore"
                  type="number"
                  value={appraisalData.service.serviceScore || ''}
                  onChange={(e) => handleChange('service', 'serviceScore', e.target.value)}
                  required
                  inputProps={{ 
                    min: 0, 
                    max: 100,
                    step: 0.01,
                    pattern: "[0-9]*[.,]?[0-9]{0,2}"
                  }}
                  helperText="Enter percentage with up to 2 decimal places"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Average Feedback"
                  name="averageFeedback"
                  type="number"
                  value={appraisalData.service.averageFeedback || ''}
                  onChange={(e) => handleChange('service', 'averageFeedback', e.target.value)}
                  required
                  inputProps={{ 
                    min: 0, 
                    max: 10,
                    step: 0.01,
                    pattern: "[0-9]*[.,]?[0-9]{0,2}"
                  }}
                  helperText="Enter feedback score (0-10) with up to 2 decimal places"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Summary"
                  name="serviceSummary"
                  value={appraisalData.service.committees.join('\n')}
                  onChange={(e) => handleChange('service', 'committees', e.target.value.split('\n'))}
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                {loading ? 'Submitting...' : 'Submit Appraisal'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default FacultyAppraisal;