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
  Tabs,
  Tab,
  Chip,
  Stack,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Popover,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  DialogActions,
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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Message as MessageIcon,
  Article as ArticleIcon,
  Pending as PendingIcon,
  Book as BookIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Faculty.css';

const StatCard = ({ title, value, icon: Icon, color, onClick, trend, onViewDetails }) => (
  <Fade in timeout={500}>
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 16px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: color, mr: 2, boxShadow: `0 4px 8px ${color}40`, width: 48, height: 48 }}>
              <Icon sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          {trend && (
            <Chip
              icon={<TrendingUpIcon />}
              label={`${trend}%`}
              color={trend > 0 ? 'success' : 'error'}
              size="small"
              sx={{ borderRadius: '12px' }}
            />
          )}
        </Box>
        <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <LinearProgress 
            variant="determinate" 
            value={70} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: `${color}20`,
              flexGrow: 1,
              mr: 2,
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
                borderRadius: 4,
              },
            }} 
          />
          <Button
            variant="outlined"
            size="small"
            onClick={onViewDetails}
            sx={{
              borderColor: color,
              color: color,
              '&:hover': {
                borderColor: color,
                backgroundColor: `${color}10`,
              },
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

const FacultyDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pendingAppraisals: 0,
    acceptedAppraisals: 0,
    rejectedAppraisals: 0,
    totalAppraisals: 0,
  });
  const [recentAppraisals, setRecentAppraisals] = useState([]);
  const [allAppraisals, setAllAppraisals] = useState([]);
  const [filteredAppraisals, setFilteredAppraisals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [performanceData, setPerformanceData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: null,
    status: 'pending',
  });
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState({
    open: false,
    title: '',
    appraisals: [],
    showAdminResponse: false,
  });
  const [allAppraisalsDialog, setAllAppraisalsDialog] = useState({
    open: false,
    title: 'All Appraisals',
    appraisals: [],
    showAdminResponse: false,
  });
  const [adminResponseAnchor, setAdminResponseAnchor] = useState(null);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);

  useEffect(() => {
    const fetchDashboardData = () => {
      try {
        // Get all appraisals from localStorage
        const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
        
        // Filter appraisals for current faculty
        const facultyAppraisals = allAppraisals.filter(
          a => a.facultyId === user.email
        );

        // Calculate statistics
        const stats = {
          pendingAppraisals: facultyAppraisals.filter(a => a.status === 'pending').length,
          acceptedAppraisals: facultyAppraisals.filter(a => a.status === 'accepted').length,
          rejectedAppraisals: facultyAppraisals.filter(a => a.status === 'rejected').length,
          totalAppraisals: facultyAppraisals.length,
        };

        // Get recent appraisals (last 5)
        const recent = facultyAppraisals
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        // Generate performance data
        const performanceData = generatePerformanceData(facultyAppraisals);

        setStats(stats);
        setRecentAppraisals(recent);
        setAllAppraisals(facultyAppraisals);
        setFilteredAppraisals(facultyAppraisals);
        setPerformanceData(performanceData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.email]);

  const generatePerformanceData = (appraisals) => {
    // Group appraisals by month and calculate average scores
    const monthlyData = {};
    appraisals.forEach(appraisal => {
      const month = new Date(appraisal.date).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = {
          count: 0,
          totalScore: 0,
        };
      }
      monthlyData[month].count++;
      monthlyData[month].totalScore += appraisal.score || 0;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      averageScore: data.totalScore / data.count,
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleViewDetails = (status) => {
    let title = '';
    let filteredAppraisals = [];

    switch (status) {
      case 'pending':
        title = 'Pending Appraisals';
        filteredAppraisals = recentAppraisals.filter(a => a.status === 'pending');
        break;
      case 'accepted':
        title = 'Accepted Appraisals';
        filteredAppraisals = recentAppraisals.filter(a => a.status === 'accepted');
        break;
      case 'rejected':
        title = 'Rejected Appraisals';
        filteredAppraisals = recentAppraisals.filter(a => a.status === 'rejected');
        break;
      default:
        title = 'All Appraisals';
        filteredAppraisals = recentAppraisals;
    }

    setDetailsDialog({
      open: true,
      title,
      appraisals: filteredAppraisals,
      showAdminResponse: false,
    });
  };

  const handleCloseDialog = () => {
    setDetailsDialog({
      open: false,
      title: '',
      appraisals: [],
      showAdminResponse: false,
    });
  };

  const toggleAdminResponse = () => {
    setDetailsDialog(prev => ({
      ...prev,
      showAdminResponse: !prev.showAdminResponse,
    }));
  };

  const handleShowAdminResponse = (event, appraisal) => {
    setSelectedAppraisal(appraisal);
    setAdminResponseAnchor(event.currentTarget);
  };

  const handleCloseAdminResponse = () => {
    setAdminResponseAnchor(null);
    setSelectedAppraisal(null);
  };

  const handleViewAllAppraisals = () => {
    // Get all appraisals from localStorage
    const allAppraisals = JSON.parse(localStorage.getItem('appraisals') || '[]');
    
    // Filter appraisals for current faculty
    const facultyAppraisals = allAppraisals.filter(
      a => a.facultyId === user.email
    );

    setAllAppraisalsDialog({
      open: true,
      title: 'All Appraisals',
      appraisals: facultyAppraisals.sort((a, b) => new Date(b.date) - new Date(a.date)),
      showAdminResponse: false,
    });
  };

  const handleCloseAllAppraisalsDialog = () => {
    setAllAppraisalsDialog({
      open: false,
      title: '',
      appraisals: [],
      showAdminResponse: false,
    });
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterAppraisals(term, sortBy, sortOrder, dateRange);
  };

  const handleSort = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    filterAppraisals(searchTerm, field, order, dateRange);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    filterAppraisals(searchTerm, sortBy, sortOrder, newDateRange);
  };

  const filterAppraisals = (search, sortField, sortDirection, dateRange) => {
    let filtered = allAppraisals;

    // Apply search filter
    if (search) {
      filtered = filtered.filter(appraisal => 
        appraisal.title.toLowerCase().includes(search) ||
        appraisal.description.toLowerCase().includes(search)
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(appraisal => {
        const appraisalDate = new Date(appraisal.date);
        return appraisalDate >= dateRange.start && appraisalDate <= dateRange.end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === 'date') {
        return sortDirection === 'desc' 
          ? new Date(bValue) - new Date(aValue)
          : new Date(aValue) - new Date(bValue);
      }
      
      return sortDirection === 'desc'
        ? bValue - aValue
        : aValue - bValue;
    });

    setFilteredAppraisals(filtered);
  };

  const handleExportAppraisals = () => {
    const data = filteredAppraisals.map(appraisal => ({
      Title: appraisal.title,
      Status: appraisal.status,
      Date: new Date(appraisal.date).toLocaleDateString(),
      Score: appraisal.score || 'N/A',
      Description: appraisal.description,
    }));

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `appraisals_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <SchoolIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Faculty Appraisal System
          </Typography>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleMenuClick}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: theme.palette.primary.main }}>
              {user.name.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menus */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/faculty/profile'); }}>
          <PersonIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/faculty/performance'); }}>
          <TrendingUpIcon sx={{ mr: 1 }} /> Performance Overview
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/faculty/goals'); }}>
          <EmojiEventsIcon sx={{ mr: 1 }} /> Development Goals
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/faculty/settings'); }}>
          <EditIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); logout(); }}>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant="body2">New appraisal request received</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant="body2">Your appraisal has been accepted</Typography>
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant="body2">Upcoming appraisal deadline</Typography>
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        <Container maxWidth={false} sx={{ px: 4 }}>
          {/* Header */}
          <Zoom in timeout={500}>
            <Paper 
              sx={{ 
                p: 4, 
                mb: 4, 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                borderRadius: '16px',
                boxShadow: `0 8px 32px ${theme.palette.primary.main}30`,
              }}
            >
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      fontSize: '3rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    Welcome back, {user.name}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                    Faculty Dashboard
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={<AssessmentIcon />}
                      label={`${stats.totalAppraisals} Total Appraisals`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', py: 1 }}
                    />
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`${stats.acceptedAppraisals} Accepted`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', py: 1 }}
                    />
                    <Chip
                      icon={<PendingIcon />}
                      label={`${stats.pendingAppraisals} Pending`}
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1rem', py: 1 }}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Zoom>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search and Filter Section */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: '16px' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search appraisals..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.start}
                    onChange={(newValue) => handleDateRangeChange({ ...dateRange, start: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={dateRange.end}
                    onChange={(newValue) => handleDateRangeChange({ ...dateRange, end: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportAppraisals}
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </Paper>

         
          {/* Statistics and Recent Activity */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* Statistics */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Pending Appraisals"
                    value={stats.pendingAppraisals}
                    icon={PendingIcon}
                    color={theme.palette.warning.main}
                    onClick={() => navigate('/faculty/appraisal')}
                    trend={5}
                    onViewDetails={() => handleViewDetails('pending')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Accepted Appraisals"
                    value={stats.acceptedAppraisals}
                    icon={CheckCircleIcon}
                    color={theme.palette.success.main}
                    onClick={() => navigate('/faculty/appraisal')}
                    trend={12}
                    onViewDetails={() => handleViewDetails('accepted')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Rejected Appraisals"
                    value={stats.rejectedAppraisals}
                    icon={CancelIcon}
                    color={theme.palette.error.main}
                    onClick={() => navigate('/faculty/appraisal')}
                    trend={-2}
                    onViewDetails={() => handleViewDetails('rejected')}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Appraisals"
                    value={stats.totalAppraisals}
                    icon={AssessmentIcon}
                    color={theme.palette.primary.main}
                    onClick={() => navigate('/faculty/appraisal')}
                    trend={8}
                    onViewDetails={() => handleViewDetails('all')}
                  />
                </Grid>
              </Grid>

              {/* Details Dialog */}
              <Dialog
                open={detailsDialog.open}
                onClose={handleCloseDialog}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>{detailsDialog.title}</span>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={toggleAdminResponse}
                    startIcon={<MessageIcon />}
                    sx={{ borderRadius: '12px' }}
                  >
                    {detailsDialog.showAdminResponse ? 'Hide Admin Response' : 'Show Admin Response'}
                  </Button>
                </DialogTitle>
                <DialogContent>
                  <List>
                    {detailsDialog.appraisals.map((appraisal, index) => (
                      <React.Fragment key={appraisal.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {appraisal.title}
                                </Typography>
                                <Chip
                                  label={appraisal.status}
                                  color={getStatusColor(appraisal.status)}
                                  size="small"
                                  sx={{ borderRadius: '12px' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Submitted on: {new Date(appraisal.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Description: {appraisal.description}
                                </Typography>
                                {appraisal.facultyResponse && (
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                      Faculty Response:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {appraisal.facultyResponse}
                                    </Typography>
                                  </Box>
                                )}
                                {detailsDialog.showAdminResponse && appraisal.adminResponse && (
                                  <Box sx={{ mt: 2, bgcolor: '#f8fafc', p: 2, borderRadius: '8px' }}>
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
                        {index < detailsDialog.appraisals.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </DialogContent>
              </Dialog>

              {/* Recent Activity */}
              <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
                    Recent Activity
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<TimelineIcon />}
                    onClick={handleViewAllAppraisals}
                    sx={{ borderRadius: '12px', px: 3 }}
                  >
                    View All
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {recentAppraisals.map((appraisal, index) => (
                    <Fade in timeout={500} key={appraisal.id} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card 
                        sx={{ 
                          borderRadius: '12px',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                              <Avatar sx={{ 
                                bgcolor: `${theme.palette[getStatusColor(appraisal.status)].main}20`,
                                width: 48,
                                height: 48
                              }}>
                                <AssessmentIcon sx={{ 
                                  color: theme.palette[getStatusColor(appraisal.status)].main,
                                  fontSize: 24
                                }} />
                              </Avatar>
                            </Grid>
                            <Grid item xs>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {appraisal.title}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                Submitted on {new Date(appraisal.date).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Chip
                                  label={appraisal.status}
                                  color={getStatusColor(appraisal.status)}
                                  size="medium"
                                  sx={{ 
                                    borderRadius: '12px',
                                    px: 2,
                                    py: 1,
                                    fontSize: '1rem'
                                  }}
                                />
                                <Tooltip title="View Admin Response">
                                  <IconButton
                                    onClick={(e) => handleShowAdminResponse(e, appraisal)}
                                    sx={{
                                      color: theme.palette.primary.main,
                                      '&:hover': {
                                        backgroundColor: theme.palette.primary.light + '20',
                                      },
                                    }}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  ))}
                </Stack>
              </Paper>

              {/* All Appraisals Dialog */}
              <Dialog
                open={allAppraisalsDialog.open}
                onClose={handleCloseAllAppraisalsDialog}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span>{allAppraisalsDialog.title}</span>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setAllAppraisalsDialog(prev => ({
                      ...prev,
                      showAdminResponse: !prev.showAdminResponse,
                    }))}
                    startIcon={<MessageIcon />}
                    sx={{ borderRadius: '12px' }}
                  >
                    {allAppraisalsDialog.showAdminResponse ? 'Hide Admin Response' : 'Show Admin Response'}
                  </Button>
                </DialogTitle>
                <DialogContent>
                  <List>
                    {allAppraisalsDialog.appraisals.map((appraisal, index) => (
                      <React.Fragment key={appraisal.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {appraisal.title}
                                </Typography>
                                <Chip
                                  label={appraisal.status}
                                  color={getStatusColor(appraisal.status)}
                                  size="small"
                                  sx={{ borderRadius: '12px' }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Submitted on: {new Date(appraisal.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Description: {appraisal.description}
                                </Typography>
                                {appraisal.facultyResponse && (
                                  <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                      Faculty Response:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {appraisal.facultyResponse}
                                    </Typography>
                                  </Box>
                                )}
                                {allAppraisalsDialog.showAdminResponse && appraisal.adminResponse && (
                                  <Box sx={{ mt: 2, bgcolor: '#f8fafc', p: 2, borderRadius: '8px' }}>
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
                        {index < allAppraisalsDialog.appraisals.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Admin Response Popover */}
      <Popover
        open={Boolean(adminResponseAnchor)}
        anchorEl={adminResponseAnchor}
        onClose={handleCloseAdminResponse}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 2,
            maxWidth: 320,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        {selectedAppraisal && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
              Admin Response
            </Typography>
            {selectedAppraisal.adminResponse ? (
              <Typography variant="body2" color="text.secondary">
                {selectedAppraisal.adminResponse}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No admin response available yet.
              </Typography>
            )}
          </Box>
        )}
      </Popover>

      {/* Goal Dialog */}
      <Dialog
        open={showGoalDialog}
        onClose={() => setShowGoalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Goal Title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Target Date"
                value={newGoal.targetDate}
                onChange={(newValue) => setNewGoal({ ...newGoal, targetDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newGoal.status}
                onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value })}
                label="Status"
              >
                <SelectMenuItem value="pending">Pending</SelectMenuItem>
                <SelectMenuItem value="in-progress">In Progress</SelectMenuItem>
                <SelectMenuItem value="completed">Completed</SelectMenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGoalDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              // Add goal to goals array
              setGoals([...goals, { ...newGoal, id: Date.now() }]);
              setNewGoal({
                title: '',
                description: '',
                targetDate: null,
                status: 'pending',
              });
              setShowGoalDialog(false);
            }}
          >
            Add Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyDashboard; 