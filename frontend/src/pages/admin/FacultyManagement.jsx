import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Pagination,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import './FacultyManagement.css';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  qualification: Yup.string().required('Qualification is required'),
  joiningDate: Yup.date().required('Joining date is required'),
  phone: Yup.string().required('Phone number is required'),
  status: Yup.string().required('Status is required'),
});

const FacultyManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, [page]);

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`/api/admin/faculty?page=${page}&search=${searchQuery}`);
      setFaculty(response.data.faculty);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch faculty data');
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/admin/departments');
      setDepartments(response.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      department: '',
      designation: '',
      qualification: '',
      joiningDate: '',
      phone: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingFaculty) {
          await axios.put(`/api/admin/faculty/${editingFaculty._id}`, values);
          setSuccess('Faculty member updated successfully');
        } else {
          await axios.post('/api/admin/faculty', values);
          setSuccess('Faculty member added successfully');
        }
        handleCloseDialog();
        fetchFaculty();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to save faculty member');
      }
    },
  });

  const handleOpenDialog = (facultyMember = null) => {
    if (facultyMember) {
      setEditingFaculty(facultyMember);
      formik.setValues({
        name: facultyMember.name,
        email: facultyMember.email,
        department: facultyMember.department,
        designation: facultyMember.designation,
        qualification: facultyMember.qualification,
        joiningDate: facultyMember.joiningDate.split('T')[0],
        phone: facultyMember.phone,
        status: facultyMember.status,
      });
    } else {
      setEditingFaculty(null);
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFaculty(null);
    formik.resetForm();
  };

  const handleDelete = async (facultyId) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await axios.delete(`/api/admin/faculty/${facultyId}`);
        setSuccess('Faculty member deleted successfully');
        fetchFaculty();
      } catch (err) {
        setError('Failed to delete faculty member');
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="faculty-management">
      <Box className="faculty-header">
        <Typography variant="h4" className="page-title">
          Faculty Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          className="add-button"
        >
          Add Faculty
        </Button>
      </Box>

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

      <Box className="search-box">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search faculty members..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} className="faculty-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {faculty.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.department}</TableCell>
                <TableCell>{member.designation}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Chip
                    label={member.status}
                    color={member.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box className="action-buttons">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/admin/faculty/${member._id}`)}
                      className="view-button"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(member)}
                      className="edit-button"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(member._id)}
                      className="delete-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="pagination-container">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title">
          {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent className="dialog-content">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="designation"
                  label="Designation"
                  value={formik.values.designation}
                  onChange={formik.handleChange}
                  error={formik.touched.designation && Boolean(formik.errors.designation)}
                  helperText={formik.touched.designation && formik.errors.designation}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="qualification"
                  label="Qualification"
                  value={formik.values.qualification}
                  onChange={formik.handleChange}
                  error={formik.touched.qualification && Boolean(formik.errors.qualification)}
                  helperText={formik.touched.qualification && formik.errors.qualification}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="joiningDate"
                  label="Joining Date"
                  value={formik.values.joiningDate}
                  onChange={formik.handleChange}
                  error={formik.touched.joiningDate && Boolean(formik.errors.joiningDate)}
                  helperText={formik.touched.joiningDate && formik.errors.joiningDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={handleCloseDialog} className="cancel-button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              className="save-button"
            >
              {editingFaculty ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default FacultyManagement; 