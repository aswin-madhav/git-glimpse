import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeRepo = async (repoUrl) => {
  try {
    const response = await api.post('/analyze', { repoUrl });
    return response.data;
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw error;
  }
};

export const getRepoMetadata = async (repoId) => {
  try {
    const response = await api.get(`/repo/metadata/${repoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching repository metadata:', error);
    throw error;
  }
};

export const getContributors = async (repoId) => {
  try {
    const response = await api.get(`/repo/contributors/${repoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw error;
  }
};

export const getCommitActivity = async (repoId) => {
  try {
    const response = await api.get(`/repo/commits/activity/${repoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    throw error;
  }
};

export const getCommitFrequency = async (repoId) => {
  try {
    const response = await api.get(`/repo/commits/frequency/${repoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commit frequency:', error);
    throw error;
  }
};

export default api;
