import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppraisalForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    facultyId: '',
    facultyName: '',
    submissionDate: new Date().toISOString(),
    status: 'pending',
    academicYear: new Date().getFullYear().toString(),
    semester: '',
    facultyEmail: '',
    facultyCourse: '',
    teaching: {
      courses: [],
      totalStudents: 0,
      averageFeedback: 0
    },
    research: {
      publications: [''],
      projects: ['']
    },
    service: {
      committees: [''],
      activities: ['']
    },
    achievements: [''],
    challenges: '',
        goals: '',
    department: '',
    designation: '',
  });

  useEffect(() => {
    // Load user profile from localStorage
    const loadUserProfile = () => {
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const profile = registeredUsers.find(u => u.email === user.email);
        console.log('Loaded user profile:', profile);
        setUserProfile(profile);

        if (profile) {
          setFormData(prev => ({
            ...prev,
            facultyId: profile.email,
            facultyName: profile.name,
            facultyEmail: profile.email,
            facultyCourse: profile.courses ? profile.courses.join(', ') : '',
            department: profile.department,
            designation: profile.designation,
            teaching: {
              ...prev.teaching,
              courses: profile.courses || []
            }
          }));
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile');
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (parent, index, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: prev[parent].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (parent) => {
    setFormData(prev => ({
      ...prev,
      [parent]: [...prev[parent], '']
    }));
  };

  const removeArrayItem = (parent, index) => {
    setFormData(prev => ({
      ...prev,
      [parent]: prev[parent].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Clean up empty strings from arrays
      const cleanData = {
        ...formData,
        research: {
          ...formData.research,
          publications: formData.research.publications.filter(pub => pub.trim() !== ''),
          projects: formData.research.projects.filter(proj => proj.trim() !== '')
        },
        service: {
          ...formData.service,
          committees: formData.service.committees.filter(com => com.trim() !== ''),
          activities: formData.service.activities.filter(act => act.trim() !== '')
        },
        achievements: formData.achievements.filter(ach => ach.trim() !== '')
      };

      // Get existing appraisals
      const existingAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Check if faculty has already submitted for this semester
      const hasSubmitted = existingAppraisals.some(
        appraisal => appraisal.facultyId === cleanData.facultyId && 
                     appraisal.semester === cleanData.semester
      );

      if (hasSubmitted) {
        setError('You have already submitted an appraisal for this semester');
        return;
      }

      // Add new appraisal
      const newAppraisal = {
        ...cleanData,
        id: Date.now().toString(),
      };

      // Save to localStorage
      const updatedAppraisals = [...existingAppraisals, newAppraisal];
      localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
      
      setSuccess('Appraisal submitted successfully!');
      setTimeout(() => {
        navigate('/faculty/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError('Failed to submit appraisal. Please try again.');
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Faculty Appraisal Form
        </Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Faculty Email"
                  value={formData.facultyEmail}
                  disabled
                  id="faculty-email"
                  name="facultyEmail"
                  autoComplete="email"
                  inputProps={{ 'aria-label': 'Faculty Email' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Faculty Course"
                  value={formData.facultyCourse}
                  disabled
                  id="faculty-course"
                  name="facultyCourse"
                  autoComplete="organization"
                  inputProps={{ 'aria-label': 'Faculty Course' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.facultyName}
                  disabled
                  id="faculty-name"
                  name="facultyName"
                  autoComplete="name"
                  inputProps={{ 'aria-label': 'Faculty Name' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={formData.department}
                  disabled
                  id="faculty-department"
                  name="department"
                  autoComplete="organization"
                  inputProps={{ 'aria-label': 'Department' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  value={formData.designation}
                  disabled
                  id="faculty-designation"
                  name="designation"
                  autoComplete="organization-title"
                  inputProps={{ 'aria-label': 'Designation' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="semester-label">Semester</InputLabel>
                  <Select
                    labelId="semester-label"
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    label="Semester"
                    required
                    autoComplete="off"
                    inputProps={{ 'aria-label': 'Semester' }}
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

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Teaching Information</Typography>
                <Typography variant="subtitle1" gutterBottom>Assigned Courses:</Typography>
                {formData.teaching.courses.length > 0 ? (
                  <List>
                    {formData.teaching.courses.map((course, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={course} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">No courses assigned</Typography>
                )}
                <TextField
                  fullWidth
                  label="Total Students"
                  name="teaching.totalStudents"
                  type="number"
                  value={formData.teaching.totalStudents}
                  onChange={handleChange}
                  required
                  id="total-students"
                  autoComplete="off"
                  inputProps={{ 'aria-label': 'Total Students' }}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Average Feedback"
                  name="teaching.averageFeedback"
                  type="number"
                  inputProps={{ 
                    min: 1, 
                    max: 10,
                    'aria-label': 'Average Feedback'
                  }}
                  value={formData.teaching.averageFeedback}
                  onChange={handleChange}
                  required
                  id="average-feedback"
                  autoComplete="off"
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Research Information</Typography>
                {formData.research.publications.map((pub, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Publication ${index + 1}`}
                      value={pub}
                      onChange={(e) => handleArrayChange('research.publications', index, e.target.value)}
                      id={`publication-${index}`}
                      name={`publication-${index}`}
                      autoComplete="off"
                      inputProps={{ 'aria-label': `Publication ${index + 1}` }}
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('research.publications', index)}
                      disabled={formData.research.publications.length === 1}
                      aria-label={`Remove Publication ${index + 1}`}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('research.publications')}
                  sx={{ mt: 1 }}
                  aria-label="Add Publication"
                >
                  Add Publication
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Service Information</Typography>
                {formData.service.committees.map((committee, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Committee ${index + 1}`}
                      value={committee}
                      onChange={(e) => handleArrayChange('service.committees', index, e.target.value)}
                      id={`committee-${index}`}
                      name={`committee-${index}`}
                      autoComplete="off"
                      inputProps={{ 'aria-label': `Committee ${index + 1}` }}
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('service.committees', index)}
                      disabled={formData.service.committees.length === 1}
                      aria-label={`Remove Committee ${index + 1}`}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('service.committees')}
                  sx={{ mt: 1 }}
                  aria-label="Add Committee"
                >
                  Add Committee
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Achievements</Typography>
                {formData.achievements.map((achievement, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Achievement ${index + 1}`}
                      value={achievement}
                      onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                      id={`achievement-${index}`}
                      name={`achievement-${index}`}
                      autoComplete="off"
                      inputProps={{ 'aria-label': `Achievement ${index + 1}` }}
                    />
                    <Button
                      color="error"
                      onClick={() => removeArrayItem('achievements', index)}
                      disabled={formData.achievements.length === 1}
                      aria-label={`Remove Achievement ${index + 1}`}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addArrayItem('achievements')}
                  sx={{ mt: 1 }}
                  aria-label="Add Achievement"
                >
                  Add Achievement
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  id="challenges"
                  autoComplete="off"
                  inputProps={{ 'aria-label': 'Challenges' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  required
                  id="goals"
                  autoComplete="off"
                  inputProps={{ 'aria-label': 'Goals' }}
                />
              </Grid>

              <Grid item xs={12}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  id="submit-button"
                  aria-label="Submit Appraisal"
                >
                  Submit Appraisal
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AppraisalForm; 