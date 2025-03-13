// src/store/modules/roles/index.js
import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'
import { useRolePermissionsStore } from './role-permissions'

export const useRolesStore = defineStore('roles', {
  state: () => ({
    roles: [],
    loading: false,
    page: 0,
    offset: 0,
    total: 0,
    sort: null,
    filters: null,
    error: null,
    addError: null,
    updateError: null,
  }),
  actions: {
    async add(payload) {
      this.loading = true
      this.addError = null
      try {
        const res = await ADMIN_API.addRole(payload)
        if (res && res.data) {
          this.roles.unshift(res.data)
          this.total += 1
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.addError = UTIL.getErrorDetailFromResponse(err) || '添加角色失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async update(payload) {
      this.loading = true
      this.updateError = null
      try {
        const res = await ADMIN_API.updateRole(payload)
        if (res && res.data) {
          const idx = this.roles.findIndex((role) => role.id === res.data.id)
          if (idx !== -1) {
            this.roles.splice(idx, 1, res.data)
          }
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.updateError = UTIL.getErrorDetailFromResponse(err) || '更改角色信息失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async delete(roleId) {
      this.loading = true
      this.error = null
      try {
        await ADMIN_API.deleteRole(roleId)
        const idx = this.roles.findIndex((role) => role.id === roleId)
        if (idx !== -1) {
          this.roles.splice(idx, 1)
          this.total -= 1
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '删除角色信息失败'
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
        const res = await ADMIN_API.loadRoles(size, page, offset, sortParam, filterParam)
        if (res && res.data) {
          this.roles = res.data.content
          this.page = res.data.pageable.pageNumber
          this.offset = res.data.pageable.offset
          this.sort = sort
          this.filters = filters
          this.total = res.data.totalElements
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '获取角色列表失败'
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    roleById: (state) => {
      return (roleId) => {
        const filtered = state.roles.filter((role) => `${role.id}` === roleId)
        return filtered.length > 0 ? filtered[0] : null
      }
    },
  },
})
