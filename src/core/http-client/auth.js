import axios from 'axios'

export const AUTH_AXIOS = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/api/authorize`,
  timeout: 10000,
})
