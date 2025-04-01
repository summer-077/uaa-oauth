// src/store/modules/roles/index.js
import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'

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
    // ======= 这些方法原本是 Vuex 里的 mutations，现在作为 Pinia 内部方法 =======
    loadSuccess(payload) {
      this.roles = payload.roles
      this.filters = payload.filters
      this.page = payload.page
      this.offset = payload.offset
      this.sort = payload.sort
      this.total = payload.total
      this.error = null
      this.loading = false
    },

    loadFail(error) {
      this.error = error
      this.loading = false
    },

    startLoad() {
      this.loading = true
    },

    addSuccess(payload) {
      this.roles.unshift(payload)
      this.total += 1
      this.addError = null
      this.loading = false
    },

    addFail(error) {
      this.addError = error
      this.loading = false
    },

    updateSuccess(payload) {
      const idx = this.roles.findIndex((role) => role.id === payload.id)
      if (idx !== -1) {
        this.roles.splice(idx, 1, payload)
      }
      this.updateError = null
      this.loading = false
    },

    updateFail(error) {
      this.updateError = error
      this.loading = false
    },

    deleteSuccess(payload) {
      const idx = this.roles.findIndex((role) => role.id === payload)
      if (idx !== -1) {
        this.roles.splice(idx, 1)
        this.total -= 1
      }
      this.error = null
      this.loading = false
    },

    deleteFail(error) {
      this.error = error
      this.loading = false
    },

    async add(payload) {
      this.startLoad()
      try {
        const res = await ADMIN_API.addRole(payload)
        if (res && res.data) {
          this.addSuccess(res.data)
          return res.data
        }
      } catch (err) {
        this.addFail(UTIL.getErrorDetailFromResponse(err) || '添加角色失败')
        throw err
      }
    },

    async update(payload) {
      this.startLoad()
      try {
        const res = await ADMIN_API.updateRole(payload)
        if (res && res.data) {
          this.updateSuccess(res.data)
          return res.data
        }
      } catch (err) {
        this.updateFail(UTIL.getErrorDetailFromResponse(err) || '更改角色信息失败')
        throw err
      }
    },

    async delete(payload) {
      this.startLoad()
      try {
        await ADMIN_API.deleteRole(payload)
        this.deleteSuccess(payload)
      } catch (err) {
        this.deleteFail(UTIL.getErrorDetailFromResponse(err) || '删除角色信息失败')
        throw err
      }
    },

    async load({ size, page, offset, sort, filters }) {
      this.startLoad()
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
          this.loadSuccess({
            roles: res.data.content,
            page: res.data.pageable.pageNumber,
            offset: res.data.pageable.offset,
            sort,
            filters,
            total: res.data.totalElements,
          })
        }
      } catch (err) {
        this.loadFail(UTIL.getErrorDetailFromResponse(err) || '获取角色列表失败')
      }
    },
  },

  getters: {
    roleById: (state) => (roleId) => {
      return state.roles.find((role) => `${role.id}` === roleId) || null
    },
  },
})
