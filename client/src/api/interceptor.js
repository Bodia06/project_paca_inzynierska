import axios from 'axios';
import CONSTANTS from '../constants';

const instance = axios.create({
  baseURL: CONSTANTS.BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      window.localStorage.setItem('accessToken', response.data.token);
    }
    return response;
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      window.localStorage.removeItem('accessToken');
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/registration'
      ) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
