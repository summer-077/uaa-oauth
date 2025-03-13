<template>
  <div>
    <!-- 显示页面名称 -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="less">
/* 你的样式 */
</style>
