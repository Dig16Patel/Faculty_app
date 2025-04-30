import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'performance',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // Get reports from localStorage
      const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      setReports(storedReports);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reports');
      setLoading(false);
    }
  };

  const handleOpenDialog = (report = null) => {
    if (report) {
      setSelectedReport(report);
      setFormData({
        title: report.title,
        type: report.type,
        description: report.description,
        date: report.date,
      });
    } else {
      setSelectedReport(null);
      setFormData({
        title: '',
        type: 'performance',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setFormData({
      title: '',
      type: 'performance',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      
      if (selectedReport) {
        // Update existing report
        const updatedReports = storedReports.map(report => 
          report.id === selectedReport.id
            ? { ...report, ...formData }
            : report
        );
        localStorage.setItem('reports', JSON.stringify(updatedReports));
      } else {
        // Add new report
        const newReport = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('reports', JSON.stringify([...storedReports, newReport]));
      }
      
      fetchReports();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save report');
    }
  };

  const handleDelete = async (id) => {
    try {
      const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
      const updatedReports = storedReports.filter(report => report.id !== id);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      fetchReports();
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'performance':
        return <AssessmentIcon />;
      case 'trends':
        return <TrendingUpIcon />;
      case 'department':
        return <GroupIcon />;
      default:
        return <AssessmentIcon />;
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
          Reports Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Report
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssessmentIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Performance Reports</Typography>
              </Box>
              <Typography variant="h4">
                {reports.filter(report => report.type === 'performance').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Trend Reports</Typography>
              </Box>
              <Typography variant="h4">
                {reports.filter(report => report.type === 'trends').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <GroupIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Department Reports</Typography>
              </Box>
              <Typography variant="h4">
                {reports.filter(report => report.type === 'department').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {getReportIcon(report.type)}
                      <Typography sx={{ ml: 1 }}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(report)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(report.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedReport ? 'Edit Report' : 'Add New Report'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Type"
              fullWidth
              select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="performance">Performance</option>
              <option value="trends">Trends</option>
              <option value="department">Department</option>
            </TextField>
            <TextField
              margin="dense"
              label="Date"
              fullWidth
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedReport ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminReports; 