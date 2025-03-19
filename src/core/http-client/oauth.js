import axios from 'axios'

export const OAUTH_AXIOS = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
  withCredentials: true,
})
