<template>
  <el-dialog v-model="visible" title="查看客户端信息" @close="handleCancel" width="700px">
    <el-form ref="form" :model="model" label-width="150px" :label-position="labelPosition">
      <el-form-item prop="clientId" label="客户端 ID">
        <el-input v-model="model.clientId" type="text" readonly @focus="selectAll($event)" />
      </el-form-item>

      <el-form-item prop="clientSecret" label="客户端 Secret">
        <el-input v-model="model.clientSecret" type="text" readonly @focus="selectAll($event)" />
      </el-form-item>

      <el-form-item prop="scopes" label="授权范围">
        <el-tag
          v-for="scope in model.scopes"
          :key="scope"
          class="mr-2 mb-2"
          @click="copyToClipboard(scope)"
        >
          {{ scope }}
        </el-tag>
      </el-form-item>

      <el-form-item prop="grantTypes" label="授权类型">
        <el-tag
          v-for="type in model.grantTypes"
          :key="type"
          class="mr-2 mb-2"
          type="success"
          @click="copyToClipboard(type)"
        >
          {{ type }}
        </el-tag>
      </el-form-item>

      <el-form-item label="重定向 URI" prop="redirectUris">
        <el-input v-model="model.redirectUris" @focus="selectAll($event)" autocomplete="off" />
      </el-form-item>

      <el-form-item prop="accessTokenValidity" label="访问令牌有效期(秒)">
        <el-input
          v-model="model.accessTokenValidity"
          type="number"
          readonly
          @focus="selectAll($event)"
        />
      </el-form-item>

      <el-form-item prop="refreshTokenValidity" label="刷新令牌有效期(秒)">
        <el-input
          v-model="model.refreshTokenValidity"
          type="number"
          readonly
          @focus="selectAll($event)"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="copyAll">复制全部信息</el-button>
      <el-button @click="handleCancel">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  show: Boolean,
  record: Object,
})

const emit = defineEmits(['closed'])

const form = ref(null)
const labelPosition = ref('right')
const model = reactive({ ...props.record })
const visible = ref(props.show)

// 监听显示状态变化
watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal
  },
)

// 监听记录变化
watch(
  () => props.record,
  (newVal) => {
    Object.assign(model, newVal)
  },
  { deep: true },
)

// 自动全选输入框内容
const selectAll = (event) => {
  event.target.select()
}

// 复制单个值到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => ElMessage.success('已复制到剪贴板'))
    .catch(() => ElMessage.error('复制失败'))
}

// 复制全部信息
// const copyAll = () => {
//   const text = `客户端ID: ${model.clientId}
// 客户端Secret: ${model.client_secret}
// 授权范围: ${model.scopes.join(', ')}
// 授权类型: ${model.authorized_grant_types.join(', ')}
// 重定向URI: ${model.redirect_uri.join(', ')}
// 访问令牌有效期: ${model.access_token_validity}秒
// 刷新令牌有效期: ${model.refresh_token_validity}秒`

//   copyToClipboard(text)
// }

const handleCancel = () => {
  visible.value = false
  emit('closed', false)
}
</script>

<style scoped>
.el-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.el-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mr-2 {
  margin-right: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}
</style>
