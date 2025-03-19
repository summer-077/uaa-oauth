import { OAUTH_AXIOS } from '@/core/http-client/oauth'
import UTIL from '@/core/util'

export default {
  getToken(code, oauthState) {
    if (oauthState !== sessionStorage.getItem('state')) {
      return Promise.reject(new Error('非法请求'))
    }
    sessionStorage.removeItem('state')
    const url = `${import.meta.env.VITE_APP_OAUTH_TOKEN_URL}`
    return OAUTH_AXIOS.post(url, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: `${import.meta.env.VITE_APP_OAUTH_CLIENT_ID}`,
        client_secret: `${import.meta.env.VITE_APP_OAUTH_CLIENT_SECRET}`,
        redirect_uri: `${import.meta.env.VITE_APP_OAUTH_REDIRECT_URI}`,
        code,
      },
    })
  },
  getUrl() {
    const state = UTIL.generateState()
    sessionStorage.setItem('state', state)
    window.location.href = `${import.meta.env.VITE_APP_OAUTH_AUTH_URL}&state=${state}`
  },
}
