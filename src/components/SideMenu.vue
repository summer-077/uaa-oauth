<template>
  <div id="side-menu">
    <el-menu
      router
      :default-active="router.path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <el-menu-item-group v-for="(item, index) in sideMenu" :key="item.id">
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-if="item.children && item.children.length"
          v-for="(subItem, subIndex) in item.children"
          :index="subItem.path"
        >
          {{ subItem.title }}
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SIDE_MENU from '@/data/side-menu.data.json'
import { ref } from 'vue'

const router = useRouter()

const sideMenu = ref(SIDE_MENU)

const isCollapse = ref(false)
</script>

<style scoped lang="less">
.el-menu {
  border-right: 0;
}
.el-menu-item {
  margin: 10px 20px;
  background-color: #fff;
  border-radius: 6px;
  font-size: 17px;

  &.is-active {
    color: #fff;
    background-color: var(--theme-color);
  }
}
</style>
