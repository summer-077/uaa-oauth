import { defineStore } from 'pinia'
import ADMIN_API from '@/services/admin.service'
import UTIL from '@/core/util'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [],
    loading: false,
    error: null,
    addError: null,
    updateError: null,
  }),
  actions: {
    async load() {
      this.loading = true
      this.error = null
      try {
        const res = await ADMIN_API.loadClients()
        if (res && res.data) {
          this.clients = res.data
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '获取客户端列表失败'
      } finally {
        this.loading = false
      }
    },
    async add(payload) {
      this.loading = true
      this.addError = null
      try {
        const res = await ADMIN_API.addClient(payload)
        if (res && res.data) {
          this.clients.unshift(res.data)
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.addError = UTIL.getErrorDetailFromResponse(err) || '添加客户端失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async update(payload) {
      this.loading = true
      this.updateError = null
      try {
        const res = await ADMIN_API.updateClient(payload)
        if (res && res.data) {
          const idx = this.clients.findIndex((client) => client.client_id === res.data.client_id)
          if (idx !== -1) {
            this.clients.splice(idx, 1, res.data)
          }
          return Promise.resolve(res.data)
        }
      } catch (err) {
        this.updateError = UTIL.getErrorDetailFromResponse(err) || '更改客户端信息失败'
        return Promise.reject(err)
      } finally {
        this.loading = false
      }
    },
    async delete(clientId) {
      this.loading = true
      this.error = null
      try {
        await ADMIN_API.deleteClient(clientId)
        const idx = this.clients.findIndex((client) => client.client_id === clientId)
        if (idx !== -1) {
          this.clients.splice(idx, 1)
        }
      } catch (err) {
        this.error = UTIL.getErrorDetailFromResponse(err) || '删除客户端信息失败'
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    clientById: (state) => {
      return (clientId) => {
        const filtered = state.clients.filter((client) => `${client.client_id}` === clientId)
        return filtered.length > 0 ? filtered[0] : null
      }
    },
  },
})
