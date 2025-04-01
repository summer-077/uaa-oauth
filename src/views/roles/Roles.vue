<template>
  <div class="roles">
    <el-alert
      v-if="rolesStore.error"
      type="error"
      :title="'请求失败'"
      :description="rolesStore.error"
      show-icon
    />

    <div class="role-header" v-if="selectedRole">
      <el-page-header title="分配权限" :content="selectedRole.displayName" @back="$router.go(-1)">
        <template #extra>
          <el-button type="primary" @click="saveRolePermissions">保存</el-button>
        </template>
      </el-page-header>
    </div>
    <div v-else>
      <el-button type="primary" @click="showAdd" v-if="hasAddRolePermission">添加角色</el-button>
      <el-table :data="rolesStore.roles" style="width: 100%" border>
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="displayName" label="显示名称" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="showEdit(row)"
              :disabled="!hasUpdateRolePermission || row.builtIn"
              >编辑</el-button
            >
            <el-popconfirm title="确认删除角色？" @confirm="deleteById(row.id)">
              <template #reference>
                <el-button type="danger" link :disabled="!hasUpdateRolePermission || row.builtIn"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-button
              type="warning"
              link
              @click="navToRolePermissions(row.id)"
              :disabled="!hasUpdateRolePermission"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <AddRoleDialog
        v-bind:show="showAddDialog"
        v-bind:record="addModel"
        v-on:closed="showAddDialog = false"
      />
      <!-- 修改角色对话框 -->
      <EditRoleDialog
        v-bind:show="showEditDialog"
        v-bind:record="editModel"
        v-on:closed="showEditDialog = false"
      />
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRolesStore } from '@/store/modules/roles'
import { useRouter, useRoute } from 'vue-router'
import UTIL from '@/core/util'
import { rolesColumns } from '../column-defs/roles'
import EditRoleDialog from './components/EditRoleDialog'
import AddRoleDialog from './components/AddRoleDialog'
import TableFilter from '@/components/TableFilter'
import { useRolePermissionsStore } from '@/store/modules/role-permissions'
const rolesStore = useRolesStore()
const router = useRouter()
const route = useRoute()

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editModel = ref({ roleName: '', displayName: '' })
const addModel = ref({ roleName: '', displayName: '' })

const selectedRole = computed(() => rolesStore.roleById(route.params.roleId))
const hasAddRolePermission = computed(() => UTIL.hasPermissionIn(['RL_ADD']))
const hasUpdateRolePermission = computed(() => UTIL.hasPermissionIn(['RL_UPDATE']))

const showAdd = () => (showAddDialog.value = true)
const showEdit = (record) => {
  showEditDialog.value = true
  editModel.value = { ...record }
}
const deleteById = (id) => rolesStore.delete(id)

const navToRolePermissions = (roleId) => {
  router.push({ path: `/roles/${roleId}` })
}

const rolesPremissionStore = useRolePermissionsStore()
const saveRolePermissions = () => {
  debugger
  console.log('saveRolePermissions', selectedRole.value)
  if (!selectedRole.value) return
  rolesPremissionStore.save(selectedRole.value.id)
}

onMounted(() => {
  rolesStore.load({ size: 10, page: 0 })
})
</script>

<style scoped lang="less">
.roles {
  padding: 20px;
}
.el-table {
  margin-top: var(--margin-bottom);
}
.role-header {
  margin-bottom: var(--margin-bottom);
}
</style>
