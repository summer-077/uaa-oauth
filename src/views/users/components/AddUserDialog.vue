<template>
  <el-dialog v-model="visible" title="添加用户" width="40%" :before-close="handleCancel">
    <el-alert
      v-if="usersStore.addError"
      title="添加用户失败"
      :description="usersStore.addError"
      type="error"
      style="width: 100%; margin-bottom: 20px"
    />
    <el-form ref="form" :model="model" :rules="rules" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="model.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input v-model="model.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="model.mobile" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">返回</el-button>
        <el-button type="primary" :loading="usersStore.loading" @click="handleOk">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useUsersStore } from '@/store/modules/users'
import { addUserRules } from '@/views/form-rules/add-user'

// Props 和 Emits
const props = defineProps({
  show: Boolean,
  record: Object,
})
const emit = defineEmits(['closed', 'submitted'])

// Store
const usersStore = useUsersStore()

// UI 相关
const form = ref(null)
const visible = ref(props.show)
const model = ref({ ...props.record }) // 避免直接修改 `props`

// 监听 `props.show`，同步 `visible`
watchEffect(() => {
  visible.value = props.show
})

// 监听 `props.record`，确保 `model` 跟随更新
watchEffect(() => {
  model.value = { ...props.record }
})

// 表单校验规则
const rules = addUserRules()

// 提交添加用户
const handleOk = () => {
  form.value.validate((valid) => {
    if (valid) {
      emit('submitted', model.value)
      usersStore.add(model.value).then((res) => {
        if (res) {
          form.value.resetFields()
          emit('closed', false) // 关闭弹窗
        }
      })
    }
  })
}

// 关闭弹窗
const handleCancel = () => {
  emit('closed', false)
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
