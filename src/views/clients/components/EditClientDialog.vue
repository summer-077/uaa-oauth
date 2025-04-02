<template>
  <el-dialog v-model="visible" title="修改客户端" @close="handleCancel">
    <el-alert v-if="error" type="error" title="修改客户端失败" :description="error" show-icon />
    <el-form ref="form" :model="model" label-width="120px" :rules="rules">
      <el-form-item label="客户端 ID" prop="clientId">
        <el-input v-model="model.clientId" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="客户端密钥" prop="clientSecret">
        <el-input v-model="model.clientSecret" disabled autocomplete="off" />
      </el-form-item>
      <el-form-item label="授权范围" prop="scopes">
        <el-select v-model="model.scopes" multiple placeholder="请选择授权范围">
          <el-option label="用户管理" value="user.admin" />
          <el-option label="客户端管理" value="client.admin" />
          <el-option label="读取待办事项" value="todo.read" />
          <el-option label="写入待办事项" value="todo.write" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="授权类型"
        prop="grantTypes
"
      >
        <el-select v-model="model.grantTypes" multiple placeholder="请选择授权类型">
          <el-option label="授权码" value="authorization_code" />
          <el-option label="刷新令牌" value="refresh_token" />
          <el-option label="密码" value="password" />
          <el-option label="客户端密钥" value="client_credentials" />
        </el-select>
      </el-form-item>
      <el-form-item label="重定向 URI" prop="redirectUris">
        <el-input v-model="model.redirectUris" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="自动授权" prop="autoApproves">
        <el-select v-model="model.autoApproves" multiple placeholder="请选择授权范围">
          <el-option label="用户管理" value="user.admin" />
          <el-option label="客户端管理" value="client.admin" />
          <el-option label="读取待办事项" value="todo.read" />
          <el-option label="写入待办事项" value="todo.write" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="访问令牌有效期" prop="accessTokenValidity">
        <el-input-number v-model="model.accessTokenValidity" :min="60" :max="2592000" />
      </el-form-item>
      <el-form-item label="刷新令牌有效期" prop="refreshTokenValidity">
        <el-input-number
          v-model="model.refreshTokenValidity"
          width="500"
          :min="900"
          :max="31536000"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">返回</el-button>
      <el-button type="primary" :loading="loading" @click="handleOk">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useClientsStore } from '@/store/modules/clients.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  show: Boolean,
  record: Object,
})

const emit = defineEmits(['closed', 'submitted'])

const clientsStore = useClientsStore()
const error = computed(() => clientsStore.updateError)
const loading = computed(() => clientsStore.loading)
const visible = ref(props.show)

// 使用 reactive 创建响应式对象
const model = reactive({ ...props.record })

// 计算并设置 redirectUris
// const redirect_uri = computed({
//   get: () => (model.redirect_uri ? model.redirect_uri.join(',') : ''),
//   set: (value) => {
//     model.redirect_uri = value.split(',')
//   },
// })

// 监听 props.show 的变化，控制 dialog 显示状态
watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal
  },
)

// 监听 props.record 的变化，更新 model
watch(
  () => props.record,
  (newVal) => {
    Object.assign(model, newVal) // 更新 model 的值
  },
)

// 提交操作
const handleOk = async () => {
  try {
    const success = await clientsStore.update(model)
    if (success) {
      emit('submitted', true) // 通知父组件操作成功
      visible.value = false
      emit('load')
      ElMessage.success('客户端信息更新成功')
    }
  } catch (err) {
    ElMessage.error('更新失败: ' + (err.message || err))
  }
}
// 取消操作
const handleCancel = () => {
  visible.value = false
  emit('closed', false)
}
</script>
