import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Pending as PendingIcon, CheckCircle as CompletedIcon, Cancel as RejectedIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AppraisalForm = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [appraisals, setAppraisals] = useState({
    pending: [],
    completed: [],
    rejected: [],
  });
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    academicYear: new Date().getFullYear().toString(),
    title: '',
    description: '',
    category: 'teaching',
  });

  // Load appraisals on component mount
  React.useEffect(() => {
    const loadAppraisals = () => {
      try {
        const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        const userAppraisals = allAppraisals.filter(appraisal => appraisal.facultyEmail === user.email);
        
        setAppraisals({
          pending: userAppraisals.filter(appraisal => appraisal.status === 'pending'),
          completed: userAppraisals.filter(appraisal => appraisal.status === 'completed'),
          rejected: userAppraisals.filter(appraisal => appraisal.status === 'rejected'),
        });
      } catch (err) {
        console.error('Error loading appraisals:', err);
      }
    };

    loadAppraisals();
  }, [user.email]);

  const handleOpen = (status) => {
    setSelectedStatus(status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStatus(null);
    setFormData({
      academicYear: new Date().getFullYear().toString(),
      title: '',
      description: '',
      category: 'teaching',
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Get existing appraisals
      const existingAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
      
      // Create new appraisal
      const newAppraisal = {
        id: Date.now().toString(),
        facultyId: user.email,
        facultyName: user.name,
        facultyEmail: user.email,
        department: user.department,
        ...formData,
        status: 'pending',
        submissionDate: new Date().toISOString(),
      };

      // Add to existing appraisals
      existingAppraisals.push(newAppraisal);
      
      // Save back to localStorage
      localStorage.setItem('appraisals', JSON.stringify(existingAppraisals));
      
      handleClose();
    } catch (err) {
      console.error('Error submitting appraisal:', err);
      setError('Failed to submit appraisal. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: getStatusColor(status), fontSize: 28 }} />;
      case 'completed':
        return <CompletedIcon sx={{ color: getStatusColor(status), fontSize: 28 }} />;
      case 'rejected':
        return <RejectedIcon sx={{ color: getStatusColor(status), fontSize: 28 }} />;
      default:
        return null;
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Appraisals';
      case 'completed':
        return 'Completed Appraisals';
      case 'rejected':
        return 'Rejected Appraisals';
      default:
        return 'Appraisals';
    }
  };

  return (
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
          <AddIcon sx={{ color: '#3b82f6', fontSize: 28, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
            }}
          >
            New Appraisal
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Submit a new appraisal for review. Fill in the details below to get started.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen('pending')}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
            textTransform: 'none',
            px: 4,
            py: 1.5,
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
            },
          }}
        >
          Start New Appraisal
        </Button>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PendingIcon sx={{ color: '#f59e0b' }} />}
            onClick={() => handleOpen('pending')}
            sx={{
              borderColor: '#f59e0b',
              color: '#f59e0b',
              '&:hover': {
                borderColor: '#d97706',
                backgroundColor: '#fef3c7',
              },
              textTransform: 'none',
              py: 1.5,
              borderRadius: '12px',
            }}
          >
            View Pending Appraisals ({appraisals.pending.length})
          </Button>

          <Button
            variant="outlined"
            startIcon={<CompletedIcon sx={{ color: '#10b981' }} />}
            onClick={() => handleOpen('completed')}
            sx={{
              borderColor: '#10b981',
              color: '#10b981',
              '&:hover': {
                borderColor: '#059669',
                backgroundColor: '#d1fae5',
              },
              textTransform: 'none',
              py: 1.5,
              borderRadius: '12px',
            }}
          >
            View Completed Appraisals ({appraisals.completed.length})
          </Button>

          <Button
            variant="outlined"
            startIcon={<RejectedIcon sx={{ color: '#ef4444' }} />}
            onClick={() => handleOpen('rejected')}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: '#fee2e2',
              },
              textTransform: 'none',
              py: 1.5,
              borderRadius: '12px',
            }}
          >
            View Rejected Appraisals ({appraisals.rejected.length})
          </Button>
        </Box>

        {/* Appraisal List Dialog */}
        <Dialog 
          open={open} 
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            {getStatusIcon(selectedStatus)}
            {getStatusTitle(selectedStatus)}
          </DialogTitle>
          <DialogContent>
            <List>
              {appraisals[selectedStatus]?.map((appraisal, index) => (
                <React.Fragment key={appraisal.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {appraisal.title}
                          </Typography>
                          <Chip
                            label={appraisal.category}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(selectedStatus)}20`,
                              color: getStatusColor(selectedStatus),
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Academic Year: {appraisal.academicYear}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Submitted on: {new Date(appraisal.submissionDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Description: {appraisal.description}
                          </Typography>
                          {appraisal.adminResponse && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Admin Response:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {appraisal.adminResponse}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < appraisals[selectedStatus].length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleClose}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AppraisalForm; 