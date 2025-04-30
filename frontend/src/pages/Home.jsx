import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Link,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Analytics as AnalyticsIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import './Home.css';

const Home = () => {
  const theme = useTheme();

  const features = [
    {
      title: 'Faculty Management',
      description: 'Efficiently manage faculty profiles, track performance, and handle administrative tasks.',
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      gradient: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
    },
    {
      title: 'Performance Appraisal',
      description: 'Comprehensive evaluation system for assessing faculty performance and achievements.',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      gradient: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
    },
    {
      title: 'Analytics & Reports',
      description: 'Generate detailed reports and insights for informed decision-making.',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      gradient: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
    },
    {
      title: 'Academic Excellence',
      description: 'Promote and track academic achievements and research contributions.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      gradient: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/pattern.png")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                      background: 'linear-gradient(45deg, #fff 30%, #e3f2fd 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Faculty Appraisal System
                  </Typography>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}
                  >
                    Streamline faculty evaluation and enhance academic performance
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1000}>
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    minHeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                      zIndex: 1,
                    },
                  }}
                >
                  <img
                    src="/images/hero-image.jpg"
                    alt="Faculty Appraisal System"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80';
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      textAlign: 'center',
                      color: 'white',
                      p: 4,
                      background: 'rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 2,
                      maxWidth: '80%',
                      mx: 'auto',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                      Faculty Appraisal System
                    </Typography>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ 
            mb: 6, 
            fontWeight: 600,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 4,
              background: 'linear-gradient(90deg, #1976d2, #21CBF3)',
              borderRadius: 2,
            },
          }}
        >
          Key Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      background: feature.gradient,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{ 
                        fontWeight: 600,
                        color: feature.color,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 12,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/images/pattern.png")',
            opacity: 0.05,
          },
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Paper
              elevation={3}
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #1976d2, #21CBF3)',
                },
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Join our platform today and experience the future of faculty appraisal
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #1976d2 0%, #21CBF3 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #1a9fb3 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
              >
                Create Account
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 