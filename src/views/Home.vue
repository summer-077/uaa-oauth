<template>
  <div id="home" class="flex flex-col">
    <el-header>
      <Header />
    </el-header>
    <el-container>
      <el-container>
        <el-aside width="240px">
          <SideMenu />
        </el-aside>
        <el-main class="scrollable-main">
          <div id="page-title">{{ route.name }}</div>
          <el-card shadow="never">
            <router-view></router-view>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
#home {
  height: 100vh;
  background-color: #f5f6fa;
  overflow: hidden; /* 禁止整个页面滚动 */
  display: flex;
  flex-direction: column;
}

#page-title {
  font-size: 20px;
  margin-bottom: 10px;
}

.el-header {
  background-color: #fff;
}

.el-aside {
  background-color: #fff;
}

.el-container {
  height: calc(100vh - 60px); /* 减去header高度 */
  overflow: hidden; /* 禁止容器滚动 */
}

.scrollable-main {
  overflow-y: auto; /* 只有main区域可滚动 */
  padding: 0 20px;
  height: 100%;
  margin-top: var(--margin-bottom);
}

.el-card {
  border-radius: 14px;
  border: 0;
  margin-bottom: 20px;
}
</style>
