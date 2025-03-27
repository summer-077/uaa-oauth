import axios from 'axios'

export const AUTH_AXIOS = axios.create({
  baseURL: '/api/authorize',
  timeout: 10000,
})
