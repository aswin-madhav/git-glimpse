import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        // Get token and user data from URL parameters
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const name = searchParams.get('name');
        const avatar_url = searchParams.get('avatar_url');

        console.log('Auth Callback Params:', { 
          token: token?.substring(0, 5) + '...', 
          username, 
          name,
          avatar_url: avatar_url ? 'present' : 'not present'
        });

        if (token && username) {
          // Create a user object with the data from the URL
          const userData = {
            login: username,
            username: username, // Add username explicitly for redundancy
            name: name || username, // Use provided name or username as fallback
            avatar_url: avatar_url || null,
          };
          
          console.log('Created user data object:', userData);

          // Update the authentication context
          login(userData, token);
          console.log('Login successful, user data set');

          // Mark processing as complete and redirect after a short delay
          setProcessingComplete(true);
          
          // Use window.location for a more direct navigation approach
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        } else {
          console.error('Missing token or username in callback URL');
          setError('Authentication failed: Missing token or username');
          setProcessingComplete(true);
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(`Authentication error: ${err.message}`);
        setProcessingComplete(true);
      }
    };

    // Process the authentication callback
    handleAuthCallback();
  }, [searchParams, login]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        p: 3,
      }}
    >
      {!processingComplete && <CircularProgress size={60} />}
      
      <Typography variant="h6" sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
        {error ? 'Authentication Error' : 'Authentication Complete!'}
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 3, maxWidth: '600px', textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      
      {processingComplete && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography sx={{ mb: 2 }}>
            You have successfully logged in. You will be redirected to the home page shortly.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            If you are not redirected, try clicking <a href="/">this direct link</a> instead.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AuthCallbackPage;
