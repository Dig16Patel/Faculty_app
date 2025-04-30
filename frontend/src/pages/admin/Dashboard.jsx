import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  LinearProgress,
  Avatar,
  Divider,
  useTheme,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import './Admin.css';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 3,
      },
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={70} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
          },
        }} 
      />
    </CardContent>
    <CardActions>
      <Button 
        size="small" 
        color="primary"
        onClick={onClick}
        startIcon={<AddIcon />}
      >
        Add New
      </Button>
    </CardActions>
  </Card>
);

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFaculty: 0,
    pendingAppraisals: 0,
    completedAppraisals: 0,
    totalDepartments: 0,
  });
  const [recentAppraisals, setRecentAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = () => {
      try {
        // Get data from localStorage
        const appraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const facultyUsers = registeredUsers.filter(user => user.role === 'faculty');
        
        // Calculate stats
        setStats({
          totalFaculty: facultyUsers.length,
          pendingAppraisals: appraisals.filter(a => a.status === 'pending').length,
          completedAppraisals: appraisals.filter(a => a.status === 'accepted' || a.status === 'rejected').length,
          totalDepartments: new Set(appraisals.map(a => a.department)).size,
        });

        // Get recent appraisals (pending only)
        const recent = appraisals
          .filter(a => a.status === 'pending')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setRecentAppraisals(recent);
      } catch (error) {
        console.error('Error processing data:', error);
        setStats({
          totalFaculty: 0,
          pendingAppraisals: 0,
          completedAppraisals: 0,
          totalDepartments: 0,
        });
        setRecentAppraisals([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data immediately
    fetchData();

    // Set up an interval to refresh data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [user, navigate]);

  // Show loading state while checking authentication
  if (!user || user.role !== 'admin') {
    return <CircularProgress />;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box className="admin-dashboard-container">
      <Container maxWidth="lg">
        {/* Welcome Section */}
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
                <AdminPanelSettingsIcon />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Welcome, Admin
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Here's an overview of your faculty appraisal system
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Faculty"
              value={stats.totalFaculty}
              icon={<GroupIcon />}
              color={theme.palette.primary.main}
              onClick={() => navigate('/admin/faculty')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Appraisals"
              value={stats.pendingAppraisals}
              icon={<AssessmentIcon />}
              color={theme.palette.warning.main}
              onClick={() => navigate('/admin/appraisals')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed Appraisals"
              value={stats.completedAppraisals}
              icon={<CheckCircleIcon />}
              color={theme.palette.success.main}
              onClick={() => navigate('/admin/appraisals')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Departments"
              value={stats.totalDepartments}
              icon={<SchoolIcon />}
              color={theme.palette.secondary.main}
              onClick={() => navigate('/admin/faculty')}
            />
          </Grid>
        </Grid>

        {/* Recent Appraisals */}
        <Paper sx={{ p: 3, borderRadius: '12px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recent Pending Appraisals
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/admin/appraisals')}
              startIcon={<AssessmentIcon />}
            >
              View All
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Faculty Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id}>
                    <TableCell>{appraisal.facultyName}</TableCell>
                    <TableCell>{appraisal.department}</TableCell>
                    <TableCell>
                      {new Date(appraisal.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appraisal.status.toUpperCase()}
                        color="warning"
                        size="small"
                        sx={{ borderRadius: '16px' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/admin/appraisal-management`)}
                        startIcon={<AssessmentIcon />}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;