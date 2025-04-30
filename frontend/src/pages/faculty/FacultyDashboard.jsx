import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Container, 
  Grid, 
  Paper, 
  Typography,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Drawer,
  ListItemButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem as MuiMenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  Book as BookIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  FileUpload as FileUploadIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  SchoolOutlined as SchoolOutlinedIcon,
  GroupOutlined as GroupOutlinedIcon,
  BookOutlined as BookOutlinedIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  border: '1px solid rgba(0,0,0,0.05)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: 'white',
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/pattern.png")',
    opacity: 0.1,
    zIndex: 0,
  },
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: 'url("/images/university-library.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  opacity: 0.1,
  zIndex: -1,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
  },
}));

const StatCard = ({ title, value, icon, color, trend, subtitle, onClick }) => (
  <Fade in timeout={500}>
    <StyledPaper 
      sx={{ 
        p: 3, 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        background: '#ffffff',
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: '12px', 
          bgcolor: `${color}15`,
          mr: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
              {subtitle}
            </Typography>
          )}
          <Chip 
            label={trend} 
            size="small" 
            color={trend.includes('+') ? 'success' : 'error'}
            sx={{ 
              borderRadius: '6px',
              fontWeight: 'bold',
              '& .MuiChip-label': {
                px: 1,
              }
            }}
          />
        </Box>
      </Box>
    </StyledPaper>
  </Fade>
);

const FacultyDashboard = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (stat) => {
    setSelectedStat(stat);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedStat(null);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(180deg, #4f46e5 0%, #6366f1 100%)',
      color: 'white',
      p: 2,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, p: 2 }}>
        <Avatar 
          sx={{ 
            mr: 2, 
            bgcolor: 'white',
            color: '#4f46e5',
            width: 50,
            height: 50,
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <PersonIcon />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Dr. Sarah Smith
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Computer Science Department
          </Typography>
        </Box>
      </Box>
      <List>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <AssessmentOutlinedIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Appraisals" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <SchoolOutlinedIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Research" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <GroupOutlinedIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Students" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <BookOutlinedIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Publications" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mb: 1 }}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Settings" sx={{ color: 'white' }} />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: '12px', mt: 4 }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: 'white' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <BackgroundImage />
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                Faculty Dashboard
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              color="primary"
              sx={{ 
                bgcolor: '#f1f5f9',
                '&:hover': {
                  bgcolor: '#e2e8f0',
                }
              }}
            >
              <SearchIcon />
            </IconButton>
            <Tooltip title="Notifications">
              <IconButton 
                color="primary"
                sx={{ 
                  bgcolor: '#f1f5f9',
                  '&:hover': {
                    bgcolor: '#e2e8f0',
                  }
                }}
              >
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={handleMenuClick}
              sx={{ 
                bgcolor: '#f1f5f9',
                '&:hover': {
                  bgcolor: '#e2e8f0',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Help</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Welcome Card */}
            <Grid item xs={12}>
              <Zoom in timeout={500}>
                <GradientCard>
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 600 }}>
                          Welcome back, Dr. Smith!
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
                          Here's your performance overview for this academic year.
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AssessmentIcon />}
                          sx={{ 
                            bgcolor: 'white',
                            color: '#4f46e5',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                        >
                          Start New Appraisal
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          '& img': {
                            maxWidth: '100%',
                            height: 'auto',
                            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                          }
                        }}>
                          <img src="/images/dashboard-illustration.svg" alt="Dashboard Illustration" />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </GradientCard>
              </Zoom>
            </Grid>

            {/* Stats Cards */}
            <Grid item xs={12} md={3}>
              <StatCard
                title="Performance Score"
                value="92%"
                icon={<StarIcon sx={{ color: '#f59e0b' }} />}
                color="#f59e0b"
                trend="+5% from last month"
                subtitle="Based on all evaluations"
                onClick={() => handleDialogOpen('performance')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Publications"
                value="8"
                icon={<BookIcon sx={{ color: '#3b82f6' }} />}
                color="#3b82f6"
                trend="+2 this year"
                subtitle="In top-tier journals"
                onClick={() => handleDialogOpen('publications')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Students"
                value="120"
                icon={<GroupIcon sx={{ color: '#10b981' }} />}
                color="#10b981"
                trend="+15 from last semester"
                subtitle="Across 4 courses"
                onClick={() => handleDialogOpen('students')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Awards"
                value="3"
                icon={<EmojiEventsIcon sx={{ color: '#8b5cf6' }} />}
                color="#8b5cf6"
                trend="+1 this year"
                subtitle="Teaching excellence"
                onClick={() => handleDialogOpen('awards')}
              />
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Fade in timeout={800}>
                <StyledPaper sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                        Performance Overview
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Your performance metrics across different areas
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <FilterIcon />
                      </IconButton>
                      <IconButton size="small">
                        <SortIcon />
                      </IconButton>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ borderRadius: '8px' }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                  <Stack spacing={3}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          Teaching Excellence
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                          92%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={92} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#dcfce7',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10b981',
                            borderRadius: 4,
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          Research Impact
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                          88%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={88} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#dbeafe',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#3b82f6',
                            borderRadius: 4,
                          }
                        }} 
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          Service Contribution
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                          85%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={85} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#fef3c7',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#f59e0b',
                            borderRadius: 4,
                          }
                        }} 
                      />
                    </Box>
                  </Stack>
                </StyledPaper>
              </Fade>

              <Fade in timeout={1000}>
                <StyledPaper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                        Recent Activities
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Your latest updates and notifications
                      </Typography>
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: '#4f46e5' }}
                    >
                      View All
                    </Button>
                  </Box>
                  <List>
                    <ListItem sx={{ 
                      borderRadius: '12px', 
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      }
                    }}>
                      <ListItemIcon>
                        <AssignmentIcon sx={{ color: '#4f46e5' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Teaching Performance Review"
                        secondary="Submitted for review - 2 days ago"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ 
                      borderRadius: '12px', 
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      }
                    }}>
                      <ListItemIcon>
                        <SchoolIcon sx={{ color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Research Publication Added"
                        secondary="New publication added to your profile"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ 
                      borderRadius: '12px', 
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      }
                    }}>
                      <ListItemIcon>
                        <WarningIcon sx={{ color: '#f59e0b' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Service Hours Update Required"
                        secondary="Please update your service hours for Q1"
                      />
                    </ListItem>
                  </List>
                </StyledPaper>
              </Fade>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Fade in timeout={800}>
                <StyledPaper sx={{ p: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                        Upcoming Reviews
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Your scheduled evaluations
                      </Typography>
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ color: '#4f46e5' }}
                    >
                      View Calendar
                    </Button>
                  </Box>
                  <List>
                    <ListItem sx={{ 
                      borderRadius: '12px', 
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      }
                    }}>
                      <ListItemIcon>
                        <CalendarIcon sx={{ color: '#4f46e5' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Annual Performance Review"
                        secondary="Due in 2 weeks"
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ 
                      borderRadius: '12px', 
                      mb: 1,
                      '&:hover': {
                        bgcolor: '#f8fafc',
                      }
                    }}>
                      <ListItemIcon>
                        <CalendarIcon sx={{ color: '#10b981' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Research Progress Review"
                        secondary="Due in 1 month"
                      />
                    </ListItem>
                  </List>
                </StyledPaper>
              </Fade>

              <Fade in timeout={1000}>
                <StyledPaper sx={{ p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                      Quick Actions
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Common tasks and shortcuts
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: '12px',
                        borderColor: '#e2e8f0',
                        color: '#4f46e5',
                        '&:hover': {
                          borderColor: '#4f46e5',
                          bgcolor: '#f8fafc',
                        }
                      }}
                    >
                      Submit New Appraisal
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<BookIcon />}
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: '12px',
                        borderColor: '#e2e8f0',
                        color: '#4f46e5',
                        '&:hover': {
                          borderColor: '#4f46e5',
                          bgcolor: '#f8fafc',
                        }
                      }}
                    >
                      Add Publication
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<GroupIcon />}
                      fullWidth
                      sx={{ 
                        justifyContent: 'flex-start',
                        py: 1.5,
                        borderRadius: '12px',
                        borderColor: '#e2e8f0',
                        color: '#4f46e5',
                        '&:hover': {
                          borderColor: '#4f46e5',
                          bgcolor: '#f8fafc',
                        }
                      }}
                    >
                      Update Service Hours
                    </Button>
                  </Stack>
                </StyledPaper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedStat === 'performance' && 'Performance Details'}
          {selectedStat === 'publications' && 'Publication Details'}
          {selectedStat === 'students' && 'Student Details'}
          {selectedStat === 'awards' && 'Award Details'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              Detailed information about your {selectedStat} will be displayed here.
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Filter By</InputLabel>
              <Select label="Filter By">
                <MuiMenuItem value="all">All</MuiMenuItem>
                <MuiMenuItem value="recent">Recent</MuiMenuItem>
                <MuiMenuItem value="upcoming">Upcoming</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<FileUploadIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Document
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          <Button variant="contained" onClick={handleDialogClose}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacultyDashboard; 