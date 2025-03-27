import { API_AXIOS } from '@/core/http-client/api'

export default {
  getMe() {
    return API_AXIOS.get('/me', {
      // params: {
      //   code,
      //   oauthState,
      // },
    })
  },
}
