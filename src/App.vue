<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs

import router from './router';

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
function toRoute(routerName: string) {
  router.push(routerName)
}
</script>

<template>
  <el-button @click="toRoute('tools')">
    侧位片分析
  </el-button>
  <router-view />
</template>

<style>
body {
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  font-size: 12px;
	user-select: none;
}
</style>
