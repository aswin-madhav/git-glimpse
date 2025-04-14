import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Divider, CircularProgress } from '@mui/material';
import { getCommitFrequency } from '../services/api';
import CommitActivityChart from './charts/CommitActivityChart';
import ContributorsChart from './charts/ContributorsChart';
import CommitFrequencyChart from './charts/CommitFrequencyChart';
import LanguageChart from './charts/LanguageChart';

const RepoDashboard = ({ repoId, metadata, contributors, commitActivity }) => {
  const [commitFrequency, setCommitFrequency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommitFrequency = async () => {
      try {
        setLoading(true);
        const frequencyData = await getCommitFrequency(repoId);
        setCommitFrequency(frequencyData);
      } catch (err) {
        console.error('Error fetching commit frequency:', err);
        setError('Failed to load commit frequency data');
      } finally {
        setLoading(false);
      }
    };

    if (repoId) {
      fetchCommitFrequency();
    }
  }, [repoId]);

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', color: '#1976d2' }}>
          Repository Analytics Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Repository Overview */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {metadata?.stars || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Stars
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {metadata?.forks || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Forks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'rgba(211, 47, 47, 0.04)' }}>
              <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                {metadata?.open_issues || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Open Issues
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'rgba(156, 39, 176, 0.04)' }}>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {contributors?.length || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Contributors
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ ml: 1, mb: 2, fontWeight: 'medium' }}>
        Repository Insights
      </Typography>

      <Grid container spacing={3}>
        {/* Language Distribution Chart */}
        <Grid item xs={12} md={6}>
          <LanguageChart languages={metadata?.languages || {}} />
        </Grid>

        {/* Contributors Chart */}
        <Grid item xs={12} md={6}>
          <ContributorsChart contributors={contributors} />
        </Grid>

        {/* Commit Activity Chart */}
        <Grid item xs={12} md={6}>
          <CommitActivityChart commitActivity={commitActivity} />
        </Grid>

        {/* Commit Frequency Chart */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress />
            </Paper>
          ) : error ? (
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Commit Frequency by Day</Typography>
              <Typography variant="body2" color="error">{error}</Typography>
            </Paper>
          ) : (
            <CommitFrequencyChart commitFrequency={commitFrequency} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RepoDashboard;
