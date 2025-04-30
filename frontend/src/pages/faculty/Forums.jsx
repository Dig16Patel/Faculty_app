import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Forums = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [showNewTopicDialog, setShowNewTopicDialog] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
  });
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    // Load topics from localStorage
    const savedTopics = JSON.parse(localStorage.getItem('forum_topics') || '[]');
    setTopics(savedTopics);
  }, []);

  const handleCreateTopic = () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) return;

    const topic = {
      id: Date.now(),
      title: newTopic.title,
      content: newTopic.content,
      author: user.email,
      createdAt: new Date().toISOString(),
      comments: [],
      likes: 0,
    };

    const updatedTopics = [...topics, topic];
    setTopics(updatedTopics);
    localStorage.setItem('forum_topics', JSON.stringify(updatedTopics));
    setShowNewTopicDialog(false);
    setNewTopic({ title: '', content: '' });
  };

  const handleAddComment = (topicId, comment) => {
    if (!comment.trim()) return;

    const updatedTopics = topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          comments: [
            ...topic.comments,
            {
              id: Date.now(),
              content: comment,
              author: user.email,
              createdAt: new Date().toISOString(),
            },
          ],
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
    localStorage.setItem('forum_topics', JSON.stringify(updatedTopics));
  };

  const handleLikeTopic = (topicId) => {
    const updatedTopics = topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          likes: topic.likes + 1,
        };
      }
      return topic;
    });

    setTopics(updatedTopics);
    localStorage.setItem('forum_topics', JSON.stringify(updatedTopics));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Discussion Forums
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowNewTopicDialog(true)}
        >
          New Topic
        </Button>
      </Box>

      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid item xs={12} key={topic.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {topic.title}
                  </Typography>
                  <Chip
                    icon={<ThumbUpIcon />}
                    label={topic.likes}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {topic.content}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {topic.author} • {new Date(topic.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<CommentIcon />}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic.comments.length} Comments
                </Button>
                <Button
                  size="small"
                  startIcon={<ThumbUpIcon />}
                  onClick={() => handleLikeTopic(topic.id)}
                >
                  Like
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* New Topic Dialog */}
      <Dialog
        open={showNewTopicDialog}
        onClose={() => setShowNewTopicDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={newTopic.content}
              onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewTopicDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateTopic}
            disabled={!newTopic.title.trim() || !newTopic.content.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog
        open={Boolean(selectedTopic)}
        onClose={() => setSelectedTopic(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedTopic?.title}</DialogTitle>
        <DialogContent>
          <List>
            {selectedTopic?.comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a comment..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(selectedTopic.id, e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTopic(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Forums; 