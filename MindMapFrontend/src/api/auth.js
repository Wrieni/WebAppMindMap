import axios from 'axios';

const API_URL = 'http://localhost:7204/api';

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/Auth/register`, data);
};

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/Auth/login`, data);
};
