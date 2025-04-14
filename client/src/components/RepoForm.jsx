import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { analyzeRepo } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RepoForm = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!repoUrl) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    try {
      setLoading(true);
      const result = await analyzeRepo(repoUrl);
      
      if (result.error) {
        setError(result.error);
      } else if (result.repoId) {
        navigate(`/repo/${result.repoId}`);
      } else {
        setError('An unexpected error occurred');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to be logged in to analyze GitHub repositories.
        </Alert>
        <Typography variant="body1" paragraph>
          Please sign in with your GitHub account to access the repository analyzer.
        </Typography>
        <Button 
          variant="contained" 
          component={Link}
          to="/login"
          sx={{ 
            mt: 2,
            bgcolor: '#333',
            color: 'white',
            '&:hover': {
              bgcolor: '#555'
            }
          }}
        >
          Sign in
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Analyze GitHub Repository
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="GitHub Repository URL"
          placeholder="https://github.com/username/repo"
          variant="outlined"
          margin="normal"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          error={!!error}
          helperText={error || 'Enter the full URL of a GitHub repository'}
          disabled={loading}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ 
            mt: 3, 
            mb: 2,
            bgcolor: '#333',
            color: 'white',
            '&:hover': {
              bgcolor: '#555'
            }
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Repository'}
        </Button>
      </Box>
    </Paper>
  );
};

export default RepoForm;
