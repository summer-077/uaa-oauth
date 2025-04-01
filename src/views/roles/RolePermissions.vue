<template>
  <div>
    <div v-if="rolePermissionsStore.error">
      <el-alert
        style="width: 100%"
        title="请求失败"
        :description="rolePermissionsStore.error"
        type="error"
        show-icon
      />
    </div>
    <el-row :gutter="20" justify="space-between" align="start">
      <div style="width: 45%" class="flex flex-col">
        <span class="table-header">未分配权限</span>
        <el-table
          :row-key="(row) => row.id"
          :data="rolePermissionsStore.availablePermissions"
          @selection-change="handleAvailableSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="col in columns"
            :column-key="col.key"
            :prop="col.dataIndex"
            :label="col.title"
          />
        </el-table>
      </div>

      <div class="transfer-buttons justify-center">
        <el-button @click="moveToAssigned" :icon="ArrowRight" circle />
        <el-button style="margin-left: 0" @click="moveToAvailable" :icon="ArrowLeft" circle />
      </div>
      <div style="width: 45%" class="flex flex-col">
        <div class="table-header">已分配权限</div>

        <el-table
          :row-key="(row) => row.id"
          :data="rolePermissionsStore.assignedPermissions"
          @selection-change="handleAssignedSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="col in columns"
            :column-key="col.key"
            :prop="col.dataIndex"
            :label="col.title"
          />
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRolePermissionsStore } from '@/store/modules/role-permissions'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import { rolePermissionsColumns } from '../column-defs/role-permissions'

const route = useRoute()
const rolePermissionsStore = useRolePermissionsStore()

const columns = rolePermissionsColumns()
const selectedAvailableRows = ref([])
const selectedAssignedRows = ref([])

const handleAvailableSelectionChange = (val) => {
  selectedAvailableRows.value = val
}

const handleAssignedSelectionChange = (val) => {
  selectedAssignedRows.value = val
}

const moveToAssigned = () => {
  if (selectedAvailableRows.value.length === 0) return
  rolePermissionsStore.moveToAssigned(selectedAvailableRows.value.map((item) => item.id))
  selectedAvailableRows.value = []
}

const moveToAvailable = () => {
  if (selectedAssignedRows.value.length === 0) return
  rolePermissionsStore.moveToAvailable(selectedAssignedRows.value.map((item) => item.id))
  selectedAssignedRows.value = []
}

onMounted(() => {
  rolePermissionsStore.load(route.params.roleId)
})
</script>

<style scoped>
.transfer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px;
}

.table-header {
  font-weight: bold;
  font-size: 16px;
  padding: 8px 0;
}
</style>
