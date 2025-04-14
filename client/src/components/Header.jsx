import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ 
      borderRadius: 0,
      bgcolor: 'background.paper',
      color: 'text.primary',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      width: '100%',
      left: 0,
      right: 0
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            GITGLIMPSE
          </Typography>
          <Button 
            component={RouterLink} 
            to="/"
            sx={{ 
              mx: 1, 
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Home
          </Button>
          <Button 
            component={RouterLink} 
            to="/about"
            sx={{ 
              mx: 1, 
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            About
          </Button>
          
          <Box sx={{ ml: 2 }}>
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Button 
                component={RouterLink} 
                to="/login"
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'text.primary',
                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
