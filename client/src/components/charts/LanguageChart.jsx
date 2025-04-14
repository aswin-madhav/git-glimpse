import React from 'react';
import { Pie } from 'react-chartjs-2';
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

const LanguageChart = ({ languages }) => {
  // Handle error cases or empty data
  if (!languages || typeof languages !== 'object' || languages.error || Object.keys(languages).length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Language Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {languages && languages.error 
            ? `Error loading language data: ${languages.error}` 
            : 'No language data available'}
        </Typography>
      </Paper>
    );
  }
  
  // Process language data
  const languageEntries = Object.entries(languages);
  
  // Sort languages by byte count (descending)
  languageEntries.sort((a, b) => b[1] - a[1]);
  
  // Take top 8 languages for better visualization
  const topLanguages = languageEntries.slice(0, 8);
  
  // Calculate total bytes for percentage calculation
  const totalBytes = languageEntries.reduce((sum, [_, bytes]) => sum + bytes, 0);
  
  // If there are more than 8 languages, add an "Other" category
  if (languageEntries.length > 8) {
    const otherBytes = languageEntries.slice(8).reduce((sum, [_, bytes]) => sum + bytes, 0);
    topLanguages.push(['Other', otherBytes]);
  }

  // Generate colors for each language
  const generateColors = (count) => {
    // Predefined colors for common languages
    const languageColors = {
      JavaScript: 'hsla(50, 85%, 60%, 0.7)',
      TypeScript: 'hsla(200, 85%, 60%, 0.7)',
      Python: 'hsla(240, 85%, 60%, 0.7)',
      Java: 'hsla(20, 85%, 60%, 0.7)',
      'C++': 'hsla(180, 85%, 60%, 0.7)',
      C: 'hsla(190, 85%, 60%, 0.7)',
      'C#': 'hsla(260, 85%, 60%, 0.7)',
      Ruby: 'hsla(0, 85%, 60%, 0.7)',
      Go: 'hsla(210, 85%, 60%, 0.7)',
      Rust: 'hsla(30, 85%, 60%, 0.7)',
      PHP: 'hsla(270, 85%, 60%, 0.7)',
      HTML: 'hsla(10, 85%, 60%, 0.7)',
      CSS: 'hsla(220, 85%, 60%, 0.7)',
      Other: 'hsla(150, 85%, 60%, 0.7)',
    };
    
    const colors = [];
    const backgroundColors = [];
    
    for (let i = 0; i < count; i++) {
      // Use golden ratio for good color distribution if not a predefined language
      const hue = (i * 137.5) % 360;
      colors.push(`hsla(${hue}, 70%, 50%, 1)`);
      backgroundColors.push(`hsla(${hue}, 70%, 50%, 0.7)`);
    }
    
    return { colors, backgroundColors };
  };
  
  // Prepare data for chart
  const languageNames = topLanguages.map(([lang]) => lang);
  const languageBytes = topLanguages.map(([_, bytes]) => bytes);
  
  const { colors, backgroundColors } = generateColors(languageNames.length);
  
  // Override with predefined colors where available
  const predefinedColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Other: '#cccccc',
  };
  
  // Apply predefined colors where available
  const finalBackgroundColors = languageNames.map((lang, i) => 
    predefinedColors[lang] ? predefinedColors[lang] + 'BB' : backgroundColors[i]
  );
  
  const finalBorderColors = languageNames.map((lang, i) => 
    predefinedColors[lang] || colors[i]
  );

  const chartData = {
    labels: languageNames,
    datasets: [
      {
        data: languageBytes,
        backgroundColor: finalBackgroundColors,
        borderColor: finalBorderColors,
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
          padding: 10,
          font: {
            size: 11
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = Math.round((value / totalBytes) * 100);
            const kb = Math.round(value / 1024);
            return `${label}: ${percentage}% (${kb} KB)`;
          },
        },
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Language Distribution
      </Typography>
      <Box sx={{ height: 300, mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pie data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default LanguageChart;
