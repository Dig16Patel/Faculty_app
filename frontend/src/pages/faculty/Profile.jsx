import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  School as EducationIcon,
  Psychology as SpecializationIcon,
  WorkHistory as ExperienceIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    joiningDate: '',
    qualification: '',
    specialization: '',
    experience: '',
    bio: '',
  });

  useEffect(() => {
    const loadUserData = () => {
      try {
        if (user) {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            department: user.department || '',
            designation: user.designation || '',
            joiningDate: user.joiningDate || '',
            qualification: user.qualification || '',
            specialization: user.specialization || '',
            experience: user.experience || '',
            bio: user.bio || '',
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        department: user.department || '',
        designation: user.designation || '',
        joiningDate: user.joiningDate || '',
        qualification: user.qualification || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        bio: user.bio || '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get current user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Update user data with new values
      const updatedUserData = {
        ...userData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        department: formData.department,
        designation: formData.designation,
        joiningDate: formData.joiningDate,
        qualification: formData.qualification,
        specialization: formData.specialization,
        experience: formData.experience,
        bio: formData.bio,
      };

      // Save updated user data back to localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Update the user in the context
      Object.assign(user, updatedUserData);
      
      // Update registered users list
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedRegisteredUsers = registeredUsers.map(u => {
        if (u.email === userData.email) {
          return {
            ...u,
            name: formData.name,
            email: formData.email,
            contactNumber: formData.phone,
            address: formData.address,
            department: formData.department,
            designation: formData.designation,
            joiningDate: formData.joiningDate,
            qualification: formData.qualification,
            specialization: formData.specialization,
            experience: formData.experience,
            bio: formData.bio,
          };
        }
        return u;
      });
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedRegisteredUsers));
      
      setError(null);
      handleCloseDialog();
      alert('Profile updated successfully!');
      
      // Force a re-render by updating the form data
      setFormData(updatedUserData);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, lg: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 2,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          Profile
          <Chip
            icon={<VerifiedIcon />}
            label="Verified"
            color="primary"
            size="small"
            sx={{ ml: 2 }}
          />
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Fade in timeout={500}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)',
                    backgroundSize: '30px 30px',
                    opacity: 0.1,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid white',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.name}
                      <Tooltip title="Verified Profile">
                        <VerifiedIcon sx={{ fontSize: 24, color: '#fff' }} />
                      </Tooltip>
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.designation}
                      <StarIcon sx={{ fontSize: 20, color: '#ffd700' }} />
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Fade>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={500} style={{ transitionDelay: '100ms' }}>
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
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">{user.phone || 'Not specified'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">{user.address || 'Not specified'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <Fade in timeout={500} style={{ transitionDelay: '200ms' }}>
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
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Professional Information
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">{user.department || 'Not specified'}</Typography>
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">{user.designation || 'Not specified'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ color: '#3b82f6', mr: 2 }} />
                    <Typography variant="body1">
                      Joined: {formatDate(user.joiningDate)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Academic Information */}
          <Grid item xs={12}>
            <Fade in timeout={500} style={{ transitionDelay: '300ms' }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#1e293b',
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Academic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EducationIcon sx={{ color: '#3b82f6' }} />
                          Qualification
                        </Typography>
                        <Typography variant="body1">
                          {user.qualification || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpecializationIcon sx={{ color: '#3b82f6' }} />
                          Specialization
                        </Typography>
                        <Typography variant="body1">
                          {user.specialization || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ExperienceIcon sx={{ color: '#3b82f6' }} />
                          Experience
                        </Typography>
                        <Typography variant="body1">
                          {user.experience || 'Not specified'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                          Bio
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {user.bio || 'No bio available'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Edit Button at Bottom */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenDialog}
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
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon sx={{ color: '#3b82f6' }} />
          Edit Profile
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  disabled
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  backgroundColor: 'rgba(100, 116, 139, 0.04)',
                },
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
                textTransform: 'none',
              }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile;