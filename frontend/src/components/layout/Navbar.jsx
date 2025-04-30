import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
  ListItemButton,
  Divider,
  Button,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Storage as StorageIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('currentUser');
      
      // Call logout function from context
      await logout();
      
      // Clear any other relevant data
      localStorage.removeItem('draftAppraisal');
      
      // Force a page refresh to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1300,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '4px 0 25px rgba(0, 0, 0, 0.08)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
          display: 'none'
        },
        '&:hover::-webkit-scrollbar': {
          display: 'block'
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.03)'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0, 0, 0, 0.2)'
        }
      }}
    >
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 700,
          fontSize: '1.3rem',
          color: '#1e293b',
          letterSpacing: '-0.5px'
        }}>
          Faculty Appraisal
        </Typography>
      </Box>
      <List sx={{ mt: 3, px: 2 }}>
        {user?.role === 'admin' ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/dashboard"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/faculty"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Faculty List" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/appraisals"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Appraisals" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/reports"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Reports" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/admin/settings"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Settings" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/faculty/dashboard"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/faculty/appraisal"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Appraisal" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/faculty/publications"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Publications" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/faculty/events"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Events" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/faculty/profile"
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  color: '#1e293b',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateX(8px)',
                    '&:before': {
                      opacity: 1
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#3b82f6', 
                  minWidth: 40,
                  transition: 'transform 0.3s ease',
                  '& svg': {
                    transition: 'transform 0.3s ease'
                  },
                  '.MuiListItemButton-root:hover &': {
                    '& svg': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                      color: '#1e293b'
                    }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <Divider sx={{ 
          my: 2, 
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 0 rgba(255, 255, 255, 0.9)'
        }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              mb: 1,
              color: '#dc2626',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.08) 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'translateX(8px)',
                '&:before': {
                  opacity: 1
                }
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: '#dc2626', 
              minWidth: 40,
              transition: 'transform 0.3s ease',
              '& svg': {
                transition: 'transform 0.3s ease'
              },
              '.MuiListItemButton-root:hover &': {
                '& svg': {
                  transform: 'scale(1.1) rotate(360deg)'
                }
              }
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  color: '#dc2626'
                }
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          zIndex: 1200,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          color: '#1e293b'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#1e293b',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                transform: 'rotate(180deg)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '-0.5px',
              fontSize: '1.25rem',
              color: '#1e293b'
            }}
          >
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Faculty Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={user?.name || 'User'}>
              <Avatar
                sx={{
                  bgcolor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  '&:hover': {
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
                    border: '2px solid rgba(59, 130, 246, 0.4)'
                  },
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: (theme) => theme.zIndex.drawer,
          display: 'flex',
          flexDirection: 'row',
          transform: 'none'
        }}
      >
        {/* Trigger area */}
        <Box
          sx={{
            width: '4px',
            height: '100%',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            '&:hover + .sidebar-container': {
              transform: 'translateX(0)',
              pointerEvents: 'auto',
              opacity: 1
            }
          }}
        />

        {/* Sidebar container */}
        <Box
          className="sidebar-container"
          sx={{
            width: 240,
            height: '100%',
            transform: 'translateX(-100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0,
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '4px 0 25px rgba(0, 0, 0, 0.08)',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
            '&:hover': {
              transform: 'translateX(0)',
              pointerEvents: 'auto',
              opacity: 1
            }
          }}
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: 240,
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
                  backdropFilter: 'blur(10px)',
                  color: '#1e293b'
                },
              }}
            >
              {drawer}
            </Drawer>
          ) : (
            <Box
              sx={{
                height: '100%',
                overflow: 'hidden auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                  height: '4px',
                  display: 'none'
                },
                '&:hover::-webkit-scrollbar': {
                  display: 'block'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0, 0, 0, 0.03)'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              {drawer}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Navbar; 