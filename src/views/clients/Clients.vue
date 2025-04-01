<template>
  <div class="client-container">
    <el-alert v-if="error" type="error" title="请求失败" :description="error" show-icon />

    <div class="client-actions">
      <el-button type="primary" @click="showAdd" v-if="hasAddClientPermission">
        添加客户端
      </el-button>
    </div>

    <div class="client-grid">
      <el-card
        v-for="client in clients"
        :key="client.client_id"
        class="client-card"
        @click="viewDetails(client.client_id)"
        shadow="hover"
      >
        <div class="client-header">
          <h3>{{ client.client_id }}</h3>
          <div class="flex flex-row justify-center">
            <el-button
              type="primary"
              icon="Edit"
              size="small"
              @click.stop="showEdit(client)"
              :disabled="!hasUpdateClientPermission"
            />
            <el-popconfirm title="确认删除客户端？" @confirm.stop="deleteById(client.client_id)">
              <template #reference>
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  :disabled="!hasUpdateClientPermission"
                  @click.stop
                />
              </template>
            </el-popconfirm>
          </div>
        </div>

        <div class="client-content">
          <div class="client-field">
            <span class="field-label">授权类型:</span>
            <div class="field-value">
              <el-tag v-for="type in client.authorized_grant_types" :key="type" size="small">
                {{ type }}
              </el-tag>
            </div>
          </div>

          <div class="client-field">
            <span class="field-label">作用域:</span>
            <div class="field-value">
              <el-tag v-for="scope in client.scope" :key="scope" type="success" size="small">
                {{ scope }}
              </el-tag>
            </div>
          </div>

          <div class="client-field" v-if="client.redirect_uri.length">
            <span class="field-label">回调地址:</span>
            <div class="field-value">
              <div
                style="font-weight: 500; font-size: 14px"
                v-for="uri in client.redirect_uri"
                :key="uri"
                type="info"
                size="small"
              >
                {{ uri }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 添加客户端对话框 -->
    <AddClientDialog
      v-model:show="showAddDialog"
      :record="addModel"
      @closed="showAddDialog = false"
    />
    <!-- 修改客户端对话框 -->
    <EditClientDialog
      v-model:show="showEditDialog"
      :record="editModel"
      @closed="showEditDialog = false"
    />
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '@/store/modules/clients.js'
import { Plus } from '@element-plus/icons-vue'
import AddClientDialog from './components/AddClientDialog.vue'
import EditClientDialog from './components/EditClientDialog.vue'
import UTIL from '@/core/util'

const router = useRouter()
const clientsStore = useClientsStore()
const { clients, error, loading } = clientsStore

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addModel = ref({
  clientId: '',
  clientSecret: '',
  scopes: [],
  grantTypes: [],
  redirectUris: [],
  autoApproves: [],
  accessTokenValidity: '',
  refreshTokenValidity: '',
})
const editModel = ref({ ...addModel.value })

const hasAddClientPermission = computed(() => UTIL.hasPermissionIn(['CLIENT_ADD']))
const hasUpdateClientPermission = computed(() => UTIL.hasPermissionIn(['CLIENT_UPDATE']))

const showAdd = () => {
  showAddDialog.value = true
}

const showEdit = (record) => {
  showEditDialog.value = true
  editModel.value = {
    clientId: record.client_id,
    clientSecret: record.client_secret.replace(/{\w+}/, ''),
    scopes: record.scope,
    grantTypes: record.authorized_grant_types,
    redirectUris: record.redirect_uri,
    autoApproves: record.autoapprove,
    accessTokenValidity: record.access_token_validity,
    refreshTokenValidity: record.refresh_token_validity,
  }
}

const deleteById = (id) => {
  clientsStore.delete(id)
}

const viewDetails = (clientId) => {
  router.push(`/clients/${clientId}`)
}

// const getScopeColor = (record, scope) => {
//   if (!record.autoapprove) return 'warning'
//   return record.autoapprove.includes(scope) ? 'success' : 'danger'
// }

onMounted(() => {
  clientsStore.load()
})
</script>

<style scoped>
.client-container {
  padding: 20px;
}

.client-actions {
  margin-bottom: 20px;
}

.client-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.client-card {
  cursor: pointer;
  transition: transform 0.2s;
  padding-top: 10px;
  padding-bottom: 10px;
}

.client-card:hover {
  transform: translateY(-5px);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.client-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--el-text-color-primary);
}

.client-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.client-field {
  display: flex;
  gap: 8px;
}

.field-label {
  font-weight: 500;
  color: var(--el-text-color-secondary);
  min-width: 80px;
}

.field-value {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.el-card {
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
</style>
