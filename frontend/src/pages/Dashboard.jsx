import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalAppraisals: 0,
    pendingAppraisals: 0,
    completedAppraisals: 0,
  });
  const [recentAppraisals, setRecentAppraisals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get all appraisals from localStorage
        const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        
        // Get all faculty from localStorage
        const allFaculty = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          .filter(user => user.role.toLowerCase() === 'faculty');

        if (user.role.toLowerCase() === 'administrator') {
          // Admin sees all appraisals
          setStats({
            totalFaculty: allFaculty.length,
            totalAppraisals: allAppraisals.length,
            pendingAppraisals: allAppraisals.filter(a => a.status === 'pending').length,
            completedAppraisals: allAppraisals.filter(a => a.status === 'completed').length,
          });
          // Show recent appraisals from all faculty
          setRecentAppraisals(allAppraisals.slice(-5).reverse());
        } else {
          // Faculty only sees their own appraisals
          const facultyAppraisals = allAppraisals.filter(
            appraisal => appraisal.facultyId === user.email
          );
          
          setStats({
            totalFaculty: 1, // Only counting themselves
            totalAppraisals: facultyAppraisals.length,
            pendingAppraisals: facultyAppraisals.filter(a => a.status === 'pending').length,
            completedAppraisals: facultyAppraisals.filter(a => a.status === 'completed').length,
          });
          // Show faculty's own recent appraisals
          setRecentAppraisals(facultyAppraisals.slice(-5).reverse());
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {user.role === 'administrator' ? 'Administrator Dashboard' : 'Faculty Dashboard'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Faculty
            </Typography>
            <Typography variant="h4">{stats.totalFaculty}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Appraisals
            </Typography>
            <Typography variant="h4">{stats.totalAppraisals}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Pending Appraisals
            </Typography>
            <Typography variant="h4">{stats.pendingAppraisals}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Completed Appraisals
            </Typography>
            <Typography variant="h4">{stats.completedAppraisals}</Typography>
          </Paper>
        </Grid>

        {/* Recent Appraisals Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Appraisals
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {user.role.toLowerCase() === 'administrator' && (
                      <TableCell>Faculty Name</TableCell>
                    )}
                    <TableCell>Semester</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Submitted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAppraisals.map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      {user.role.toLowerCase() === 'administrator' && (
                        <TableCell>{appraisal.facultyName}</TableCell>
                      )}
                      <TableCell>{appraisal.semester}</TableCell>
                      <TableCell>{appraisal.status}</TableCell>
                      <TableCell>
                        {new Date(appraisal.submittedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 