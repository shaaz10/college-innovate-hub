import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    university?: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return response.data;
  },
};

// Problems API
export const problemsAPI = {
  getProblems: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tags?: string;
    sort?: string;
  }) => {
    const response = await api.get('/problems', { params });
    return response.data;
  },

  getProblem: async (id: string) => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  },

  createProblem: async (problemData: any) => {
    const response = await api.post('/problems', problemData);
    return response.data;
  },

  updateProblem: async (id: string, problemData: any) => {
    const response = await api.put(`/problems/${id}`, problemData);
    return response.data;
  },

  deleteProblem: async (id: string) => {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  },

  voteProblem: async (id: string, type: 'upvote' | 'downvote') => {
    const response = await api.post(`/problems/${id}/vote`, { type });
    return response.data;
  },

  removeVote: async (id: string) => {
    const response = await api.delete(`/problems/${id}/vote`);
    return response.data;
  },
};

// Ideas API
export const ideasAPI = {
  getIdeas: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    problemId?: string;
    stage?: number;
    sort?: string;
  }) => {
    const response = await api.get('/ideas', { params });
    return response.data;
  },

  getIdea: async (id: string) => {
    const response = await api.get(`/ideas/${id}`);
    return response.data;
  },

  createIdea: async (ideaData: any) => {
    const response = await api.post('/ideas', ideaData);
    return response.data;
  },

  updateIdea: async (id: string, ideaData: any) => {
    const response = await api.put(`/ideas/${id}`, ideaData);
    return response.data;
  },

  deleteIdea: async (id: string) => {
    const response = await api.delete(`/ideas/${id}`);
    return response.data;
  },

  voteIdea: async (id: string, type: 'upvote' | 'downvote') => {
    const response = await api.post(`/ideas/${id}/vote`, { type });
    return response.data;
  },

  removeVote: async (id: string) => {
    const response = await api.delete(`/ideas/${id}/vote`);
    return response.data;
  },
};

// Startups API
export const startupsAPI = {
  getStartups: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    industry?: string;
    stage?: number;
    status?: string;
    sort?: string;
  }) => {
    const response = await api.get('/startups', { params });
    return response.data;
  },

  getStartup: async (id: string) => {
    const response = await api.get(`/startups/${id}`);
    return response.data;
  },

  createStartup: async (startupData: any) => {
    const response = await api.post('/startups', startupData);
    return response.data;
  },

  updateStartup: async (id: string, startupData: any) => {
    const response = await api.put(`/startups/${id}`, startupData);
    return response.data;
  },

  deleteStartup: async (id: string) => {
    const response = await api.delete(`/startups/${id}`);
    return response.data;
  },

  voteStartup: async (id: string) => {
    const response = await api.post(`/startups/${id}/vote`);
    return response.data;
  },

  updateMilestone: async (id: string, milestoneIndex: number, completed: boolean) => {
    const response = await api.put(`/startups/${id}/milestones/${milestoneIndex}`, { completed });
    return response.data;
  },
};

// Comments API
export const commentsAPI = {
  getComments: async (params: {
    targetType: 'Problem' | 'Idea' | 'Startup';
    targetId: string;
    page?: number;
    limit?: number;
    parentComment?: string;
  }) => {
    const response = await api.get('/comments', { params });
    return response.data;
  },

  createComment: async (commentData: {
    content: string;
    targetType: 'Problem' | 'Idea' | 'Startup';
    targetId: string;
    parentComment?: string;
  }) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  updateComment: async (id: string, content: string) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  likeComment: async (id: string) => {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  },
};

export default api;