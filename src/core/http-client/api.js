import axios from 'axios'

export const API_AXIOS = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  baseURL: '/dev',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
  withCredentials: true,
})
