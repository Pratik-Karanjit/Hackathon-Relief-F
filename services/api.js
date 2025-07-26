import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from '../constants.js';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: Constants.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Routes that don't require authentication token
const PUBLIC_ROUTES = [
  '/user/login',
  '/user/signup',
  '/user/signup/user'
];

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      // Check if the current route requires authentication
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        config.url?.includes(route) || config.url === route
      );

      // Add auth token only if it's not a public route
      if (!isPublicRoute) {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        console.log('Skipping token for public route:', config.url);
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    
    return response;
  },
  async (error) => {
    console.error('Response Error:', error);
    
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Handle unauthorized - clear stored data and redirect to login
          console.log('Unauthorized access - clearing stored data');
          try {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'refreshToken', 'userRole', 'loginResponse']);
          } catch (clearError) {
            console.error('Error clearing AsyncStorage:', clearError);
          }
          break;
        case 403:
          console.log('Forbidden access');
          break;
        case 404:
          console.log('Resource not found');
          break;
        case 500:
          console.log('Server error');
          break;
        default:
          console.log(`Error ${status}:`, data);
      }
    } else if (error.request) {
      console.log('Network error - no response received');
    } else {
      console.log('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;