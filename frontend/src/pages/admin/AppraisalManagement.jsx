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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Alert,
  Stack,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Comment as CommentIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import './Admin.css';

const AppraisalManagement = () => {
  const theme = useTheme();
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [response, setResponse] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get appraisals from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    setAppraisals(allAppraisals);
    setLoading(false);
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
            adminResponseDate: new Date().toISOString(),
          };
        }
        return a;
      });

      // Save back to localStorage
      localStorage.setItem('appraisals', JSON.stringify(updatedAppraisals));
      
      // Update local state
      setAppraisals(updatedAppraisals);

      setSuccess(`Appraisal ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
      handleCloseDialog();
    } catch (err) {
      setError('Failed to update appraisal status');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const filteredAppraisals = appraisals.filter(appraisal => {
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Pending
        return appraisal.status === 'pending';
      case 2: // Accepted
        return appraisal.status === 'accepted';
      case 3: // Rejected
        return appraisal.status === 'rejected';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  return (
    <Box className="appraisal-management-container">
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
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  fontSize: '2.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <AssessmentIcon />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Appraisal Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Review and manage faculty appraisals
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Paper 
          sx={{ 
            mb: 3, 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="All Appraisals" />
            <Tab label="Pending" />
            <Tab label="Accepted" />
            <Tab label="Rejected" />
          </Tabs>
        </Paper>

        {/* Appraisals List */}
        <Grid container spacing={3}>
          {filteredAppraisals.map((appraisal) => (
            <Grid item xs={12} key={appraisal.id}>
              <Card 
                sx={{ 
                  transition: 'all 0.3s ease',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
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
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {appraisal.description}
                        </Typography>
                        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                          <Chip
                            icon={<PersonIcon />}
                            label={appraisal.facultyName}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '16px' }}
                          />
                          <Chip
                            icon={<PersonIcon />}
                            label={appraisal.reviewerName}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '16px' }}
                          />
                          <Chip
                            icon={<CalendarIcon />}
                            label={new Date(appraisal.date).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '16px' }}
                          />
                          <Chip
                            icon={<SchoolIcon />}
                            label={appraisal.department}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '16px' }}
                          />
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(appraisal)}
                            sx={{
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.2)',
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        {appraisal.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleOpenDialog(appraisal)}
                              sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 500,
                                boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                },
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
                                boxShadow: '0 2px 8px rgba(198, 40, 40, 0.2)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(198, 40, 40, 0.3)',
                                },
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Response Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            },
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <CommentIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedAppraisal?.status === 'pending' ? 'Provide Response' : 'View Details'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Faculty Response
                </Typography>
                <Typography variant="body1" sx={{ 
                  bgcolor: 'rgba(0,0,0,0.02)',
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}>
                  {selectedAppraisal?.response || 'No response provided'}
                </Typography>
              </Box>
              {selectedAppraisal?.status === 'pending' && (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Admin Response"
                  fullWidth
                  multiline
                  rows={4}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your response message here..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            </Stack>
          </DialogContent>
          {selectedAppraisal?.status === 'pending' && (
            <DialogActions sx={{ 
              p: 3,
              bgcolor: 'rgba(0,0,0,0.02)',
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => handleResponse('accepted')}
                startIcon={<CheckCircleIcon />}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                  },
                }}
              >
                Accept
              </Button>
              <Button 
                variant="contained" 
                color="error"
                onClick={() => handleResponse('rejected')}
                startIcon={<CancelIcon />}
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(198, 40, 40, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(198, 40, 40, 0.3)',
                  },
                }}
              >
                Reject
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default AppraisalManagement; 