import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, Menu, MenuItem, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const UserProfile = () => {
  // Get auth context but also maintain local state
  const { user: contextUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Effect to load user data from localStorage on component mount and when contextUser changes
  useEffect(() => {
    // First try to use the context user
    if (contextUser && (contextUser.login || contextUser.username)) {
      console.log('Using user from context:', contextUser);
      setUser(contextUser);
      return;
    }
    
    // If no context user or missing username, try localStorage
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        console.log('Using user from localStorage:', parsedUserData);
        setUser(parsedUserData);
      } else {
        console.log('No user data in localStorage');
      }
    } catch (err) {
      console.error('Error loading user data from localStorage:', err);
    }
  }, [contextUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  // If no user data is available after all attempts, return null
  if (!user) {
    console.log('No user data available after all attempts');
    return null;
  }
  
  // Get username with fallbacks
  const displayName = user.login || user.username || user.name || 'User';
  
  // Log which property we're using
  console.log(`Using ${displayName} as display name from:`, 
    user.login ? 'login' : 
    user.username ? 'username' : 
    user.name ? 'name' : 'none');
  
  // Force a direct check of localStorage for debugging
  try {
    const directLocalStorage = localStorage.getItem('userData');
    if (directLocalStorage) {
      const parsed = JSON.parse(directLocalStorage);
      console.log('Direct localStorage check:', parsed);
      console.log('Username from localStorage:', 
        parsed.login || parsed.username || parsed.name || 'not found');
    } else {
      console.log('Direct localStorage check: No data found');
    }
  } catch (e) {
    console.error('Error in direct localStorage check:', e);
  }

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
        startIcon={
          user.avatar_url ? (
            <Avatar 
              src={user.avatar_url} 
              alt={displayName} 
              sx={{ width: 28, height: 28 }}
            />
          ) : (
            <AccountCircleIcon />
          )
        }
      >
        <Typography variant="subtitle2" fontWeight="medium">
          {displayName}
        </Typography>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">{user.name || user.login}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email || ''}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfile;
