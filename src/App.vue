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
  <el-button @click="toRoute('vto')">
    vto
  </el-button>
  <router-view />
</template>

<style>
body {
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  font-size: 12px;
	user-select: none;
}
svg {
	box-shadow: 0px 0px 40px -5px rgba(0,0,0,0.3);
	border-radius: 5px;
  position: relative;
}
svg circle {
	fill: white;
	stroke: #aaa;
	cursor: move;
}
</style>
