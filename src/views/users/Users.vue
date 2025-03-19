<template>
  <div>
    <!-- 错误提示 -->
    <el-alert v-if="error" type="error" title="请求失败" :description="error" show-icon />

    <!-- 用户详情 -->
    <div v-if="selectedUser">
      <el-page-header :title="selectedUser.name" :content="selectedUser.username" @back="goBack">
        <template #extra>
          <el-button type="primary" @click="saveUserRoles">保存</el-button>
        </template>
        <template #title>
          <el-tag :type="selectedUser.enabled ? 'success' : 'danger'">
            {{ selectedUser.enabled ? '激活' : '禁用' }}
          </el-tag>
        </template>
      </el-page-header>

      <el-descriptions border :column="2">
        <el-descriptions-item label="电子邮件">{{ selectedUser.email }}</el-descriptions-item>
        <el-descriptions-item label="手机">
          <el-link type="primary">{{ selectedUser.mobile }}</el-link>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 用户表格 -->
    <div v-else>
      <el-button type="primary" @click="showAddUserDialog" v-if="hasAddUserPermission"
        >添加用户</el-button
      >

      <el-table
        :data="users"
        :row-key="(item) => item.id"
        border
        style="width: 100%"
        :loading="loading"
        @sort-change="handleTableChange"
      >
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="email" label="电子邮件" />
        <el-table-column prop="roles" label="角色">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role.id"
              :type="
                role.roleName === 'ROLE_ADMIN'
                  ? 'danger'
                  : role.roleName === 'ROLE_STAFF'
                    ? 'info'
                    : 'success'
              "
            >
              {{ role.displayName.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template #default="{ row }">
            <el-icon :size="24" :color="row.enabled ? '#52c41a' : '#eb2f96'">
              <Check v-if="row.enabled" />
              <Close v-else />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              icon="Edit"
              @click="editUser(row)"
              :disabled="!hasUpdateUserPermission"
            />
            <el-popconfirm title="确认切换用户状态？" @confirm="toggleUserEnabled(row.username)">
              <template #reference>
                <el-button
                  :type="row.enabled ? 'danger' : 'success'"
                  :icon="row.enabled ? 'Close' : 'Check'"
                  :disabled="!hasUpdateUserPermission || isSelf(row.username)"
                />
              </template>
            </el-popconfirm>
            <el-button type="info" icon="UserFilled" @click="navToUserRoles(row.username)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户对话框 -->
      <AddUserDialog v-model="showAddDialog" :record="addModel" @closed="showAddDialog = false" />
      <!-- 修改用户对话框 -->
      <EditUserDialog
        v-model="showEditDialog"
        :record="editModel"
        @closed="showEditDialog = false"
      />
    </div>

    <router-view />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '@/store/modules/users.js'
import AddUserDialog from './components/AddUserDialog.vue'
import EditUserDialog from './components/EditUserDialog.vue'
import { Check, Close, UserFilled, Edit } from '@element-plus/icons-vue'
import UTIL from '@/core/util'
// Router
const route = useRoute()
const router = useRouter()

// Pinia Store
const usersStore = useUsersStore()
const { users, error, loading, total } = storeToRefs(usersStore) // 响应式解构

// 状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addModel = ref({ username: '', name: '', email: '', mobile: '' })
const editModel = ref({ name: '', email: '', mobile: '' })

// 计算属性
const selectedUser = computed(() => usersStore.userByUsername(route.params.username))
const hasAddUserPermission = computed(() => UTIL.hasPermissionIn(['USER_ADD']))
const hasUpdateUserPermission = computed(() => UTIL.hasPermissionIn(['USER_UPDATE']))

// 方法
const showAddUserDialog = () => {
  addModel.value = { username: '', name: '', email: '', mobile: '' }
  showAddDialog.value = true
}

const editUser = (user) => {
  editModel.value = { ...user }
  showEditDialog.value = true
}

const toggleUserEnabled = (username) => {
  usersStore.toggleEnabled(username)
}

const navToUserRoles = (username) => {
  router.push({ path: `/users/${username}` })
}

const saveUserRoles = () => {
  if (!selectedUser.value) return
  usersStore.saveUserRoles(selectedUser.value.username)
}

const goBack = () => {
  router.go(-1)
}

const isSelf = (username) => usersStore.username === username

const handleTableChange = (pagination, filters, sorter) => {
  usersStore.load({
    size: pagination.pageSize,
    page: pagination.current - 1,
    offset: (pagination.current - 1) * pagination.pageSize,
    sort: { field: sorter.prop, order: sorter.order },
    filters: { ...filters },
  })
}

// 页面加载时获取数据
onMounted(() => {
  usersStore.load({ size: 10, page: 0, offset: 0 })
})
</script>
