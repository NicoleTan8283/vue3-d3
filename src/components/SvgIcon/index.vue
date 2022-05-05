<template>
  <svg
    aria-hidden="true"
    :class="svgClass"
  >
    <use
      :href="symbolId"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  }
})
const symbolId = computed(()=> `#icon-${props.name}`);
const svgClass = props.className ? 'svg-icon' + props.className : 'svg-icon';
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>