<template>
  <el-dialog v-model="visible" title="添加客户端" @close="handleCancel">
    <div v-if="clientsStore.addError">
      <el-alert
        style="width: 100%"
        title="添加客户端失败"
        :description="clientsStore.addError"
        type="error"
        show-icon
      />
    </div>
    <el-form
      ref="form"
      label-width="150px"
      :model="model"
      :rules="rules"
      :label-position="labelPosition"
    >
      <el-form-item prop="clientId" label="客户端 Id">
        <el-input v-model="model.clientId" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="clientSecret" label="客户端 Secret">
        <el-input v-model="model.clientSecret" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="" label="授权范围">
        <el-select v-model="model.scopes" multiple style="width: 100%" placeholder="请选择授权范围">
          <el-option value="user.admin" label="用户管理" />
          <el-option value="client.admin" label="客户端管理" />
          <el-option value="todo.read" label="读取待办事项" />
          <el-option value="todo.write" label="写入待办事项" />
        </el-select>
      </el-form-item>
      <el-form-item prop="grantTypes" label="授权类型">
        <el-select
          v-model="model.grantTypes"
          multiple
          style="width: 100%"
          placeholder="请选择授权类型"
        >
          <el-option value="authorization_code" label="授权码" />
          <el-option value="refresh_token" label="刷新令牌" />
          <el-option value="password" label="资源所有者密码" />
          <el-option value="client_credentials" label="客户端密钥" />
        </el-select>
      </el-form-item>
      <el-form-item prop="redirectUris" label="重定向 URI">
        <el-input v-model="model.redirectUris" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="autoApproves" label="自动授权">
        <el-select
          v-model="model.autoApproves"
          multiple
          style="width: 100%"
          placeholder="请选择授权范围"
        >
          <el-option value="user.admin" label="用户管理" />
          <el-option value="client.admin" label="客户端管理" />
          <el-option value="todo.read" label="读取待办事项" />
          <el-option value="todo.write" label="写入待办事项" />
        </el-select>
      </el-form-item>
      <el-form-item prop="accessTokenValidity" label="访问令牌有效期">
        <el-input-number v-model="model.accessTokenValidity" :min="60" :max="2592000" />
      </el-form-item>
      <el-form-item prop="refreshTokenValidity" label="刷新令牌有效期">
        <el-input-number v-model="model.refreshTokenValidity" :min="900" :max="31536000" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">返回</el-button>
      <el-button type="primary" :loading="clientsStore.loading" @click="handleOk">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useClientsStore } from '@/store/modules/clients'
import { addClientRules } from '@/views/form-rules/add-client'
import { ElMessage } from 'element-plus'
const props = defineProps({
  show: Boolean,
  record: Object,
})

const emit = defineEmits(['closed', 'submitted'])

const clientsStore = useClientsStore()
const form = ref(null)
const labelPosition = ref('right')

const rules = addClientRules()

const visible = computed({
  get: () => props.show,
  set: (value) => emit('closed', value),
})

const model = computed({
  get: () => props.record,
  set: (value) => emit('update:record', value),
})

const handleOk = async () => {
  try {
    const valid = await form.value.validate()
    if (valid) {
      emit('submitted', model.value)
      const client = {
        ...model.value,
      }
      const res = await clientsStore.add(client)
      if (res) {
        form.value.resetFields()
        visible.value = false
        ElMessage.success('客户端信息添加成功')
        clientsStore.load()
      }
    }
  } catch (error) {
    ElMessage.error('更新失败: ' + (err.message || err))
    console.error('Validation failed:', error)
  }
}

const handleCancel = () => {
  visible.value = false
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
