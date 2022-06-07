<template>
  <div class="lateralTools">
    <div
      v-for="tool in tools"
      :key="tool.name"
      :class="tool.active? 'tool acitve' : 'tool'"
      @click="onClickTool(tool)"
    >
      <SvgIcon :name="tool.icon" />
      <div>{{ tool.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
type Tool = {
  name: string;
  icon: string;
  emit: string;
  active: boolean
}
const props = defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: true,
  },
  keyPoint: {
    type: Boolean,
    default: true,
  },
  text: {
    type: Boolean,
    default: false,
  },
  point: {
    type: Boolean,
    default: false,
  },
  tooth: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['changeActive'])
const tools = ref<Tool[]>([
  {
    name: '编辑',
    icon: 'edit',
    emit: 'edit',
    active: false,
  },
  {
    name: '轮廓',
    icon: 'outline',
    emit: 'outline',
    active: false,
  },
  {
    name: 'AI点',
    icon: 'keyPoint',
    emit: 'keyPoint',
    active: false,
  },
  {
    name: '点名称',
    icon: 'text',
    emit: 'pointName',
    active: false,
  },
  {
    name: '辅助点',
    icon: 'point',
    emit: 'point',
    active: false,
  },
  {
    name: '牙齿点',
    icon: 'tooth',
    emit: 'toothPoint',
    active: false,
  },
  {
    name: '颜色',
    icon: 'color',
    emit: '',
    active: false,
  }
])
onMounted(() => {
  changeValue('轮廓', props.outline)
  changeValue('AI点', props.keyPoint)
  changeValue('点名称', props.text)
  changeValue('辅助点', props.point)
  changeValue('牙齿点', props.tooth)
})
const changeValue = (name: string, value: boolean) => {
  const tool = tools.value.find(i => i.name === name)
  if(tool) {
    if(tool.active !== value) {
      tool.active = value
      emits('changeActive', tool.emit, value, tools.value)
    }
  }
}
const onClickTool = (tool: Tool) => {
  if(tool.name !=='颜色') {
    changeValue(tool.name, !tool.active)
  } else {
    console.log('click color')
  }
}
</script>

<style lang="scss" scoped>
.lateralTools {
  @apply flex flex-col items-center bg-white p-2 rounded;
  font-size: 12px;
}
.tool {
  @apply flex flex-col items-center text-center pb-1 mb-1 w-full relative cursor-pointer;
  &::after{
    @apply block w-full h-0.25 bg-gray-200 absolute bottom-0;
    content: '',
  }
  &:last-child {
    &::after {
      display: none;
    }
  }
  &.acitve {
    @apply text-blue-500;
  }
  svg {
    font-size: 20px;
  }
}
</style>