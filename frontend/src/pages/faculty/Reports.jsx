import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportType, setReportType] = useState('performance');
  const [timeRange, setTimeRange] = useState('year');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('/api/faculty/reports', {
        type: reportType,
        timeRange,
        startDate,
        endDate,
      });
      setReportData(response.data);
      setSuccess('Report generated successfully');
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.post(
        '/api/faculty/reports/download',
        {
          type: reportType,
          timeRange,
          startDate,
          endDate,
        },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download report');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleShareReport = async () => {
    try {
      const response = await axios.post('/api/faculty/reports/share', {
        type: reportType,
        timeRange,
        startDate,
        endDate,
      });
      setSuccess('Report shared successfully');
    } catch (err) {
      setError('Failed to share report');
    }
  };

  return (
    <Box className="reports-container">
      <Typography variant="h4" className="page-title">
        Reports & Analytics
      </Typography>

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

      <Paper className="reports-section">
        <Box className="section-header">
          <Typography variant="h6" className="section-title">
            <AssessmentIcon className="section-icon" /> Generate Report
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="performance">Performance Report</MenuItem>
                <MenuItem value="publications">Publications Report</MenuItem>
                <MenuItem value="teaching">Teaching Report</MenuItem>
                <MenuItem value="research">Research Report</MenuItem>
                <MenuItem value="service">Service Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {timeRange === 'custom' && (
            <>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box className="action-buttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
              >
                Generate Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {reportData && (
        <Paper className="reports-section">
          <Box className="section-header">
            <Typography variant="h6" className="section-title">
              Report Results
            </Typography>
            <Box className="action-buttons">
              <IconButton onClick={handleDownloadReport} color="primary">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handlePrintReport} color="primary">
                <PrintIcon />
              </IconButton>
              <IconButton onClick={handleShareReport} color="primary">
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Target</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.metrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell>{metric.name}</TableCell>
                    <TableCell align="right">{metric.value}</TableCell>
                    <TableCell align="right">{metric.target}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={metric.status}
                        color={
                          metric.status === 'excellent'
                            ? 'success'
                            : metric.status === 'good'
                            ? 'info'
                            : metric.status === 'fair'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="report-summary">
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {reportData.summary}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Reports; 