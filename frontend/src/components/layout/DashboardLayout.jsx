import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Article as ArticleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/faculty/dashboard' },
    { text: 'New Appraisal', icon: <AddIcon />, path: '/faculty/appraisal' },
    { text: 'Publications', icon: <ArticleIcon />, path: '/faculty/publications' },
    { text: 'Events', icon: <EventIcon />, path: '/faculty/events' },
    { text: 'Profile', icon: <PersonIcon />, path: '/faculty/profile' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      {/* Logo and Brand */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <SchoolIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
          Faculty Portal
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Faculty Member
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}15`,
                  borderRight: `3px solid ${theme.palette.primary.main}`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}25`,
                  },
                },
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}15`,
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Logout Button */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logout}
            sx={{
              py: 1.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: `${theme.palette.error.main}15`,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Faculty Appraisal System
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: DRAWER_WIDTH,
            borderRight: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          p: { xs: 2, sm: 4, md: 6 },
          mt: '64px',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 