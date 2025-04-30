import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './Teaching.css';

const Teaching = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: '',
    year: '',
    students: '',
    hours: '',
    type: '',
    feedback: '',
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    try {
      // Get courses from localStorage
      const savedCourses = JSON.parse(localStorage.getItem('teachingCourses') || '[]');
      setCourses(savedCourses);
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        code: '',
        semester: '',
        year: new Date().getFullYear().toString(),
        students: '',
        hours: '',
        type: '',
        feedback: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      code: '',
      semester: '',
      year: new Date().getFullYear().toString(),
      students: '',
      hours: '',
      type: '',
      feedback: '',
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let updatedCourses;
      if (editingCourse) {
        // Update existing course
        updatedCourses = courses.map(course => 
          course.id === editingCourse.id ? { ...formData, id: course.id } : course
        );
      } else {
        // Add new course
        const newCourse = {
          ...formData,
          id: Date.now(),
          facultyId: user.id,
          facultyName: user.name
        };
        updatedCourses = [...courses, newCourse];
      }

      // Save to localStorage
      localStorage.setItem('teachingCourses', JSON.stringify(updatedCourses));
      setCourses(updatedCourses);
      setSuccess(true);
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const updatedCourses = courses.filter(course => course.id !== id);
        localStorage.setItem('teachingCourses', JSON.stringify(updatedCourses));
        setCourses(updatedCourses);
        setSuccess(true);
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  return (
    <Box className="teaching-container">
      <Container maxWidth="lg">
        <Box className="teaching-header">
          <Typography variant="h4" component="h1" gutterBottom>
            Teaching Performance
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Course
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
                <TableCell>Course Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Semester</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{course.year}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>{course.hours}</TableCell>
                  <TableCell>{course.type}</TableCell>
                  <TableCell>{course.feedback}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(course)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(course.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course Code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      label="Semester"
                    >
                      <MenuItem value="1">Semester 1</MenuItem>
                      <MenuItem value="2">Semester 2</MenuItem>
                      <MenuItem value="3">Semester 3</MenuItem>
                      <MenuItem value="4">Semester 4</MenuItem>
                      <MenuItem value="5">Semester 5</MenuItem>
                      <MenuItem value="6">Semester 6</MenuItem>
                      <MenuItem value="7">Semester 7</MenuItem>
                      <MenuItem value="8">Semester 8</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Students"
                    name="students"
                    type="number"
                    value={formData.students}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teaching Hours"
                    name="hours"
                    type="number"
                    value={formData.hours}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Course Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label="Course Type"
                    >
                      <MenuItem value="Lecture">Lecture</MenuItem>
                      <MenuItem value="Lab">Lab</MenuItem>
                      <MenuItem value="Seminar">Seminar</MenuItem>
                      <MenuItem value="Workshop">Workshop</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Student Feedback"
                    name="feedback"
                    type="number"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingCourse ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {editingCourse ? 'Course updated successfully!' : 'Course added successfully!'}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Teaching; 