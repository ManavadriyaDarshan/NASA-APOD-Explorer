import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// APOD Endpoints
export const fetchTodayApod = async () => {
  try {
    const response = await axios.get(`${API_BASE}/apod/today`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch today\'s APOD');
  }
};

export const fetchApodByDate = async (date) => {
  try {
    const response = await axios.get(`${API_BASE}/apod/by-date`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch APOD for the selected date');
  }
};

export const fetchRecentApods = async (days = 7) => {
  try {
    const response = await axios.get(`${API_BASE}/apod/recent`, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch recent APODs');
  }
};

export const fetchRandomApods = async (count = 5) => {
  try {
    const response = await axios.get(`${API_BASE}/apod/random`, {
      params: { count }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch random APODs');
  }
};

// Favorites Endpoints
export const addFavorite = async (favoriteData) => {
  try {
    const response = await axios.post(`${API_BASE}/favorites`, favoriteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to add to favorites');
  }
};

export const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_BASE}/favorites`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch favorites');
  }
};

export const removeFavorite = async (date) => {
  try {
    const response = await axios.delete(`${API_BASE}/favorites/${date}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.detail || 'Failed to remove from favorites');
  }
};

export const checkFavorite = async (date) => {
  try {
    const response = await axios.get(`${API_BASE}/favorites/check/${date}`);
    return response.data;
  } catch (error) {
    return { is_favorite: false };
  }
};
