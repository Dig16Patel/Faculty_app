import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';

const TestStorage = () => {
  const [storageData, setStorageData] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      const data = localStorage.getItem('appraisals');
      console.log('Raw localStorage data:', data);
      try {
        const parsedData = JSON.parse(data || '[]');
        console.log('Parsed localStorage data:', parsedData);
        setStorageData(parsedData);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    };

    loadData();
  }, []);

  const clearStorage = () => {
    localStorage.removeItem('appraisals');
    setStorageData([]);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Test Storage
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current localStorage Data:
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(storageData, null, 2)}
          </pre>
          <Button
            variant="contained"
            color="error"
            onClick={clearStorage}
            sx={{ mt: 2 }}
          >
            Clear Storage
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default TestStorage; 