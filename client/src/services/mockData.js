// Mock data for testing visualizations

export const mockCommitActivity = [
  { week: 1680307200, total: 12, days: [2, 3, 1, 0, 4, 2, 0] },
  { week: 1680912000, total: 18, days: [0, 5, 3, 4, 2, 3, 1] },
  { week: 1681516800, total: 24, days: [1, 6, 4, 5, 3, 2, 3] },
  { week: 1682121600, total: 15, days: [0, 2, 3, 5, 1, 2, 2] },
  { week: 1682726400, total: 22, days: [3, 4, 5, 2, 3, 4, 1] },
  { week: 1683331200, total: 28, days: [2, 6, 7, 4, 5, 3, 1] },
  { week: 1683936000, total: 19, days: [1, 3, 4, 2, 5, 2, 2] },
  { week: 1684540800, total: 31, days: [3, 7, 6, 5, 4, 3, 3] },
  { week: 1685145600, total: 25, days: [2, 5, 4, 6, 3, 4, 1] },
  { week: 1685750400, total: 20, days: [1, 4, 3, 5, 2, 3, 2] },
];

export const mockContributors = [
  { login: 'developer1', contributions: 127, avatar_url: 'https://avatars.githubusercontent.com/u/12345' },
  { login: 'developer2', contributions: 95, avatar_url: 'https://avatars.githubusercontent.com/u/23456' },
  { login: 'developer3', contributions: 68, avatar_url: 'https://avatars.githubusercontent.com/u/34567' },
  { login: 'developer4', contributions: 42, avatar_url: 'https://avatars.githubusercontent.com/u/45678' },
  { login: 'developer5', contributions: 31, avatar_url: 'https://avatars.githubusercontent.com/u/56789' },
  { login: 'developer6', contributions: 24, avatar_url: 'https://avatars.githubusercontent.com/u/67890' },
];

export const mockCommitFrequency = {
  'Monday': 42,
  'Tuesday': 56,
  'Wednesday': 48,
  'Thursday': 51,
  'Friday': 38,
  'Saturday': 25,
  'Sunday': 18,
};

export const mockMetadata = {
  name: 'awesome-project',
  full_name: 'developer1/awesome-project',
  description: 'A comprehensive toolkit for modern web development with React and Node.js',
  stars: 256,
  forks: 78,
  open_issues: 12,
  language: 'JavaScript',
  created_at: '2023-01-15T10:30:00Z',
  updated_at: '2023-04-20T15:45:00Z',
};

// Helper function to use mock data when API calls fail
export const useMockDataIfNeeded = (apiData, mockData) => {
  return apiData || mockData;
};
