import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const Appraisal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    semester: '',
    teachingEffectiveness: '',
    researchProductivity: '',
    serviceContribution: '',
    professionalDevelopment: '',
    studentFeedback: '',
    comments: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get existing appraisals
      const existingAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Check if faculty has already submitted an appraisal for this semester
      const hasSubmitted = existingAppraisals.some(
        appraisal => appraisal.facultyId === user.email && appraisal.semester === formData.semester
      );

      if (hasSubmitted) {
        setError('You have already submitted an appraisal for this semester');
        setLoading(false);
        return;
      }

      // Create new appraisal with faculty ID
      const newAppraisal = {
        ...formData,
        id: Date.now().toString(),
        facultyId: user.email,
        facultyName: user.name,
        department: user.department,
        designation: user.designation,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // Add to existing appraisals
      const updatedAppraisals = [...existingAppraisals, newAppraisal];
      localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));

      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        semester: '',
        teachingEffectiveness: '',
        researchProductivity: '',
        serviceContribution: '',
        professionalDevelopment: '',
        studentFeedback: '',
        comments: '',
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/faculty/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError('Failed to submit appraisal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submit Appraisal
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit} autoComplete="on">
          <FormControl fullWidth sx={{ mb: 2 }}>
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
            >
              <MenuItem value="Spring 2024">Spring 2024</MenuItem>
              <MenuItem value="Fall 2024">Fall 2024</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            id="teachingEffectiveness"
            name="teachingEffectiveness"
            label="Teaching Effectiveness"
            value={formData.teachingEffectiveness}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            autoComplete="off"
          />

          <TextField
            fullWidth
            id="researchProductivity"
            name="researchProductivity"
            label="Research Productivity"
            value={formData.researchProductivity}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            autoComplete="off"
          />

          <TextField
            fullWidth
            id="serviceContribution"
            name="serviceContribution"
            label="Service Contribution"
            value={formData.serviceContribution}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            autoComplete="off"
          />

          <TextField
            fullWidth
            id="professionalDevelopment"
            name="professionalDevelopment"
            label="Professional Development"
            value={formData.professionalDevelopment}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            autoComplete="off"
          />

          <TextField
            fullWidth
            id="studentFeedback"
            name="studentFeedback"
            label="Student Feedback"
            value={formData.studentFeedback}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            autoComplete="off"
          />

          <TextField
            fullWidth
            id="comments"
            name="comments"
            label="Additional Comments"
            value={formData.comments}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            autoComplete="off"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Submitting...' : 'Submit Appraisal'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={1000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Appraisal submitted successfully! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Appraisal; 