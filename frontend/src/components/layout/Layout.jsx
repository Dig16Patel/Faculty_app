import React, { useState } from 'react';
import { Box, Container, useTheme, useMediaQuery, Fade } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isContentReady, setIsContentReady] = useState(false);

  React.useEffect(() => {
    setIsContentReady(true);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          pt: { xs: 8, sm: 9 },
          pb: { xs: 4, sm: 6 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            py: { xs: 2, sm: 3 },
          }}
        >
          <Fade in={isContentReady} timeout={1000}>
            <Box
              sx={{
                flex: 1,
                borderRadius: theme.shape.borderRadius * 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                p: { xs: 2, sm: 3 },
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  zIndex: 2,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 4,
                  left: 0,
                  right: 0,
                  height: 40,
                  background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper}00 100%)`,
                  pointerEvents: 'none',
                  zIndex: 1,
                },
              }}
            >
              {children}
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 