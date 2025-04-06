<template>
  <div class="permissions">
    <el-alert
      v-if="error"
      style="width: 100%"
      title="请求失败"
      :description="error"
      type="error"
      show-icon
    />

    <el-table :data="data" :row-key="(row) => row.id" style="width: 100%">
      <el-table-column prop="id" label="Id" width="180" />
      <el-table-column prop="authority" label="代码" />
      <el-table-column prop="displayName" label="名称" />
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRolePermissionsStore } from '@/store/modules/role-permissions'
import { ElAlert, ElTable, ElTableColumn } from 'element-plus'
import UTIL from '@/core/util'
import ADMIN_API from '@/services/admin.service.js'

// 定义响应式数据
const data = ref([])
const error = ref(null)

// 使用 Pinia store
const permissionStore = useRolePermissionsStore()

// 表格列配置
const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '代码',
    dataIndex: 'authority',
    key: 'authority',
  },
  {
    title: '名称',
    dataIndex: 'displayName',
    key: 'displayName',
  },
]

// 加载权限数据
const loadPermissions = async () => {
  try {
    const res = await ADMIN_API.loadPermissions()
    data.value = res.data
  } catch (err) {
    error.value = UTIL.getErrorDetailFromResponse(err) || '加载权限列表错误'
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadPermissions()
})
</script>
<style>
.permissions {
  padding: 20px;
}
</style>
