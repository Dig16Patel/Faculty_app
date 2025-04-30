import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../../context/AuthContext';

const DevelopmentGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: null,
    status: 'pending',
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = JSON.parse(localStorage.getItem(`goals_${user.email}`) || '[]');
    setGoals(savedGoals);
  }, [user.email]);

  const handleSaveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem(`goals_${user.email}`, JSON.stringify(updatedGoals));
  };

  const handleAddGoal = () => {
    const goalToAdd = {
      ...newGoal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    handleSaveGoals([...goals, goalToAdd]);
    setNewGoal({
      title: '',
      description: '',
      targetDate: null,
      status: 'pending',
    });
    setShowGoalDialog(false);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal(goal);
    setShowGoalDialog(true);
  };

  const handleUpdateGoal = () => {
    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id ? { ...newGoal, id: goal.id } : goal
    );
    handleSaveGoals(updatedGoals);
    setShowGoalDialog(false);
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: '',
      targetDate: null,
      status: 'pending',
    });
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    handleSaveGoals(updatedGoals);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in-progress':
        return <TrendingUpIcon />;
      default:
        return <PendingIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Development Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowGoalDialog(true)}
        >
          Add Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {goal.title}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditGoal(goal)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {goal.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    icon={getStatusIcon(goal.status)}
                    label={goal.status}
                    color={getStatusColor(goal.status)}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Due: {new Date(goal.targetDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={showGoalDialog}
        onClose={() => {
          setShowGoalDialog(false);
          setEditingGoal(null);
          setNewGoal({
            title: '',
            description: '',
            targetDate: null,
            status: 'pending',
          });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
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
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowGoalDialog(false);
            setEditingGoal(null);
            setNewGoal({
              title: '',
              description: '',
              targetDate: null,
              status: 'pending',
            });
          }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
          >
            {editingGoal ? 'Update' : 'Add'} Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DevelopmentGoals; 