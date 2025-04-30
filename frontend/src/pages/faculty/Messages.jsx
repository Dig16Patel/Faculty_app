import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  IconButton,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = JSON.parse(localStorage.getItem(`messages_${user.email}`) || '[]');
    setMessages(savedMessages);
    setUnreadCount(savedMessages.filter(m => !m.read).length);
  }, [user.email]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: user.email,
      receiver: 'admin@example.com', // This would be dynamic in a real app
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${user.email}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const markAsRead = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${user.email}`, JSON.stringify(updatedMessages));
    setUnreadCount(updatedMessages.filter(m => !m.read).length);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Messages
        </Typography>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <List>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => markAsRead(message.id)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: message.read ? 'inherit' : 'action.hover',
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1">
                        {message.sender === user.email ? 'You' : 'Admin'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary">
                        {message.content}
                      </Typography>
                      {!message.read && (
                        <Chip
                          label="New"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Messages; 