import React from 'react';
import { Container, Typography, Box, Paper, Grid, useTheme, alpha } from '@mui/material';
import RepoForm from '../components/RepoForm';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';

const HomePage = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, rgba(240, 240, 240, 0.8) 0%, rgba(250, 250, 250, 0.8) 100%)`,
      pt: 8,
      pb: 12
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          mb: 8, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' 
        }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1,
            borderRadius: 2,
            bgcolor: 'rgba(0, 0, 0, 0.05)',
          }}>
            <SearchIcon sx={{ mr: 1, color: '#333' }} />
            <Typography variant="subtitle1" fontWeight="medium" sx={{ color: '#333' }}>
              GitGlimpse
            </Typography>
          </Box>
          
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Unlock the Power of Your GitHub Repositories
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph sx={{ 
            maxWidth: 700,
            mb: 6,
            lineHeight: 1.6
          }}>
            Gain valuable insights into your code, contributors, and repository activity with our advanced analytics platform
          </Typography>
        </Box>
        
        {/* Form Section */}
        <Paper elevation={4} sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          mb: 8,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ 
            p: { xs: 3, md: 5 },
            bgcolor: 'background.paper'
          }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="600" sx={{ mb: 3 }}>
              Analyze a Repository
            </Typography>
            <RepoForm />
          </Box>
        </Paper>
        
        {/* Features Section */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="600" sx={{ mb: 6 }}>
            Powerful Analytics Features
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
                }
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  mb: 3
                }}>
                  <SearchIcon sx={{ color: '#333' }} fontSize="large" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="600">
                  Repository Metrics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Get comprehensive statistics about stars, forks, issues, and pull requests to understand your GitHub repository's popularity.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
                }
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  mb: 3
                }}>
                  <AnalyticsIcon sx={{ color: '#555' }} fontSize="large" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="600">
                  Commit Analysis
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualize commit frequency and activity patterns to identify your team's development trends and cycles.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ 
                p: 4, 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
                }
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                  mb: 3
                }}>
                  <InsightsIcon sx={{ color: '#555' }} fontSize="large" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="600">
                  Contributor Insights
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Track individual contributions and team collaboration to better understand your project's development dynamics.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
