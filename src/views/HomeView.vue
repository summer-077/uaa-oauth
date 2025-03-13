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
        <el-main>
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
import Footer from '@/components/Footer.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
#home {
  height: 100vh;
  background-color: #f5f6fa;
}
#page-title {
  font-size: 17px;
  /* font-weight: 200; */
}

/* el部分改造 */
.el-header {
  background-color: #fff;
}

.el-aside {
  background-color: #fff;
  /* border-right: 1px solid #d8d8d8; */
}
.el-container {
  height: 100%;
}
.el-card {
  margin: 20px 10px 0;
  border-radius: 14px;
  border: 0;
}
</style>
<style></style>
