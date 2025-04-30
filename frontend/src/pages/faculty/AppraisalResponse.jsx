import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  useTheme,
  Alert,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Comment as CommentIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Faculty.css';

const AppraisalResponse = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get appraisals from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    // Filter appraisals for current faculty
    const facultyAppraisals = allAppraisals.filter(
      a => (a.facultyId === user?.email || a.facultyEmail === user?.email)
    );
    setAppraisals(facultyAppraisals);
  }, [user]);

  const handleOpenDialog = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setResponse(appraisal.facultyResponse || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppraisal(null);
    setResponse('');
  };

  const handleOpenDetailsDialog = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedAppraisal(null);
  };

  const toggleAppraisalDetails = (appraisal) => {
    setSelectedAppraisal(selectedAppraisal?.id === appraisal.id ? null : appraisal);
  };

  const handleResponse = () => {
    if (!response.trim()) {
      setError('Please provide a response message');
      return;
    }

    try {
      const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      const updatedAppraisals = allAppraisals.map(a => {
        if (a.id === selectedAppraisal.id) {
          return {
            ...a,
            facultyResponse: response,
            responseDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
        }
        return a;
      });

      localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
      const facultyAppraisals = updatedAppraisals.filter(
        a => (a.facultyId === user?.email || a.facultyEmail === user?.email)
      );
      setAppraisals(facultyAppraisals);
      setSuccess('Response submitted successfully!');
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating response:', err);
      setError('Failed to submit response');
    }
  };

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

  return (
    <Box className="appraisal-response-container">
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
                Appraisal Responses
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Review and respond to your pending appraisals
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

        {/* Appraisals List */}
        <Grid container spacing={3}>
          {appraisals.map((appraisal) => (
            <Grid item xs={12} key={appraisal.id}>
              <Card 
                sx={{ 
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Stack spacing={1}>
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { color: theme.palette.primary.main }
                          }}
                          onClick={() => toggleAppraisalDetails(appraisal)}
                        >
                          {appraisal.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appraisal.description}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            icon={<PersonIcon />}
                            label={appraisal.reviewerName}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<CalendarIcon />}
                            label={new Date(appraisal.date).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<SchoolIcon />}
                            label={appraisal.department}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenDialog(appraisal)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleOpenDialog(appraisal)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Faculty Appraisal Data */}
                  {selectedAppraisal?.id === appraisal.id && (
                    <Box sx={{ mt: 3 }}>
                      <Divider sx={{ my: 2 }} />
                      <Grid container spacing={3}>
                        {/* Teaching Performance */}
                        <Grid item xs={12} md={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                              Teaching Performance
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Score</Typography>
                                <Typography variant="body1">{appraisal.teaching?.score || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Total Students</Typography>
                                <Typography variant="body1">{appraisal.teaching?.totalStudents || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Average Feedback</Typography>
                                <Typography variant="body1">{appraisal.teaching?.averageFeedback || 'N/A'}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>

                        {/* Research Performance */}
                        <Grid item xs={12} md={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                              Research Performance
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Score</Typography>
                                <Typography variant="body1">{appraisal.research?.score || 'N/A'}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>

                        {/* Service Performance */}
                        <Grid item xs={12} md={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                              Service Performance
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Score</Typography>
                                <Typography variant="body1">{appraisal.service?.score || 'N/A'}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>

                        {/* Additional Information */}
                        <Grid item xs={12} md={6}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                              Additional Information
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Achievements</Typography>
                                <Typography variant="body1">{appraisal.achievements || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Challenges</Typography>
                                <Typography variant="body1">{appraisal.challenges || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">Goals</Typography>
                                <Typography variant="body1">{appraisal.goals || 'N/A'}</Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Response Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <CommentIcon color="primary" />
              <Typography variant="h6">
                Faculty Response
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {/* Appraisal Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Appraisal Details
              </Typography>
              <Typography variant="body1">
                {selectedAppraisal?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedAppraisal?.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Admin Response if exists */}
            {selectedAppraisal?.adminResponse && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Admin Response
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedAppraisal.adminResponse}
                </Typography>
              </Box>
            )}

            {/* Faculty Response Input */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Your Response
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                fullWidth
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response here..."
                required
                error={!response.trim()}
                helperText={!response.trim() ? "Response is required" : ""}
                id="faculty-response"
                name="faculty-response"
              />
            </Box>

            {/* Display existing faculty response if any */}
            {selectedAppraisal?.facultyResponse && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Your Previous Response
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1" paragraph>
                    {selectedAppraisal.facultyResponse}
                  </Typography>
                  {selectedAppraisal.responseDate && (
                    <Typography variant="caption" color="text.secondary">
                      Submitted on: {new Date(selectedAppraisal.responseDate).toLocaleString()}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleResponse}
              disabled={!response.trim()}
              startIcon={<CommentIcon />}
            >
              Submit Response
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog 
          open={openDetailsDialog} 
          onClose={handleCloseDetailsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <AssessmentIcon color="primary" />
              <Typography variant="h6">
                Appraisal Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Basic Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Title</Typography>
                        <Typography variant="body1">{selectedAppraisal?.title}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Description</Typography>
                        <Typography variant="body1">{selectedAppraisal?.description}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Department</Typography>
                        <Typography variant="body1">{selectedAppraisal?.department}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Course</Typography>
                        <Typography variant="body1">{selectedAppraisal?.course}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Teaching Performance */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Teaching Performance
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Score</Typography>
                        <Typography variant="body1">{selectedAppraisal?.teaching?.score || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">Total Students</Typography>
                        <Typography variant="body1">{selectedAppraisal?.teaching?.totalStudents || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Average Feedback</Typography>
                        <Typography variant="body1">{selectedAppraisal?.teaching?.averageFeedback || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Research Performance */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Research Performance
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Score</Typography>
                        <Typography variant="body1">{selectedAppraisal?.research?.score || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Service Performance */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Service Performance
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Score</Typography>
                        <Typography variant="body1">{selectedAppraisal?.service?.score || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Additional Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Additional Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Achievements</Typography>
                        <Typography variant="body1">{selectedAppraisal?.achievements || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Challenges</Typography>
                        <Typography variant="body1">{selectedAppraisal?.challenges || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Goals</Typography>
                        <Typography variant="body1">{selectedAppraisal?.goals || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AppraisalResponse; 