<template>
  <div>
    <PublicTools :show-tools="showTools" />
    侧貌分析
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'
import PublicTools from '@/components/publicTools/index.vue'
const showTools:Ref<string[]> = ref(['自动定点', 'vto模式', '编辑模式',''])
</script>

<style lang="scss" scoped>

</style>