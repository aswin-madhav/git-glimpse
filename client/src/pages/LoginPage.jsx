import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Box, 
  CircularProgress, 
  Alert, 
  Card, 
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for error or code in URL params (after GitHub OAuth redirect)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const errorParam = queryParams.get('error');
    const code = queryParams.get('code');

    if (errorParam) {
      setError('Authentication failed: ' + errorParam);
    } else if (code) {
      // Exchange code for token
      exchangeCodeForToken(code);
    }
  }, [location]);

  const exchangeCodeForToken = async (code) => {
    setLoading(true);
    try {
      // Call your backend endpoint to exchange the code for a token
      const response = await fetch('/api/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with GitHub');
      }

      const data = await response.json();

      // Store the token in localStorage or a secure cookie
      localStorage.setItem('authToken', data.token);

      // Redirect to home or the page the user was trying to access
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo);
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    setLoading(true);
    // Store the current location to redirect back after login
    const redirectPath = location.state?.from?.pathname || '/';
    sessionStorage.setItem('redirectAfterLogin', redirectPath);

    // Use the GitHub login endpoint
    window.location.href = 'http://localhost:5001/api/auth/github-login';
  };

  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 8,
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
    }}>
      <Card elevation={4} sx={{ 
        width: '100%', 
        maxWidth: 1000, 
        borderRadius: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}>
        {/* Left side - Hero section */}
        <Box sx={{ 
          flex: { xs: '1', md: '3' },
          background: `linear-gradient(135deg, #333 0%, #555 100%)`,
          color: 'white',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            GitGlimpse
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Unlock the power of repository analytics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VisibilityIcon />
              <Typography variant="body1">
                Gain insights into repository activity and trends
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CodeIcon />
              <Typography variant="body1">
                Analyze code contributions and team performance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SearchIcon />
              <Typography variant="body1">
                Seamless integration with your GitHub repositories
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Right side - Login form */}
        <Box sx={{ 
          flex: { xs: '1', md: '2' },
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Welcome Back
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
            Sign in with your GitHub account to continue your repository analytics journey.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              {error}
            </Alert>
          )}
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<SearchIcon />}
            onClick={handleGitHubLogin}
            disabled={loading}
            sx={{
              py: 1.5,
              mt: 2,
              borderRadius: 2,
              bgcolor: '#333',
              color: 'white',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                bgcolor: '#555',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button>
          
          <Box sx={{ mt: 4, width: '100%' }}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Secure Authentication
              </Typography>
            </Divider>
            <Typography variant="caption" color="text.secondary">
              By signing in, you agree to allow GitGlimpse to access your GitHub repositories for analysis purposes.
            </Typography>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
