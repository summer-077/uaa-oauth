<template>
  <el-dialog v-model="visible" title="修改角色" width="500px">
    <el-alert
      v-if="rolesStore.updateError"
      type="error"
      :description="rolesStore.updateError"
      show-icon
      style="margin-bottom: 16px"
    />

    <el-form ref="formRef" :model="model" :rules="rules" label-width="80px">
      <el-form-item prop="roleName" label="角色标识">
        <el-input v-model="model.roleName" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="displayName" label="角色名称">
        <el-input v-model="model.displayName" autocomplete="off" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="rolesStore.loading" @click="handleOk">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRolesStore } from '@/store/modules/roles' // Pinia Store
import { editRoleRules } from '@/views/form-rules/edit-roles'
import { ElMessage } from 'element-plus'

const props = defineProps({
  show: Boolean,
  record: Object,
})

const emit = defineEmits(['closed', 'submitted'])

const rolesStore = useRolesStore()
const formRef = ref(null)
const model = ref({ ...props.record })
const rules = computed(() => editRoleRules(model.value))

// 控制弹窗显示状态
const visible = computed({
  get: () => props.show,
  set: (value) => emit('closed', value),
})

// 监听 `props.show` 变化时，更新 `model`
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      model.value = { ...props.record }
    }
  },
)

const handleOk = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit('submitted', model.value)
      rolesStore.updateRole(model.value).then((res) => {
        if (res) {
          ElMessage.success('角色修改成功')
          formRef.value.resetFields()
          visible.value = false
        } else {
          ElMessage.error('角色修改失败')
        }
      })
    }
  })
}

const handleCancel = () => {
  visible.value = false
}
</script>

<style scoped></style>
