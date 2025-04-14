import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Divider, Chip, Grid } from '@mui/material';
import { getRepoMetadata, getContributors, getCommitActivity } from '../services/api';
import RepoDashboard from './RepoDashboard';
import { mockMetadata, mockContributors, mockCommitActivity } from '../services/mockData';

const RepoDetails = () => {
  const { repoId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [commitActivity, setCommitActivity] = useState([]);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true);
        
        // Fetch repository data in parallel
        try {
          const [metadataRes, contributorsRes, commitActivityRes] = await Promise.all([
            getRepoMetadata(repoId),
            getContributors(repoId),
            getCommitActivity(repoId)
          ]);
          
          setMetadata(metadataRes);
          setContributors(contributorsRes);
          setCommitActivity(commitActivityRes);
        } catch (err) {
          console.error('Error fetching repository data:', err);
          // Use mock data if API fails
          setMetadata(mockMetadata);
          setContributors(mockContributors);
          setCommitActivity(mockCommitActivity);
        }
      } catch (err) {
        console.error('Error in data fetching:', err);
        setError('Failed to load repository data');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [repoId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!metadata) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">
          Repository not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {metadata.name}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {metadata.full_name}
        </Typography>
        
        {metadata.description && (
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            {metadata.description}
          </Typography>
        )}
        
        <Box sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Chip label={`Stars: ${metadata.stars || 0}`} variant="outlined" />
            </Grid>
            <Grid item>
              <Chip label={`Forks: ${metadata.forks || 0}`} variant="outlined" />
            </Grid>
            <Grid item>
              <Chip label={`Open Issues: ${metadata.open_issues || 0}`} variant="outlined" />
            </Grid>
            <Grid item>
              <Chip label={`Total Issues: ${metadata.total_issues || metadata.open_issues || 0}`} variant="outlined" />
            </Grid>
            <Grid item>
              <Chip label={`Language: ${metadata.language || 'Not specified'}`} variant="outlined" />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Repository Dashboard with Charts */}
      <RepoDashboard 
        repoId={repoId}
        metadata={metadata}
        contributors={contributors}
        commitActivity={commitActivity}
      />
    </Container>
  );
};

export default RepoDetails;
