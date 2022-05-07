<template>
  <div>
    <PublicTools
      :show-tools="showTools"
      @default-size="handleRest"
      @download="handledownload"
      @save="handleSave"
      @filter-change="setFilter"
    />
    <div
      id="toolContent"
      class="tool-content"
    >
      <svg
        id="contentCavans"
        viewBox="0, 0, 672, 576"
      >
        <g>
          <image
            :href="imgUrl"
            :style="{
              filter: imgFilter
            }"
          />
          <g class="lines" />
          <g class="points" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import PublicTools from '@/components/publicTools/index.vue'
import { Point } from '@/types/d3.types';
import { addZoom, createLine, resetZoom } from '@/utils/d3.helper';
import { downloadSvg, urlToBase64 } from '@/utils/public'
import * as d3 from 'd3';
type LineType = {
    name: string;
    points: Point[];
    lineString: string;
}
const zoomSelector = "#contentCavans"
const transformSelector = "#contentCavans g"
const width = 672;
const height = 576;
const imgFilter = ref("");
const imgUrl = ref('/img/test.jpeg');
onMounted(() => {
  console.log('mounted');
  addZoom(zoomSelector, transformSelector);
  drawLines();
  urlToBase64(imgUrl.value).then(res=> {
    imgUrl.value = res
  })
})
console.log('setup');
const showTools:Ref<string[]> = ref(['自动定点', '编辑模式', '测量', '校准','设置','面型对比','保存','还原','撤销','下载图像', 'vto模式', '融合模式', '原始大小']);
let lineType: LineType[] = [
  {
    name: '下嘴唇',
    points: [
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
    ],
    lineString: ''
  }
]
let lines: d3.Selection<SVGPathElement, LineType, SVGGElement, number[]>;
function drawLines() {
  lineType.forEach(i=> {
    i.lineString = createLine(i.points)
  })
  console.log('lineType :>> ', lineType);
  lines = d3.select<SVGGElement, number[]>('svg g.lines').selectAll<SVGPathElement, number[]>('path').data(lineType);
  lines.enter().append('path').merge(lines).attr('d', (d)=> d.lineString).style('stroke', ()=> '#f00').style('fill', 'none')
}
function handleRest() {
  resetZoom(zoomSelector,transformSelector, width, height);
}
function setFilter(filter: string) {
  imgFilter.value = filter;
}
function handledownload() {
  downloadSvg(zoomSelector, width, height, 'test');
}
function handleSave() {
  console.log('save');
}
</script>

<style lang="scss" scoped>
.tool-content {
  @apply w-full overflow-hidden flex justify-center items-center;
  height: calc(100vh - 100px);
}
#contentCavans {
  @apply flex items-center justify-center;
  overflow: overlay;
  box-shadow: none;
  width:100%;
  height:100%;
}
</style>