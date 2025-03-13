// src/store/modules/users/index.js
import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'
import { useUserRolesStore } from './user-roles'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    page: 0,
    offset: 0,
    total: 0,
    sort: null,
    filters: null,
    error: null,
    addError: null,
    updateError: null,
    selectedId: null,
  }),
  actions: {
    async toggleEnabled(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.toggleEnabled(payload)
        if (res && res.data) {
          const idx = this.users.findIndex((user) => user.id === res.data.id)
          if (idx !== -1) {
            this.users.splice(idx, 1, res.data)
          }
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '切换用户状态失败'
      } finally {
        this.loading = false
      }
    },
    async add(payload) {
      this.loading = true
      this.addError = null
      try {
        const res = await ADMIN_API.addUser(payload)
        if (res && res.data) {
          this.users.unshift(res.data)
          this.total += 1
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.addError = UTIL.getErrorDetailFromResponse(err) || '添加用户失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async update(payload) {
      this.loading = true
      this.updateError = null
      try {
        const res = await ADMIN_API.updateUser(payload)
        if (res && res.data) {
          const idx = this.users.findIndex((user) => user.id === res.data.id)
          if (idx !== -1) {
            this.users.splice(idx, 1, res.data)
          }
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.updateError = UTIL.getErrorDetailFromResponse(err) || '更改用户信息失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async load({ size, page, offset, sort, filters }) {
      this.loading = true
      this.error = null
      try {
        const sortParam =
          sort && sort.order
            ? `${sort.field},${sort.order === 'ascend' ? 'asc' : 'desc'}`
            : `id,desc`
        const filterParam = filters
          ? Object.keys(filters).reduce(
              (acc, curr) => ({ ...acc, [curr]: filters[curr].join(',') }),
              {},
            )
          : null
        const res = await ADMIN_API.loadUsers(size, page, offset, sortParam, filterParam)

        if (res && res.data) {
          // 确保 `res.data.content` 是数组
          this.users = Array.isArray(res.data.content) ? res.data.content : []
          this.page = res.data.pageable.pageNumber
          this.offset = res.data.pageable.offset
          this.sort = sort
          this.filters = filters
          this.total = res.data.totalElements
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '获取用户列表失败'
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    userByUsername: (state) => {
      return (username) => {
        const filtered = state.users.filter((user) => user.username === username)
        return filtered.length > 0 ? filtered[0] : null
      }
    },
  },
  modules: {
    userRoles: useUserRolesStore(),
  },
})
