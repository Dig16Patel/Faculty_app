import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Help as HelpIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Book as BookIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Support as SupportIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoLibraryIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import './HelpSupport.css';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState('faq');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const faqs = [
    {
      question: 'How do I submit my appraisal?',
      answer:
        'To submit your appraisal, navigate to the Appraisal section, click on "New Appraisal", fill in all required fields, and click "Submit". Make sure to review your entries before submission.',
    },
    {
      question: 'How can I add my publications?',
      answer:
        'Go to the Publications section, click "Add Publication", and fill in the publication details including title, authors, type, date, and other required information.',
    },
    {
      question: 'How do I update my profile?',
      answer:
        'Visit the Settings section, click on "Profile Settings", make your changes, and click "Save Changes" to update your profile information.',
    },
    {
      question: 'How can I generate reports?',
      answer:
        'Navigate to the Reports section, select the type of report you want to generate, choose the time range, and click "Generate Report".',
    },
  ];

  const documentation = [
    {
      title: 'User Guide',
      type: 'pdf',
      size: '2.5 MB',
      description: 'Complete guide to using the Faculty Appraisal System',
    },
    {
      title: 'Appraisal Guidelines',
      type: 'pdf',
      size: '1.8 MB',
      description: 'Detailed guidelines for faculty appraisal process',
    },
    {
      title: 'Video Tutorials',
      type: 'video',
      size: '150 MB',
      description: 'Step-by-step video tutorials for all features',
    },
  ];

  const supportChannels = [
    {
      title: 'Email Support',
      icon: <EmailIcon />,
      description: 'support@facultyappraisal.com',
      responseTime: 'Within 24 hours',
    },
    {
      title: 'Phone Support',
      icon: <PhoneIcon />,
      description: '+1 (555) 123-4567',
      responseTime: 'Mon-Fri, 9 AM - 5 PM',
    },
    {
      title: 'Live Chat',
      icon: <ChatIcon />,
      description: 'Available 24/7',
      responseTime: 'Within 5 minutes',
    },
  ];

  return (
    <Box className="help-support-container">
      <Typography variant="h4" className="page-title">
        Help & Support
      </Typography>

      <Paper className="search-section">
        <Box className="search-box">
          <SearchIcon className="search-icon" />
          <TextField
            fullWidth
            placeholder="Search for help..."
            value={searchQuery}
            onChange={handleSearch}
            variant="outlined"
            className="search-input"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* FAQs Section */}
        <Grid item xs={12} md={8}>
          <Paper className="help-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <QuestionAnswerIcon className="section-icon" /> Frequently Asked
                Questions
              </Typography>
            </Box>

            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expandedSection === `faq-${index}`}
                onChange={handleAccordionChange(`faq-${index}`)}
                className="faq-accordion"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className="faq-question"
                >
                  <Typography variant="subtitle1">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Support Channels */}
        <Grid item xs={12} md={4}>
          <Paper className="help-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <SupportIcon className="section-icon" /> Support Channels
              </Typography>
            </Box>

            <List>
              {supportChannels.map((channel, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>{channel.icon}</ListItemIcon>
                    <ListItemText
                      primary={channel.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {channel.description}
                          </Typography>
                          <Chip
                            label={channel.responseTime}
                            size="small"
                            color="info"
                            className="response-time-chip"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < supportChannels.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Documentation */}
        <Grid item xs={12}>
          <Paper className="help-section">
            <Box className="section-header">
              <Typography variant="h6" className="section-title">
                <BookIcon className="section-icon" /> Documentation
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {documentation.map((doc, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper className="document-card">
                    <Box className="document-icon">
                      {doc.type === 'pdf' ? (
                        <ArticleIcon />
                      ) : (
                        <VideoLibraryIcon />
                      )}
                    </Box>
                    <Typography variant="h6" className="document-title">
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.description}
                    </Typography>
                    <Box className="document-meta">
                      <Chip
                        label={doc.type.toUpperCase()}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {doc.size}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      className="download-button"
                    >
                      Download
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HelpSupport; 