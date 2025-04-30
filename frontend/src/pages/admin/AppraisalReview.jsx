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
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Comment as CommentIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const AdminAppraisalReview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Get all appraisals from localStorage
      const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Get all faculty users
      const facultyUsers = JSON.parse(localStorage.getItem('users') || '[]')
        .filter(user => user.role === 'faculty');

      // Get all appraisals with faculty details
      const appraisalsWithFaculty = allAppraisals.map(appraisal => {
        // Match faculty by either facultyEmail or facultyId
        const faculty = facultyUsers.find(f => 
          f.email === appraisal.facultyEmail || f.email === appraisal.facultyId
        );
        return {
          ...appraisal,
          facultyName: faculty ? faculty.name : 'Unknown Faculty',
          facultyDepartment: faculty ? faculty.department : 'Unknown Department',
          facultyEmail: faculty ? faculty.email : (appraisal.facultyEmail || appraisal.facultyId)
        };
      });

      // Filter appraisals that need review (pending status)
      const pendingAppraisals = appraisalsWithFaculty.filter(
        a => a.status === 'pending'
      );

      // Sort by submission date (newest first)
      pendingAppraisals.sort((a, b) => 
        new Date(b.submissionDate || b.date) - new Date(a.submissionDate || a.date)
      );

      console.log('Fetched appraisals:', pendingAppraisals); // Debug log
      setAppraisals(pendingAppraisals);
    } catch (error) {
      console.error('Error fetching appraisals:', error);
      setError('Failed to load appraisals. Please try again.');
    }
  }, []);

  const handleOpenDialog = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppraisal(null);
    setResponse('');
  };

  const handleResponse = (status) => {
    if (!response.trim()) {
      setError('Please provide a response message');
      return;
    }

    try {
      // Get all appraisals
      const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Update the selected appraisal
      const updatedAppraisals = allAppraisals.map(a => {
        if (a.id === selectedAppraisal.id) {
          return {
            ...a,
            status: status,
            adminResponse: response,
            adminId: user.id,
            adminName: user.name,
            reviewDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          };
        }
        return a;
      });

      // Save back to localStorage
      localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
      
      // Update local state
      setAppraisals(updatedAppraisals.filter(a => a.status === 'pending'));

      setSuccess(`Appraisal ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating appraisal:', err);
      setError('Failed to update appraisal status');
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
    <Box className="appraisal-review-container">
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
                Appraisal Reviews
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Review and respond to faculty appraisals
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
                  <Grid container spacing={2}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {appraisal.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {appraisal.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={<PersonIcon />}
                          label={appraisal.facultyName}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<CalendarIcon />}
                          label={`${appraisal.academicYear} - Semester ${appraisal.semester}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<SchoolIcon />}
                          label={appraisal.facultyDepartment}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<BookIcon />}
                          label={appraisal.course}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Grid>

                    {/* Performance Scores */}
                    <Grid item xs={12}>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
            <TableHead>
              <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell align="right">Score (%)</TableCell>
                              <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                            <TableRow>
                              <TableCell>Teaching</TableCell>
                              <TableCell align="right">{appraisal.teaching?.teachingScore?.toFixed(2)}</TableCell>
                  <TableCell>
                                <Typography variant="body2">
                                  Total Students: {appraisal.teaching?.totalStudents}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {appraisal.teaching?.courses?.join(', ')}
                                </Typography>
                  </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Research</TableCell>
                              <TableCell align="right">{appraisal.research?.researchScore?.toFixed(2)}</TableCell>
                  <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {appraisal.research?.projects?.join(', ')}
                                </Typography>
                  </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Service</TableCell>
                              <TableCell align="right">{appraisal.service?.serviceScore?.toFixed(2)}</TableCell>
                  <TableCell>
                                <Typography variant="body2">
                                  Average Feedback: {appraisal.service?.averageFeedback?.toFixed(2)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {appraisal.service?.committees?.join(', ')}
                                </Typography>
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AssessmentIcon />}
                          onClick={() => handleOpenDialog(appraisal)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleOpenDialog(appraisal)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleOpenDialog(appraisal)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Response Dialog */}
      <Dialog
        open={openDialog} 
        onClose={handleCloseDialog}
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
          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                  <Typography variant="body1">{selectedAppraisal?.title}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selectedAppraisal?.description}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Academic Year</Typography>
                  <Typography variant="body1">{selectedAppraisal?.academicYear}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Semester</Typography>
                  <Typography variant="body1">Semester {selectedAppraisal?.semester}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                  <Typography variant="body1">{selectedAppraisal?.facultyDepartment}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Course</Typography>
                  <Typography variant="body1">{selectedAppraisal?.course}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Faculty Name</Typography>
                  <Typography variant="body1">{selectedAppraisal?.facultyName}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Teaching Performance */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Teaching Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Teaching Score</Typography>
                  <Typography variant="body1">{selectedAppraisal?.teaching?.teachingScore?.toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Total Students</Typography>
                  <Typography variant="body1">{selectedAppraisal?.teaching?.totalStudents}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">Average Feedback</Typography>
                  <Typography variant="body1">{selectedAppraisal?.teaching?.averageFeedback?.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Courses</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.teaching?.courses?.join(', ') || 'No courses listed'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Research Performance */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Research Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Research Score</Typography>
                  <Typography variant="body1">{selectedAppraisal?.research?.researchScore?.toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Projects</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.research?.projects?.join(', ') || 'No projects listed'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Service Performance */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Service Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service Score</Typography>
                  <Typography variant="body1">{selectedAppraisal?.service?.serviceScore?.toFixed(2)}%</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">Average Feedback</Typography>
                  <Typography variant="body1">{selectedAppraisal?.service?.averageFeedback?.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Committees</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.service?.committees?.join(', ') || 'No committees listed'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Activities</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.service?.activities?.join(', ') || 'No activities listed'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Additional Information */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Achievements</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.achievements?.join(', ') || 'No achievements listed'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Challenges</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.challenges || 'No challenges listed'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Goals</Typography>
                  <Typography variant="body1">
                    {selectedAppraisal?.goals || 'No goals listed'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Faculty Response Section */}
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Faculty Response
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50',
                  borderRadius: '8px',
                  mb: 2
                }}
              >
                <Typography variant="body1">
                  {selectedAppraisal?.facultyResponse || 'No response provided'}
                </Typography>
                {selectedAppraisal?.responseDate && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Responded on: {new Date(selectedAppraisal.responseDate).toLocaleString()}
                  </Typography>
                )}
              </Paper>
            </Box>

            <Divider />

            {/* Admin Response Section */}
            {selectedAppraisal?.status === 'pending' && (
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Admin Response
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Your Response"
                  fullWidth
                  multiline
                  rows={4}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response here..."
                  id="admin-response-message"
                  name="admin-response-message"
                  required
                  error={!response.trim()}
                  helperText={!response.trim() ? "Response is required" : ""}
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedAppraisal?.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleResponse('rejected')}
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
              >
                Reject
              </Button>
          <Button
                onClick={() => handleResponse('accepted')}
            variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
          >
                Accept
          </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAppraisalReview; 