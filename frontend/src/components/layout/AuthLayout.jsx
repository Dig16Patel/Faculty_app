import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const AuthLayout = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledPaper elevation={3}>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            Faculty Appraisal System
          </Typography>
          <Outlet />
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default AuthLayout; 