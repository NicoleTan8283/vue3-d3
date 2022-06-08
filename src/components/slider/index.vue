<template>
  <div class="flex items-center">
    <div>
      {{ title }}
    </div>
    <div class="flex justify-between items-center">
      <el-button
        size="small"
        @click="onButtonClick('minus')"
      >
        -
      </el-button>
      <el-slider
        :model-value="modelValue"
        class="slider"
        :show-tooltip="false"
        :max="10"
        :min="-10"
        :step="0.1"
        @input="onChangeValue"
      />
      <el-button
        size="small"
        @click="onButtonClick('add')"
      >
        +
      </el-button>
      <el-input
        :model-value="modelValue"
        class="input"
        size="small"
        :disabled="true"
      /> {{ unitText }}
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 10,
  },
  min: {
    type: Number,
    default: -10,
  },
  unitText: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  step: {
    type: Number,
    default: 0.1
  }
})
const emit = defineEmits(['update:modelValue'])
const onChangeValue = (val: number) => {
  emit('update:modelValue', Number(val.toFixed(1)))
}
const onButtonClick = (type: 'minus' | 'add') => {
  if(type === 'minus') {
    onChangeValue(props.modelValue - props.step < props.min ? props.min : props.modelValue - props.step)
  } else if(type === 'add') {
    onChangeValue(props.modelValue + props.step > props.max ? props.max : props.modelValue + props.step)
  }
}
</script>

<style scoped lang="scss">
.slider {
  @apply w-40;
}
.input {
  @apply w-16;
}
</style>