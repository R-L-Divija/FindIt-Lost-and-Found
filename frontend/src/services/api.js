import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('findit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      message = 'Connection timed out. The backend server could not reach the database. Please verify your MongoDB Atlas IP whitelist or database connection.';
    } else if (error.message === 'Network Error') {
      message = 'Unable to reach the backend server. Please ensure the backend is running at http://localhost:5000.';
    }
    
    // Attach user-friendly message to error object
    error.userMessage = message;

    // Handle 401 unauthorized (expired or invalid token)
    if (error.response?.status === 401) {
      // Clear local storage if token is invalid
      const currentToken = localStorage.getItem('findit_token');
      if (currentToken && !error.config.url.includes('/auth/signin')) {
        localStorage.removeItem('findit_token');
        localStorage.removeItem('findit_user');
        // Dispatch custom event so context can react
        window.dispatchEvent(new Event('findit_auth_logout'));
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  signin: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const itemsAPI = {
  // GET /items with search & filter params
  getItems: async (params = {}) => {
    const query = {};
    if (params.type && params.type !== 'all') query.type = params.type;
    if (params.category && params.category !== 'all') query.category = params.category;
    if (params.location && params.location.trim()) query.location = params.location.trim();
    if (params.search && params.search.trim()) query.search = params.search.trim();

    const response = await api.get('/items', { params: query });
    return response.data;
  },

  // GET /items/:id
  getItemById: async (id) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // GET /items/my-reports
  getMyReports: async () => {
    const response = await api.get('/items/my-reports');
    return response.data;
  },

  // POST /uploads/item-image (multipart FormData with field name "image")
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads/item-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { success: true, imageUrl, imagePublicId }
  },

  // POST /items: create an item report
  // If an image file is provided, we can either:
  // 1. Upload via /uploads/item-image first to obtain imageUrl and imagePublicId,
  // 2. Or pass multipart FormData directly with "image" attached, adapting to backend.
  createItem: async (itemData, imageFile = null) => {
    let imageUrl = '';
    let imagePublicId = '';

    // If an image file was selected, upload it via the dedicated upload endpoint first
    if (imageFile) {
      try {
        const uploadRes = await itemsAPI.uploadImage(imageFile);
        if (uploadRes.success && uploadRes.imageUrl) {
          imageUrl = uploadRes.imageUrl;
          imagePublicId = uploadRes.imagePublicId || '';
        }
      } catch (uploadErr) {
        console.warn('Dedicated upload failed, falling back to direct multipart submission:', uploadErr.userMessage);
      }
    }

    // Prepare multipart form data for POST /items because backend itemRoutes uses upload.single("image")
    const formData = new FormData();
    formData.append('title', itemData.title);
    formData.append('description', itemData.description);
    formData.append('type', itemData.type);
    formData.append('category', itemData.category);
    formData.append('location', itemData.location);
    formData.append('date', itemData.date);

    if (imageUrl) formData.append('imageUrl', imageUrl);
    if (imagePublicId) formData.append('imagePublicId', imagePublicId);
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // PATCH /items/:id: update allowed fields (title, description, category, location, date)
  updateItem: async (id, updateData) => {
    const response = await api.patch(`/items/${id}`, updateData);
    return response.data;
  },

  // DELETE /items/:id
  deleteItem: async (id) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

export default api;
