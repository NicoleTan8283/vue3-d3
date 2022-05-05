<template>
  <div class="tools-box">
    <template
      v-for="item in tools"
    >
      <div
        v-if="showTools.includes(item.name)"
        :key="item.name"
        class="tool-item"
        @click="item.callback ? item.callback() : hendleEmit(item.emit)"
      >
        <SvgIcon :name="item.svgicon" />
        <div class="tool-text">
          {{ item.name }}
        </div>
      </div>
    </template>
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
const tools = [
  {
    svgicon: 'auto',
    name: '自动定点',
    emit: 'auto',
  },
  {
    svgicon: 'edit',
    name: '编辑模式',
    emit: 'edit'
  },
  {
    svgicon: 'vto',
    name: 'vto模式',
    emit: 'vto'
  },
  {
    svgicon: 'fusion',
    name: '融合模式',
    emit: 'fusion'
  },
  {
    svgicon: 'measuring',
    name: '测量',
    callback: measuring
  },
  {
    svgicon: 'calibration',
    name: '校准',
    emit: 'calibration'
  },
  {
    svgicon: 'setting',
    name: '设置',
    emit: 'setting'
  },
  {
    svgicon: 'contrast',
    name: '面型对比',
    emit: 'contrast'
  },{
    svgicon: 'save',
    name: '保存',
    emit: 'save'
  },
  {
    svgicon: 'reduction',
    name: '还原',
    emit: 'reduction'
  },
  {
    svgicon: 'revoke',
    name: '撤销',
    emit: 'revoke'
  },
  {
    svgicon: 'default',
    name: '原始大小',
    emit: 'defaultSize'
  },
  {
    svgicon: 'download',
    name: '下载图像',
    emit: 'download',
  },
]
function hendleEmit(event: string) {
  console.log('emit', event);
}
function measuring() {
  console.log('measuring');
}
</script>

<style lang="scss" scoped>
.tools-box {
  @apply flex bg-white;
  .tool-item {
    @apply flex flex-col justify-center items-center cursor-pointer mx-2;
    font-size: 12px;
    border: 1px solid transparent;
    border-radius: 5px;
    width: 4.2em;
    svg {
      font-size: 26px;
    }
    &:hover {
      color: #1a96ff;
      border-color: #1a96ff;
    }
  }
}
</style>