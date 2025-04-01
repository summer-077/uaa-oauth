<template>
  <div class="users">
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
      <div class="table-actions">
        <el-input
          v-model="searchQuery"
          placeholder="请输入用户名或邮箱搜索"
          clearable
          prefix-icon="Search"
          @input="filterUsers"
          style="width: 300px; margin-bottom: 20px"
        />
        <el-button type="primary" @click="showAddUserDialog" v-if="hasAddUserPermission">
          添加用户
        </el-button>
      </div>

      <el-table :data="filteredUsers" border style="width: 100%" :loading="loading">
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
              style="margin: 5px"
            >
              {{ role.displayName.toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column width="100" label="状态">
          <template #default="{ row }">
            <el-icon :size="24" :color="row.enabled ? '#52c41a' : '#eb2f96'">
              <Check v-if="row.enabled" />
              <Close v-else />
            </el-icon>
          </template>
        </el-table-column>

        <el-table-column width="300" label="操作">
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              @click="editUser(row)"
              :disabled="!hasUpdateUserPermission"
            >
              编辑
            </el-button>
            <el-popconfirm title="确认切换用户状态？" @confirm="toggleUserEnabled(row.username)">
              <template #reference>
                <el-button
                  text
                  :type="row.enabled ? 'danger' : 'success'"
                  :disabled="!hasUpdateUserPermission || isSelf(row.username)"
                >
                  {{ row.enabled ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-button text type="warning" @click="navToUserRoles(row.username)">
              分配角色
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
        style="float: right; margin: 20px"
      />

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
import { Check, Close } from '@element-plus/icons-vue'
import UTIL from '@/core/util'

// Router
const route = useRoute()
const router = useRouter()

// Pinia Store
const usersStore = useUsersStore()
const { users, error, loading, total } = storeToRefs(usersStore)

// 状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addModel = ref({ username: '', name: '', email: '', mobile: '' })
const editModel = ref({ name: '', email: '', mobile: '' })
const searchQuery = ref('')

// 分页状态
const pagination = ref({
  pageSize: 10,
  currentPage: 1,
})

// 计算属性
const selectedUser = computed(() => usersStore.userByUsername(route.params.username))
const hasAddUserPermission = computed(() => UTIL.hasPermissionIn(['USER_ADD']))
const hasUpdateUserPermission = computed(() => UTIL.hasPermissionIn(['USER_UPDATE']))

// 过滤用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(
    (user) => user.name.includes(searchQuery.value) || user.email.includes(searchQuery.value),
  )
})

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

const handlePageChange = (page) => {
  pagination.value.currentPage = page
  loadUsers()
}

const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
  loadUsers()
}

const loadUsers = () => {
  usersStore.load({
    size: pagination.value.pageSize,
    page: pagination.value.currentPage - 1,
    offset: (pagination.value.currentPage - 1) * pagination.value.pageSize,
  })
}

// 页面加载时获取数据
onMounted(() => {
  loadUsers()
})
</script>

<style lang="less" scoped>
.users {
  padding: 20px;
  margin-bottom: 20px;
}

.table-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
