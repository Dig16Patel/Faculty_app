import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const PerformanceOverview = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('monthly');
  const [performanceData, setPerformanceData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    // Load appraisals from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    const facultyAppraisals = allAppraisals.filter(a => a.facultyId === user.email);

    // Generate performance data based on time range
    const data = generatePerformanceData(facultyAppraisals, timeRange);
    setPerformanceData(data);

    // Generate comparison data
    const comparison = generateComparisonData(facultyAppraisals);
    setComparisonData(comparison);
  }, [user.email, timeRange]);

  const generatePerformanceData = (appraisals, range) => {
    const data = [];
    const now = new Date();

    if (range === 'monthly') {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthAppraisals = appraisals.filter(a => {
          const appraisalDate = new Date(a.date);
          return appraisalDate.getMonth() === date.getMonth() &&
                 appraisalDate.getFullYear() === date.getFullYear();
        });

        const averageScore = monthAppraisals.length > 0
          ? monthAppraisals.reduce((sum, a) => sum + (a.score || 0), 0) / monthAppraisals.length
          : 0;

        data.push({
          period: date.toLocaleString('default', { month: 'short' }),
          score: averageScore,
        });
      }
    } else {
      // Last 4 quarters
      for (let i = 3; i >= 0; i--) {
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - i * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        
        const quarterAppraisals = appraisals.filter(a => {
          const appraisalDate = new Date(a.date);
          return appraisalDate >= quarterStart && appraisalDate <= quarterEnd;
        });

        const averageScore = quarterAppraisals.length > 0
          ? quarterAppraisals.reduce((sum, a) => sum + (a.score || 0), 0) / quarterAppraisals.length
          : 0;

        data.push({
          period: `Q${Math.floor(quarterStart.getMonth() / 3) + 1} ${quarterStart.getFullYear()}`,
          score: averageScore,
        });
      }
    }

    return data;
  };

  const generateComparisonData = (appraisals) => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const currentYearAppraisals = appraisals.filter(a => 
      new Date(a.date).getFullYear() === currentYear
    );
    const lastYearAppraisals = appraisals.filter(a => 
      new Date(a.date).getFullYear() === lastYear
    );

    const currentYearAverage = currentYearAppraisals.length > 0
      ? currentYearAppraisals.reduce((sum, a) => sum + (a.score || 0), 0) / currentYearAppraisals.length
      : 0;

    const lastYearAverage = lastYearAppraisals.length > 0
      ? lastYearAppraisals.reduce((sum, a) => sum + (a.score || 0), 0) / lastYearAppraisals.length
      : 0;

    return [
      { year: lastYear.toString(), score: lastYearAverage },
      { year: currentYear.toString(), score: currentYearAverage },
    ];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Performance Overview
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Year-over-Year Comparison
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" component="div">
                      {performanceData.length > 0
                        ? performanceData[performanceData.length - 1].score.toFixed(1)
                        : '0.0'}
                    </Typography>
                    <Typography color="text.secondary">
                      Current {timeRange === 'monthly' ? 'Month' : 'Quarter'} Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" component="div">
                      {performanceData.length > 0
                        ? (performanceData.reduce((sum, d) => sum + d.score, 0) / performanceData.length).toFixed(1)
                        : '0.0'}
                    </Typography>
                    <Typography color="text.secondary">
                      Average Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" component="div">
                      {performanceData.length > 0
                        ? Math.max(...performanceData.map(d => d.score)).toFixed(1)
                        : '0.0'}
                    </Typography>
                    <Typography color="text.secondary">
                      Highest Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" component="div">
                      {performanceData.length > 0
                        ? Math.min(...performanceData.map(d => d.score)).toFixed(1)
                        : '0.0'}
                    </Typography>
                    <Typography color="text.secondary">
                      Lowest Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PerformanceOverview; 