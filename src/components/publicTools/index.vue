<template>
  <div class="tools-box">
    <template
      v-for="item in tools"
    >
      <div
        v-if="showTools.includes(item.name)"
        :key="item.name"
        class="tool-item"
        :class="item.active ? 'active' : ''"
        @click="item.callback ? item.callback() : hendleEmit(item.emit)"
      >
        <SvgIcon :name="item.svgicon" />
        <div class="tool-text">
          {{ item.name }}
        </div>
      </div>
    </template>
    <div class="filter-tools">
      <div class="filter-invert">
        <div class="text">
          透视
        </div>
        <div>
          <el-switch
            v-model="filters.invert"
            :active-value="1"
            :inactive-value="0"
            size="small"
          />
        </div>
      </div>
      <div>
        <div class="filter-item">
          <div class="text">
            亮度
          </div>
          <el-slider
            v-model="filters.brightness"
            :max="3"
            :min="0"
            :step="0.01"
            size="small"
          />
        </div>
        <div class="filter-item">
          <div class="text">
            对比度
          </div>
          <el-slider
            v-model="filters.contrast"
            :max="2"
            :min="0"
            :step="0.01"
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, watch } from 'vue';

defineProps({
  showTools: {
    type: Array as PropType<string[]>,
    required: true
  }
})
const emit = defineEmits(['filterChange','hyphenated'])
const filters = reactive({
  brightness:1,
  contrast: 1,
  invert: 0
})
const tools = ref([
  {
    svgicon: 'auto',
    name: '自动定点',
    emit: 'auto',
    active: false,
  },
  {
    svgicon: 'edit',
    name: '编辑模式',
    emit: 'edit',
    active: false,
  },
  {
    svgicon: 'vto',
    name: 'vto模式',
    emit: 'vto',
    active: false,
  },
  {
    svgicon: 'fusion',
    name: '融合模式',
    emit: 'fusion',
    active: false,
  },
  {
    svgicon: 'measuring',
    name: '测量',
    callback: measuring,
    active: false,
  },
  {
    svgicon: 'calibration',
    name: '校准',
    emit: 'calibration',
    active: false,
  },
  {
    svgicon: 'setting',
    name: '设置',
    emit: 'setting',
    active: false,
  },
  {
    svgicon: 'contrast',
    name: '面型对比',
    emit: 'contrast',
    active: false,
  },{
    svgicon: 'save',
    name: '保存',
    emit: 'save',
    active: false,
  },
  {
    svgicon: 'reduction',
    name: '还原',
    emit: 'reduction',
    active: false,
  },
  {
    svgicon: 'revoke',
    name: '撤销',
    emit: 'revoke',
    active: false,
  },
  {
    svgicon: 'default',
    name: '原始大小',
    emit: 'defaultSize',
    active: false,
  },
  {
    svgicon: 'download',
    name: '下载图像',
    emit: 'download',
    active: false,
  },
])
function hendleEmit(event: string) {
  if(event === 'edit') {
    const index = tools.value.findIndex(i => i.emit === event);
    tools.value[index].active = !tools.value[index].active;
    console.log('tools :>> ', tools);
  }
  emit(event);
  console.log('emit', event);
}
function measuring() {
  console.log('measuring');
}
watch(() => filters, () => {
  const filterString = `brightness(${filters.brightness}) contrast(${filters.contrast}) invert(${filters.invert})`;
  console.log('filterString :>> ', filterString);
  emit("filterChange", filterString);
},{
  deep: true
})
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
    transition: all 0.3s;
    svg {
      font-size: 26px;
    }
    &:hover {
      color: #1a96ff;
      border-color: #1a96ff;
    }
    &.active {
      color: #1a96ff;
    }
  }
}
.filter-tools {
  @apply flex;
  .filter-invert {
    @apply flex items-center justify-center mr-3;
    .text {
      @apply mr-2;
    }
  }
  .filter-item {
    @apply flex flex-row w-52 items-center;
    .text {
      @apply w-14 mr-1;
    }
  }
}
:deep(.el-slider) {
  --el-slider-button-wrapper-size: 16px;
  --el-slider-button-wrapper-offset: -6px;
  --el-slider-button-size: 16px;
}

:deep(.el-switch) {
  --el-switch-button-size: 12px;
  --el-switch-height: 16px
}

</style>