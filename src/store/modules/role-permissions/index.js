// stores/rolePermissions.js
import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'
import router from '@/router'
import { union, difference } from 'lodash'
import { useRolesStore } from '@/store/modules/roles'
export const useRolePermissionsStore = defineStore('rolePermissions', {
  state: () => ({
    assignedPermissions: [],
    loading: false,
    error: null,
    availablePermissions: [],
  }),
  actions: {
    async load(roleId) {
      this.loading = true
      try {
        const res = await ADMIN_API.loadByRoleId(roleId)
        if (res?.data) {
          this.assignedPermissions = res.data.permissions
          this.error = null

          // Load available permissions
          try {
            const availableRes = await ADMIN_API.loadAvailablePermissions(roleId)
            if (availableRes?.data) {
              this.availablePermissions = availableRes.data
            }
          } catch (err) {
            this.error = UTIL.getErrorDetailFromResponse(err) || '加载可用权限列表失败'
            this.availablePermissions = []
          }
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '加载角色失败'
        this.assignedPermissions = []
      } finally {
        this.loading = false
      }
    },

    moveToAssigned(ids) {
      const selectedRoles = this.availablePermissions.filter((role) => ids.includes(role.id))
      this.assignedPermissions = union(this.assignedPermissions, selectedRoles)
      this.availablePermissions = difference(this.availablePermissions, selectedRoles)
    },

    moveToAvailable(ids) {
      const selectedRoles = this.assignedPermissions.filter((role) => ids.includes(role.id))
      this.availablePermissions = union(this.availablePermissions, selectedRoles)
      this.assignedPermissions = difference(this.assignedPermissions, selectedRoles)
    },

    async save(roleId) {
      this.loading = true
      try {
        const res = await ADMIN_API.saveRolePermissions(
          roleId,
          this.assignedPermissions.map((p) => p.id),
        )

        if (res?.data) {
          // 假设有一个 roles store 需要更新
          const rolesStore = useRolesStore()
          rolesStore.updateSuccess(res.data)
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
