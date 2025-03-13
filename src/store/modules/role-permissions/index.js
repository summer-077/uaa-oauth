import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'
import router from '@/router'
import { union, difference } from 'lodash'

export const useRolePermissionsStore = defineStore('rolePermissions', {
  state: () => ({
    assignedPermissions: [],
    loading: false,
    error: null,
    availablePermissions: [],
  }),
  actions: {
    async loadAvailable(roleId) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.loadAvailablePermissions(roleId)
        if (res && res.data) {
          this.availablePermissions = res.data
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '加载可用权限列表失败'
      } finally {
        this.loading = false
      }
    },
    async load(roleId) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.loadByRoleId(roleId)
        if (res && res.data) {
          this.assignedPermissions = res.data.permissions
          await this.loadAvailable(roleId)
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '加载角色失败'
      } finally {
        this.loading = false
      }
    },
    moveToAssigned(payload) {
      const selectedRoles = this.availablePermissions.filter((role) => payload.includes(role.id))
      this.assignedPermissions = union(this.assignedPermissions, selectedRoles)
      this.availablePermissions = difference(this.availablePermissions, selectedRoles)
    },
    moveToAvailable(payload) {
      const selectedRoles = this.assignedPermissions.filter((role) => payload.includes(role.id))
      this.availablePermissions = union(this.availablePermissions, selectedRoles)
      this.assignedPermissions = difference(this.assignedPermissions, selectedRoles)
    },
    async save(roleId) {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.saveRolePermissions(
          roleId,
          this.assignedPermissions.map((permission) => permission.id),
        )
        if (res && res.data) {
          // 假设 rolesModule 是另一个 Pinia store
          const rolesModule = useRolesStore()
          rolesModule.updateSuccess(res.data)
          router.push('/roles')
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '保存角色权限列表失败'
      } finally {
        this.loading = false
      }
    },
  },
})
