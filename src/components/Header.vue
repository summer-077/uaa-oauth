<template>
  <div id="header">
    <div id="person" class="flex flex-row gap-4 items-center">
      <el-avatar
        :size="50"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <div id="details" class="flex flex-col justify-center gap-1">
        <div id="name" class="font-bold">用户名称</div>
        <div id="permission">管理员</div>
      </div>
      <div id="menu" class="h-full flex flex-col justify-center">
        <el-dropdown>
          <div class="arrow-down">
            <el-icon><ArrowDownBold /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout()"> 退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/index.js'
const authStore = useAuthStore()
const logout = () => {
  authStore.reset()
}
</script>

<style scoped lang="less">
#header {
  width: 100%;
  height: 100%;
}
#person {
  float: right;
  height: 100%;
  margin: auto 0;
  padding-right: 20px;
  #name {
    font-size: 14px;
    font-weight: 1000;
  }
  #permission {
    font-size: 12px;
    color: var(--font-color-gray);
  }
}
.arrow-down {
  display: inline-block; // 确保元素可以应用 transform
  transition: transform 0.5s ease-in-out; // 添加过渡效果
  &:hover {
    transform: rotate(180deg); // 修改为仅旋转180度
  }
}

//dropdown黑线处理
:focus-visible {
  outline: -webkit-focus-ring-color auto 0px;
}
</style>
