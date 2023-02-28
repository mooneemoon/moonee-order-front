import axios, { AxiosInstance } from 'axios';

export const client : AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PAYMENT_API_URL,
  headers: {
    'payment-api-key': process.env.REACT_APP_PAYMENT_API_KEY ?? '',
  },
});

export const productClient : AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    withCredentials: true,
  },
});

