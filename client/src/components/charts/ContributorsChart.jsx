import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const ContributorsChart = ({ contributors }) => {
  if (!contributors || !Array.isArray(contributors) || contributors.length === 0 || contributors.error) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Top Contributors
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contributors && contributors.error 
            ? `Error loading contributors: ${contributors.error}` 
            : 'No contributor data available'}
        </Typography>
      </Paper>
    );
  }

  // Take top 5 contributors for the chart
  const topContributors = contributors.slice(0, 5);
  
  // Generate random colors for each contributor
  const generateColors = (count) => {
    const colors = [];
    const backgroundColors = [];
    
    for (let i = 0; i < count; i++) {
      const hue = (i * 70) % 360; // Spread colors evenly around the color wheel
      colors.push(`hsla(${hue}, 70%, 50%, 1)`);
      backgroundColors.push(`hsla(${hue}, 70%, 50%, 0.8)`);
    }
    
    return { colors, backgroundColors };
  };
  
  const { colors, backgroundColors } = generateColors(topContributors.length);

  const chartData = {
    labels: topContributors.map(contributor => contributor.login),
    datasets: [
      {
        data: topContributors.map(contributor => contributor.contributions),
        backgroundColor: backgroundColors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} commits (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Top Contributors
      </Typography>
      <Box sx={{ height: 300, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Doughnut data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default ContributorsChart;
