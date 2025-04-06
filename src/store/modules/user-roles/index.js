import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'
import router from '@/router'
import { union, difference } from 'lodash'
import { useUsersStore } from '@/store/modules/users.js'
export const useUserRolesStore = defineStore('userRoles', {
  state: () => ({
    assignedRoles: [],
    loading: false,
    error: null,
    availableRoles: [],
  }),
  actions: {
    async loadAvailable(username) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.loadAvailableRoles(username)
        if (res && res.data) {
          this.availableRoles = res.data
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '加载可用角色列表失败'
      } finally {
        this.loading = false
      }
    },
    async load(username) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.loadByUsername(username)
        if (res && res.data) {
          this.assignedRoles = res.data.roles
          await this.loadAvailable(username)
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '加载用户失败'
      } finally {
        this.loading = false
      }
    },
    moveToAssigned(payload) {
      const selectedRoles = this.availableRoles.filter((role) => payload.includes(role.id))
      this.assignedRoles = union(this.assignedRoles, selectedRoles)
      this.availableRoles = difference(this.availableRoles, selectedRoles)
    },
    moveToAvailable(payload) {
      const selectedRoles = this.assignedRoles.filter((role) => payload.includes(role.id))
      this.availableRoles = union(this.availableRoles, selectedRoles)
      this.assignedRoles = difference(this.assignedRoles, selectedRoles)
    },
    async save(username) {
      this.loading = true
      this.error = null
      try {
        debugger
        const res = await ADMIN_API.saveUserRoles(
          username,
          this.assignedRoles.map((role) => role.id),
        )
        if (res && res.data) {
          // 假设 usersModule 是另一个 Pinia store
          const usersModule = useUsersStore()
          usersModule.updateSuccess(res.data)
          router.push('/users')
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '保存用户角色列表失败'
      } finally {
        this.loading = false
      }
    },
  },
})
