<template>
  <div>
    <el-upload
      class="absolute left-48 top-0"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="uploadChange"
    >
      <el-button>上传图片</el-button>
    </el-upload>
    <PublicTools
      :show-tools="showTools"
      @default-size="handleRest"
      @download="handledownload"
      @filter-change="setFilter"
      @auto="onGetKeyPoints"
    />
    <div
      id="toolContent"
      class="tool-content"
    >
      <svg
        id="contentCavans"
        :style="
          {
            width,
            height,
          }"
      >
        <g>
          <image
            :href="imgUrl"
            :style="{
              filter: imgFilter
            }"
          />
          <g class="lines">
            <path
              v-for="line in lineType"
              
              :id="line.name"
              :key="line.name"
              :d="line.lineString"
              stroke="#ff0"
              stroke-width="1"
              fill="none"
            />
          </g>
          <g class="points">
            <template 
              v-for="item in allPoints"
            >
              <circle
                v-if="item.contro"
                :id="item.landmark"
                :key="item.landmark"
                class="contro_points"
                r="2"
                :cx="item.x"
                :cy="item.y"
              />
              <text
                v-if="item.contro"
                :id="item.landmark"
                :key="item.landmark"
                class="dontshow"
                :x="item.x"
                :y="item.y"
                fill="#01ff01"
              >
                <tspan
                  :x="item.x"
                  :y="item.y"
                >
                  {{ item.landmark }}
                </tspan>
              </text>
            </template>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, Ref, ref, watch } from 'vue'
import PublicTools from '@/components/publicTools/index.vue'
import { Point, KeyPoint } from '@/types/d3.types';
import { addDrag, addZoom, clearDrag, createLine, resetZoom } from '@/utils/d3.helper';
import { downloadSvg } from '@/utils/public'
import type { UploadProps, UploadRawFile } from 'element-plus';
import { getKeyPoints } from '@/api/vto';
import { line_UpFace, line_DownFace, line_Cheeks, line_UpTeeth, line_DownTeeth, line_Head, line_Head2, line_Eyes, line_Head3, line_Head4, line_Head5, controPoints} from "@/utils/vtoLines";
import { calculationInitPoints } from '@/utils/vtoLineHelp';
import * as d3 from 'd3';
import { ZoomTransform } from 'd3'; 
type LineType = {
    name: string;
    points: Point[];
    pointsName: string[];
    lineString: string;
}

const zoomSelector = "#contentCavans"
const transformSelector = "#contentCavans g"
const width = ref(0);
const height = ref(0);
const imgFilter = ref("");
const imgUrl = ref('');
const allPoints = ref<KeyPoint[]>([]);
const moveStart = ref<Point>([0,0]);
const movePoint = ref<KeyPoint>();
let zoomTransform:ZoomTransform;
onMounted(() => {
  addZoom(zoomSelector, transformSelector,(e)=> {
    zoomTransform = e.transform;
  });
})
console.log('setup');
const showTools:Ref<string[]> = ref(['自动定点', '编辑模式', '测量', '校准','设置','面型对比','保存','还原','撤销','下载图像', 'vto模式', '融合模式', '原始大小']);
let lineType = ref<LineType[]>([
  {
    name: 'line_UpFace',
    pointsName: line_UpFace,
    points: [],
    lineString: ''
  },
  {
    name: 'line_DownFace',
    pointsName: line_DownFace,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Cheeks',
    pointsName: line_Cheeks,
    points: [],
    lineString: ''
  },
  {
    name: 'line_UpTeeth',
    pointsName: line_UpTeeth,
    points: [],
    lineString: ''
  },
  {
    name: 'line_DownTeeth',
    pointsName: line_DownTeeth,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Eyes',
    pointsName: line_Eyes,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Head',
    pointsName: line_Head,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Head2',
    pointsName: line_Head2,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Head3',
    pointsName: line_Head3,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Head4',
    pointsName: line_Head4,
    points: [],
    lineString: ''
  },
  {
    name: 'line_Head5',
    pointsName: line_Head5,
    points: [],
    lineString: ''
  },
])
const handleRest = () => {
  resetZoom(zoomSelector,transformSelector, width.value, height.value);
}
const setFilter = (filter: string) => {
  imgFilter.value = filter;
}
const handledownload = () => {
  downloadSvg(zoomSelector, width.value, height.value, 'test');
}
const uploadChange: UploadProps['onChange'] = (file) => {
  const reader = new FileReader();
  reader.readAsDataURL((file.raw as UploadRawFile))
  reader.addEventListener('load', () => {
    handleRest();
    allPoints.value = [];
    imgUrl.value = (reader.result as string);
    const image = new Image();
    image.src = imgUrl.value;
    image.onload = () => {
      width.value = image.width;
      height.value = image.height;
    }
  })
}
const onGetKeyPoints = () => {
  getKeyPoints(imgUrl.value).then(res=> {
    allPoints.value = JSON.parse(res.data);
    calculationInitPoints(new Date().toString(), allPoints.value)
    allPoints.value.forEach(i => {
      i.contro = controPoints.includes(i.landmark)
    })
  })
}
const onDrag = (type: "start" | "drag", e: any, d: KeyPoint) => {
  if(type === "start") {
    console.log('start :>> ', e, d);
    moveStart.value = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
    movePoint.value = JSON.parse(JSON.stringify(d))
  }
  if(type === 'drag') {
    // console.log('e :>> ', e);
    const moveEnd = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
    console.log('moveStart :>> ', moveStart.value);
    console.log('moveEnd :>> ', moveEnd);
    // console.log('zoomTransform :>> ', zoomTransform);
    // console.log('movePoint :>> ', movePoint);
    const moveDistant = [(moveEnd[0] - moveStart.value[0]) / zoomTransform.k, (moveEnd[1] - moveStart.value[1]) / zoomTransform.k]
    const point = allPoints.value.find(i=> i.landmark === movePoint.value?.landmark);
    (point as KeyPoint).x = (movePoint.value as KeyPoint).x + moveDistant[0];
    (point as KeyPoint).y = (movePoint.value as KeyPoint).y + moveDistant[1];
    // console.log('move', e, d)
  }
}
watch(
  ()=> allPoints.value,
  () => {
    lineType.value.forEach(i=> {
      i.points = []
      i.pointsName.forEach(name => {
        const findPoint = allPoints.value.find(item => item.landmark === name);
        if(findPoint) {
          i.points.push([findPoint.x, findPoint.y])
        }
      })
      i.lineString = createLine(i.points);
    })
  },
  {
    deep: true,
  }
)
watch(
  () => allPoints.value.length,
  () => {
    clearDrag(".contro_points");
    nextTick(() => {
      addDrag(".contro_points", allPoints.value.filter(i => i.contro),onDrag)
    })
  }
)
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
  // width:100%;
  // height:100%;
}
.dontshow {
  font-size: 8px;
}
</style>