import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CommitFrequencyChart = ({ commitFrequency }) => {
  const theme = useTheme();
  
  if (!commitFrequency || typeof commitFrequency !== 'object' || commitFrequency.error) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Commit Frequency by Day
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {commitFrequency && commitFrequency.error 
            ? `Error loading commit frequency: ${commitFrequency.error}` 
            : 'No commit frequency data available'}
        </Typography>
      </Paper>
    );
  }

  // Check if it's an empty object or missing day data
  const hasDayData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    .some(day => typeof commitFrequency[day] === 'number' && commitFrequency[day] !== undefined);
  
  console.log('CommitFrequencyChart - hasDayData:', hasDayData, 'data:', commitFrequency);
    
  if (Object.keys(commitFrequency).length === 0 || !hasDayData) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Commit Frequency by Day
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No commit frequency data available
        </Typography>
      </Paper>
    );
  }

  // Days of the week - reordered to start with Monday (workweek first)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Process data for the chart
  const data = daysOfWeek.map(day => commitFrequency[day] || 0);
  
  // Generate gradient colors - workdays vs weekend
  const workdayColor = theme.palette.primary.main;
  const weekendColor = theme.palette.secondary.main;
  
  const backgroundColor = daysOfWeek.map((day, index) => {
    // Weekend days (Saturday and Sunday)
    if (index >= 5) {
      return `${weekendColor}99`; // Add transparency
    }
    // Workdays (Monday to Friday)
    return `${workdayColor}99`; // Add transparency
  });
  
  const borderColor = daysOfWeek.map((day, index) => {
    // Weekend days (Saturday and Sunday)
    if (index >= 5) {
      return weekendColor;
    }
    // Workdays (Monday to Friday)
    return workdayColor;
  });

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Commits',
        data,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: daysOfWeek.map((day, index) => 
          index >= 5 ? weekendColor : workdayColor
        ),
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
        text: 'Commit Frequency by Day of Week',
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
        callbacks: {
          label: (context) => `${context.parsed.y} commits`
        }
      }
    },
    scales: {
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
        },
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Commit Frequency by Day
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default CommitFrequencyChart;
