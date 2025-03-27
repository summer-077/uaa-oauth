import { defineStore } from 'pinia'
import OAUTH_API from '../services/oauth.service'
import AUTH_API from '../services/auth.service'
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
    //授权码颁发的code，路径中的code参数
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
    async sendMfa(mfaType, number) {
      try {
        const response = await AUTH_API.sendMfa(mfaType, number)
        const elements = response.headers['x-authenticate'].split(', ')
        const MFA_PREFIX = 'realm='
        if (elements.length === 2 && elements[0] === 'mfa' && elements[1].startsWith(MFA_PREFIX)) {
          this.mfa = elements[1].replace(MFA_PREFIX, '')
          this.loginErrMsg = null
        }
      } catch (err) {
        this.loginErrMsg = UTIL.getErrorDetailFromResponse(err) || '发送验证码错误'
      }
    },

    async verifyMfa(code) {
      try {
        const res = await AUTH_API.verifyMfa(this.mfa, code)
        if (res.data) {
          this.loginSuccess({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          })
          router.push('/')
          return res.data.redirectUrl
        }
        this.loginFail('服务器返回结果异常')
        router.push('/login')
      } catch (err) {
        this.loginFail(UTIL.getErrorDetailFromResponse(err.response?.data) || '验证码不正确或过期')
        router.push('/login')
      }
    },

    // Reset action
    reset() {
      this.isLogin = false
      this.loginErrMsg = null
      this.mfa = null
      this.auth = { accessToken: null, refreshToken: null }

      sessionStorage.clear()
      localStorage.clear()

      document.cookie.split(';').forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/')
      })
      router.push('/logout')
    },

    // Mutation-like methods
    loginSuccess(payload) {
      this.isLogin = true
      this.loginErrMsg = null
      this.mfa = null
      this.auth = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      }
    },

    loginFail(message) {
      this.isLogin = false
      this.loginErrMsg = message
      this.auth = null
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLogin,
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
