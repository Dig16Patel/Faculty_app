import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AdminFacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      // Get registered users from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const facultyUsers = registeredUsers.filter(user => user.role === 'faculty');
      setFaculty(facultyUsers);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch faculty data');
      setLoading(false);
    }
  };

  const handleOpenDialog = (facultyMember = null) => {
    if (facultyMember) {
      setSelectedFaculty(facultyMember);
      setFormData({
        name: facultyMember.name,
        department: facultyMember.department || '',
        designation: facultyMember.designation || '',
      });
    } else {
      setSelectedFaculty(null);
      setFormData({
        name: '',
        department: '',
        designation: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFaculty(null);
    setFormData({
      name: '',
      department: '',
      designation: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      if (selectedFaculty) {
        // Update existing faculty
        const updatedUsers = registeredUsers.map(user => 
          user.email === selectedFaculty.email
            ? { ...user, ...formData }
            : user
        );
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      } else {
        // Add new faculty
        const newFaculty = {
          ...formData,
          email: `${formData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          password: 'defaultPassword123',
          role: 'faculty',
        };
        localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newFaculty]));
      }
      
      fetchFaculty();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save faculty data');
    }
  };

  const handleDelete = async (email) => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = registeredUsers.filter(user => user.email !== email);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      fetchFaculty();
    } catch (err) {
      setError('Failed to delete faculty');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Faculty Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Faculty
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculty.map((facultyMember) => (
              <TableRow key={facultyMember.email}>
                <TableCell>{facultyMember.name}</TableCell>
                <TableCell>{facultyMember.email}</TableCell>
                <TableCell>{facultyMember.department || '-'}</TableCell>
                <TableCell>{facultyMember.designation || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(facultyMember)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(facultyMember.email)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedFaculty ? 'Edit Faculty' : 'Add New Faculty'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Department"
              fullWidth
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Designation"
              fullWidth
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedFaculty ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminFacultyList; 