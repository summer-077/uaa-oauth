import { defineStore } from 'pinia'
import OAUTH_API from '../services/oauth.service'
import router from '../router'
import UTIL from '@/core/util'

// Pinia store
export const useAuthStore = defineStore('auth', {
  state: () => {
    const secret = 'secret'
    const getAuthFromStorage = () => {
      const auth = sessionStorage.getItem('auth')
        ? JSON.parse(UTIL.decryptStr(sessionStorage.getItem('auth'), secret))
        : null
      return auth
    }

    const auth = getAuthFromStorage()

    return {
      isLogin: !!sessionStorage.getItem('auth'),
      secret: secret,
      mfa: null,
      loginErrMsg: null,
      auth: {
        accessToken: auth ? auth['access_token'] : null,
        refreshToken: auth ? auth['refresh_token'] : null,
      },
    }
  },
  actions: {
    // Login action
    async login({ code, oauthState }) {
      try {
        const res = await OAUTH_API.getToken(code, oauthState)
        if (res.data) {
          this.loginSuccess({
            accessToken: res.data.access_token,
            refreshToken: res.data.refresh_token,
          })
          const jsonData = JSON.stringify(res.data)
          const encrypted = UTIL.encryptStr(jsonData, this.secret)
          sessionStorage.setItem('auth', encrypted)
          router.push('/')
        } else {
          this.loginFail('服务器返回结果异常')
        }
      } catch (err) {
        this.loginFail(UTIL.getErrorDetailFromResponse(err) || '用户名或密码错误')
        throw err
      }
    },

    // Reset action
    reset() {
      this.login = false
      this.loginErrMsg = null
      this.mfa = null
      this.auth = { accessToken: null, refreshToken: null }

      sessionStorage.clear()
      document.cookie.split(';').forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
      })
      router.push('/logout')
    },

    // Mutation-like methods
    loginSuccess(payload) {
      this.login = true
      this.loginErrMsg = null
      this.mfa = null
      this.auth = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      }
    },

    loginFail(message) {
      this.login = false
      this.loginErrMsg = message
      this.auth = null
    },
  },
  getters: {
    isLoggedIn: (state) => state.login,
    loginError: (state) => state.loginErrMsg,
    mfaId: (state) => state.mfa,
    userPermissions: (state) => {
      const token = state.auth?.accessToken
      if (!token) {
        return []
      }
      const payload = UTIL.parseJwt(token)
      return payload['authorities'] || []
    },
    username: (state) => {
      const token = state.auth?.accessToken
      if (!token) {
        return ''
      }
      const payload = UTIL.parseJwt(token)
      return payload['user_name'] || ''
    },
  },
})
