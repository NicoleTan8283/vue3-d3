<script setup lang="ts">
import { ref } from 'vue';
import vtoComponents from './vtoComponents.vue'
let props = defineProps<{ msg: string }>()
console.log('props :>> ', props);
let points = ref<[number, number][]>([
    [
        482.83518139481544,
        379.2620126560489
    ],
    [
        495.16163317069413,
        379.30558943875417
    ],
    [
        502.9056580214202,
        387.01158317021964
    ],
    [
        501.2531385433674,
        402.7821990546277
    ],
    [
        488.39304922193287,
        416.68266272546174
    ],
    [
        487.7025205224752,
        428.5700261928777
    ],
    [
        490.51,
        442.72
    ],
    [
        492.0674243034609,
        471.2782381226824
    ],
    [
        477.2993831188977,
        494.57099851285466
    ],
    [
        444.74279822917657,
        512.7882987016009
    ]
])
</script>

<template>
  <vtoComponents v-model:points="points" />
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
