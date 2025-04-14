import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About GitHub Repository Analyzer
        </Typography>

        <Typography variant="body1" paragraph>
          The GitHub Repository Analyzer is a tool designed to provide insights into GitHub repositories.
          It analyzes repository data including code structure, contributor statistics, and commit activity.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                Repository metadata analysis
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Contributor statistics
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Commit activity visualization
              </Typography>
            </li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
