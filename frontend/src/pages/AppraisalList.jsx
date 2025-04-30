import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppraisalList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [open, setOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        setLoading(true);
        setError('');

        // Get all appraisals from localStorage
        const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        console.log('All Appraisals from localStorage:', allAppraisals);
        
        // Get user profile data for courses
        const userProfiles = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Filter appraisals based on user role
        let filteredAppraisals;
        if (user.role.toLowerCase() === 'administrator') {
          // Admin sees all appraisals
          filteredAppraisals = allAppraisals;
        } else {
          // Faculty only sees their own appraisals
          filteredAppraisals = allAppraisals.filter(
            appraisal => appraisal.facultyId === user.email
          );
        }

        // Sort appraisals by submission date (newest first)
        filteredAppraisals.sort((a, b) => {
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        });

        // Map the data to match the expected structure
        filteredAppraisals = filteredAppraisals.map(appraisal => {
          // Find the faculty's profile to get their courses
          const facultyProfile = userProfiles.find(profile => profile.email === appraisal.facultyId);
          const facultyCourses = facultyProfile?.courses || [];

          return {
            id: appraisal.id,
            facultyName: String(appraisal.facultyName || ''),
            department: String(appraisal.department || ''),
            designation: String(appraisal.designation || ''),
            semester: String(appraisal.semester || ''),
            status: String(appraisal.status || 'pending'),
            submittedAt: String(appraisal.submissionDate || new Date().toISOString()),
            facultyId: String(appraisal.facultyId || user.email), // Use email as facultyId
            teachingEffectiveness: String(appraisal.teaching?.averageFeedback || ''),
            researchProductivity: String(appraisal.research?.publications?.join(', ') || ''),
            serviceContribution: String(appraisal.service?.committees?.join(', ') || ''),
            professionalDevelopment: String(appraisal.achievements?.join(', ') || ''),
            studentFeedback: String(appraisal.teaching?.averageFeedback || ''),
            comments: String(appraisal.challenges || ''),
            goals: String(appraisal.goals || ''),
            academicYear: String(appraisal.academicYear || ''),
            teaching: {
              ...appraisal.teaching,
              courses: facultyCourses, // Use courses from faculty profile
            }
          };
        });

        console.log('Mapped appraisals:', filteredAppraisals);
        setAppraisals(filteredAppraisals);
      } catch (err) {
        console.error('Error fetching appraisals:', err);
        setError('Failed to load appraisals');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppraisals();
    }
  }, [user]);

  const handleViewDetails = (appraisal) => {
    console.log('Viewing appraisal:', appraisal);
    
    // Get the full appraisal data from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    const userProfiles = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('All appraisals from localStorage:', allAppraisals);
    
    // Find the specific appraisal by ID
    const fullAppraisal = allAppraisals.find(a => a.id === appraisal.id);
    console.log('Found appraisal:', fullAppraisal);
    
    if (fullAppraisal) {
      // Find the faculty's profile to get their courses
      const facultyProfile = userProfiles.find(profile => profile.email === fullAppraisal.facultyId);
      const facultyCourses = facultyProfile?.courses || [];

      // Map the data to match the expected structure
      const safeAppraisal = {
        id: fullAppraisal.id,
        facultyName: String(fullAppraisal.facultyName || ''),
        department: String(fullAppraisal.department || ''),
        designation: String(fullAppraisal.designation || ''),
        semester: String(fullAppraisal.semester || ''),
        status: String(fullAppraisal.status || 'pending'),
        submittedAt: String(fullAppraisal.submissionDate || new Date().toISOString()),
        facultyId: String(fullAppraisal.facultyId || user.email), // Use email as facultyId
        teachingEffectiveness: String(fullAppraisal.teaching?.averageFeedback || ''),
        researchProductivity: String(fullAppraisal.research?.publications?.join(', ') || ''),
        serviceContribution: String(fullAppraisal.service?.committees?.join(', ') || ''),
        professionalDevelopment: String(fullAppraisal.achievements?.join(', ') || ''),
        studentFeedback: String(fullAppraisal.teaching?.averageFeedback || ''),
        comments: String(fullAppraisal.challenges || ''),
        goals: String(fullAppraisal.goals || ''),
        academicYear: String(fullAppraisal.academicYear || ''),
        teaching: {
          ...fullAppraisal.teaching,
          courses: facultyCourses, // Use courses from faculty profile
        }
      };
      
      console.log('Safe appraisal data:', safeAppraisal);
      setSelectedAppraisal(safeAppraisal);
      setAdminResponse(safeAppraisal.adminResponse || '');
      setOpen(true);
    } else {
      console.error('Appraisal not found:', appraisal.id);
      setError('Failed to load appraisal details');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppraisal(null);
    setAdminResponse('');
  };

  const handleAdminResponse = () => {
    if (!selectedAppraisal) return;

    const updatedAppraisals = appraisals.map(appraisal => {
      if (appraisal.id === selectedAppraisal.id) {
        return {
          ...appraisal,
          adminResponse: adminResponse,
          status: 'reviewed'
        };
      }
      return appraisal;
    });

    localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
    setAppraisals(updatedAppraisals);
    handleClose();
  };

  const handleReject = () => {
    if (!selectedAppraisal) return;

    const updatedAppraisals = appraisals.map(appraisal => {
      if (appraisal.id === selectedAppraisal.id) {
        return {
          ...appraisal,
          adminResponse: adminResponse,
          status: 'rejected'
        };
      }
      return appraisal;
    });

    localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
    setAppraisals(updatedAppraisals);
    handleClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'reviewed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!appraisals.length) {
    return (
      <Container>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Appraisal List
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            No appraisals found. {user.role.toLowerCase() === 'faculty' ? 'Submit a new appraisal to get started.' : 'Faculty members need to submit appraisals first.'}
          </Alert>
          {user.role.toLowerCase() === 'faculty' && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/faculty/appraisal')}
              sx={{ mt: 2 }}
            >
              Submit New Appraisal
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Appraisal List
        </Typography>
        {user.role.toLowerCase() === 'faculty' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/faculty/appraisal')}
            sx={{ mb: 2 }}
          >
            Submit New Appraisal
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="appraisals table">
          <TableHead>
            <TableRow>
              <TableCell>Faculty Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appraisals.map((appraisal) => (
              <TableRow key={appraisal.id}>
                <TableCell>{appraisal.facultyName}</TableCell>
                <TableCell>{appraisal.department}</TableCell>
                <TableCell>{appraisal.designation}</TableCell>
                <TableCell>{appraisal.semester}</TableCell>
                <TableCell>
                  <Chip 
                    label={appraisal.status} 
                    color={getStatusColor(appraisal.status)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(appraisal.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleViewDetails(appraisal)}
                    id={`view-details-${appraisal.id}`}
                    name={`view-details-${appraisal.id}`}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="appraisal-details-title"
        aria-describedby="appraisal-details-description"
      >
        <DialogTitle id="appraisal-details-title">Appraisal Details</DialogTitle>
        <DialogContent id="appraisal-details-description">
          {selectedAppraisal && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Typography><strong>Faculty Name:</strong> {selectedAppraisal.facultyName}</Typography>
                <Typography><strong>Semester:</strong> {selectedAppraisal.semester}</Typography>
                <Typography><strong>Academic Year:</strong> {selectedAppraisal.academicYear}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    label={selectedAppraisal.status} 
                    color={getStatusColor(selectedAppraisal.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Teaching Information</Typography>
                {selectedAppraisal.teaching?.courses?.length > 0 && (
                  <>
                    <Typography><strong>Courses:</strong></Typography>
                    <ul>
                      {selectedAppraisal.teaching.courses.map((course, index) => (
                        <li key={index}>{course}</li>
                      ))}
                    </ul>
                  </>
                )}
                <Typography><strong>Total Students:</strong> {selectedAppraisal.teaching?.totalStudents}</Typography>
                <Typography><strong>Average Feedback:</strong> {selectedAppraisal.teaching?.averageFeedback}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Research Information</Typography>
                {selectedAppraisal.research?.publications?.length > 0 && (
                  <>
                    <Typography><strong>Publications:</strong></Typography>
                    <ul>
                      {selectedAppraisal.research.publications.map((pub, index) => (
                        <li key={index}>{pub}</li>
                      ))}
                    </ul>
                  </>
                )}
                {selectedAppraisal.research?.projects?.length > 0 && (
                  <>
                    <Typography><strong>Projects:</strong></Typography>
                    <ul>
                      {selectedAppraisal.research.projects.map((project, index) => (
                        <li key={index}>{project}</li>
                      ))}
                    </ul>
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Service Information</Typography>
                {selectedAppraisal.service?.committees?.length > 0 && (
                  <>
                    <Typography><strong>Committees:</strong></Typography>
                    <ul>
                      {selectedAppraisal.service.committees.map((committee, index) => (
                        <li key={index}>{committee}</li>
                      ))}
                    </ul>
                  </>
                )}
                {selectedAppraisal.service?.activities?.length > 0 && (
                  <>
                    <Typography><strong>Activities:</strong></Typography>
                    <ul>
                      {selectedAppraisal.service.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </>
                )}
              </Grid>

              {selectedAppraisal.achievements?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Achievements</Typography>
                  <ul>
                    {selectedAppraisal.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Goals and Challenges</Typography>
                <Typography><strong>Challenges:</strong></Typography>
                <Typography paragraph>{selectedAppraisal.comments}</Typography>
                <Typography><strong>Goals:</strong></Typography>
                <Typography paragraph>{selectedAppraisal.goals}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Faculty Response</Typography>
                <Typography paragraph>
                  {selectedAppraisal.facultyResponse || 'No response provided'}
                </Typography>
              </Grid>

              {user?.role === 'admin' && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Admin Response</Typography>
                  <Box sx={{ mt: 2 }}>
                    <label htmlFor="admin-response-field" className="visually-hidden">
                      Admin Response
                    </label>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Enter your response..."
                      id="admin-response-field"
                      name="adminResponse"
                      aria-label="Admin Response"
                      inputProps={{
                        'aria-labelledby': 'admin-response-label'
                      }}
                    />
                  </Box>
                </Grid>
              )}

              {user?.role === 'faculty' && selectedAppraisal.adminResponse && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom id="admin-response-readonly">Admin Response</Typography>
                  <Typography 
                    paragraph 
                    aria-labelledby="admin-response-readonly"
                  >
                    {selectedAppraisal.adminResponse}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            id="dialog-close-button"
            name="dialogClose"
            aria-label="Close dialog"
          >
            Close
          </Button>
          {user?.role === 'admin' && (
            <>
              <Button 
                onClick={handleReject} 
                color="error"
                id="reject-button"
                name="rejectAppraisal"
                aria-label="Reject appraisal"
              >
                Reject
              </Button>
              <Button 
                onClick={handleAdminResponse} 
                color="primary"
                id="accept-button"
                name="acceptAppraisal"
                aria-label="Accept appraisal"
              >
                Accept
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <style jsx>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </Container>
  );
};

export default AppraisalList; 