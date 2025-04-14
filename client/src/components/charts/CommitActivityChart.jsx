import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CommitActivityChart = ({ commitActivity }) => {
  const theme = useTheme();
  
  // Check if commitActivity is an array and has data
  if (!commitActivity || commitActivity.error || !Array.isArray(commitActivity) || commitActivity.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Commit Activity
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          {commitActivity && commitActivity.error 
            ? (
              <>
                <Typography variant="body2" color="text.secondary" align="center">
                  {commitActivity.message || (
                    commitActivity.error === 'insufficient_history' 
                      ? 'This repository doesn\'t have enough commit history to display activity.'
                      : commitActivity.error === 'not_found'
                        ? 'Repository not found.'
                        : commitActivity.error === 'access_denied'
                          ? 'GitHub API rate limit exceeded or access denied.'
                          : 'Error loading commit activity data.'
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  {commitActivity.error === 'insufficient_history' && 'Try another repository with more commit history.'}
                  {commitActivity.error === 'access_denied' && 'Please try again later.'}
                </Typography>
              </>
            ) 
            : (
              <Typography variant="body2" color="text.secondary" align="center">
                No commit activity data available
              </Typography>
            )}
        </Box>
      </Paper>
    );
  }

  // Sort the commit activity data by week (timestamp) to ensure chronological order
  const sortedActivity = [...commitActivity].sort((a, b) => a.week - b.week);
  
  // Process data for the chart
  const labels = sortedActivity.map(item => {
    // Convert timestamp to date string
    const date = new Date(item.week * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const data = sortedActivity.map(item => item.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Commits',
        data,
        fill: true,
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: theme.palette.primary.dark,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Commit Activity Over Time',
        font: {
          family: theme.typography.fontFamily,
          size: 14,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            return `Commits: ${context.raw}`;
          }
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: theme.palette.divider,
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          color: theme.palette.text.secondary,
          padding: 8,
        },
        title: {
          display: true,
          text: 'Number of Commits',
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Commit Activity
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default CommitActivityChart;
