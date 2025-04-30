import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import { Box } from '@mui/material';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFacultyList from './pages/admin/FacultyList';
import AdminAppraisals from './pages/admin/Appraisals';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import FacultyAppraisal from './pages/faculty/Appraisal';
import FacultyPublications from './pages/faculty/Publications';
import FacultyEvents from './pages/faculty/Events';
import FacultyProfile from './pages/faculty/Profile';
import FacultyTeaching from './pages/faculty/Teaching';
import AppraisalResponse from './pages/faculty/AppraisalResponse';
import AppraisalManagement from './pages/admin/AppraisalManagement';
import AppraisalDetails from './pages/faculty/AppraisalDetails';
import TestStorage from './pages/TestStorage';
import DevelopmentGoals from './pages/faculty/DevelopmentGoals';
import PerformanceOverview from './pages/faculty/PerformanceOverview';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Box
            sx={{
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test-storage" element={<TestStorage />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      <Navbar />
                      <Box
                        component="main"
                        sx={{
                          flexGrow: 1,
                          p: 3,
                          width: { sm: `calc(100% - 240px)` },
                          ml: { sm: '240px' },
                          mt: '64px',
                          minHeight: '100vh',
                        }}
                      >
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="faculty" element={<AdminFacultyList />} />
                          <Route path="appraisals" element={<AdminAppraisals />} />
                          <Route path="reports" element={<AdminReports />} />
                          <Route path="settings" element={<AdminSettings />} />
                          <Route path="appraisal-management" element={<AppraisalManagement />} />
                          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                        </Routes>
                      </Box>
                    </Box>
                  </ProtectedRoute>
                }
              />

              {/* Faculty Routes */}
              <Route
                path="/faculty/*"
                element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      <Navbar />
                      <Box
                        component="main"
                        sx={{
                          flexGrow: 1,
                          p: 3,
                          width: { sm: `calc(100% - 240px)` },
                          ml: { sm: '240px' },
                          mt: '64px',
                          minHeight: '100vh',
                        }}
                      >
                        <Routes>
                          <Route path="dashboard" element={<FacultyDashboard />} />
                          <Route path="appraisal" element={<FacultyAppraisal />} />
                          <Route path="publications" element={<FacultyPublications />} />
                          <Route path="events" element={<FacultyEvents />} />
                          <Route path="profile" element={<FacultyProfile />} />
                          <Route path="teaching" element={<FacultyTeaching />} />
                          <Route path="appraisal-response" element={<AppraisalResponse />} />
                          <Route path="appraisal-details/:id" element={<AppraisalDetails />} />
                          <Route path="goals" element={<DevelopmentGoals />} />
                          <Route path="performance" element={<PerformanceOverview />} />
                          <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
                        </Routes>
                      </Box>
                    </Box>
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;