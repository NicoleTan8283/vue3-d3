<template>
  <div>
    <vtoComponentsVue />
  </div>
</template>

<script setup lang="ts">
import vtoComponentsVue from '../../components/vtoComponents.vue';
import { callWasm, callWasmAsync, getThreadMode } from 'zzzj'
console.log(callWasmAsync((f: any) => {
  console.log('f :>> ', f);
}));
console.log('callWasmAsync :>> ', callWasmAsync);

</script>

<style scoped>

</style>