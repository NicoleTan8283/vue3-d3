<template>
  <div class="tools-box"> 
    <div class="tool" />
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  showTools: {
    type: Array as PropType<string[]>,
    required: true
  }
})
</script>

<style lang="scss" scoped>

</style>