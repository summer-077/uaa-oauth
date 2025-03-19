<template>
  <div>您已退出系统，点<a-button type="link" @click="handleLogin">这里</a-button>重新登录</div>
</template>

<script setup>
import OAUTH_API from '@/services/oauth.service'

const handleLogin = () => {
  OAUTH_API.getUrl()
}
</script>

<style></style>
