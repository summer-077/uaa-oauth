<template>
  <div>
    <el-alert
      v-if="userRolesStore.error"
      style="width: 100%"
      title="请求失败"
      :description="userRolesStore.error"
      type="error"
      show-icon
    />

    <el-row :gutter="20" justify="space-between" align="start" style="margin: 0">
      <div style="width: 45%" class="flex flex-col">
        <div class="table-title">未分配角色</div>
        <el-table
          :data="userRolesStore.availableRoles"
          :row-key="(row) => row.id"
          @selection-change="handleAvailableSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="column in columns"
            :key="column.key"
            :prop="column.dataIndex"
            :label="column.title"
          />
        </el-table>
      </div>

      <div class="transfer-buttons jusify-center">
        <el-button @click="moveToAssigned" :icon="ArrowRight" circle />
        <el-button style="margin-left: 0" @click="moveToAvailable" :icon="ArrowLeft" circle />
      </div>
      <div style="width: 45%" class="flex flex-col">
        <div class="table-title">已分配角色</div>
        <el-table
          :data="userRolesStore.assignedRoles"
          :row-key="(row) => row.id"
          @selection-change="handleAssignedSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            v-for="column in columns"
            :key="column.key"
            :prop="column.dataIndex"
            :label="column.title"
          />
        </el-table>
      </div>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserRolesStore } from '@/store/modules/user-roles'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import { userRolesColumns } from '../column-defs/user-roles'

// 使用 Pinia store
const userRolesStore = useUserRolesStore()
const route = useRoute()

// 表格列配置
const columns = userRolesColumns()

// 选中的行
const selectedAvailableRows = ref([])
const selectedAssignedRows = ref([])

// 选择变化处理
const handleAvailableSelectionChange = (rows) => {
  selectedAvailableRows.value = rows.map((row) => row.id)
}

const handleAssignedSelectionChange = (rows) => {
  selectedAssignedRows.value = rows.map((row) => row.id)
}

// 移动角色
const moveToAssigned = () => {
  if (selectedAvailableRows.value.length === 0) return
  userRolesStore.moveToAssigned(selectedAvailableRows.value)
  selectedAvailableRows.value = []
}

const moveToAvailable = () => {
  if (selectedAssignedRows.value.length === 0) return
  userRolesStore.moveToAvailable(selectedAssignedRows.value)
  selectedAssignedRows.value = []
}

// 加载数据
onMounted(() => {
  userRolesStore.load(route.params.username)
})
</script>

<style scoped>
.transfer-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.table-title {
  font-weight: bold;
  font-size: 16px;
}

.el-button {
  padding: 8px 12px;
}
</style>
