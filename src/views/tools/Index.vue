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
    <div class="flex">
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
                stroke="#ffffff"
                stroke-opacity="0.8"
                stroke-width="0.8"
                fill="none"
              />
              <line
                v-if="OcclusalPlanePoint.length"
                :style="
                  {
                    transform: toothMatrixs['咬合平面']
                  }
                "
                :x1="OcclusalPlanePoint[0].x"
                :y1="OcclusalPlanePoint[0].y"
                :x2="OcclusalPlanePoint[1].x"
                :y2="OcclusalPlanePoint[1].y"
                stroke-width="0.8"
                stroke="#f00"
              />
            </g>
            <g
              v-if="allPoints.length"
              class="teeth"
            >
              <path
                v-for="tooth in teeth"
                :id="tooth.id"
                :key="tooth.id"
                fill="#fff"
                fill-opacity="0.2"
                stroke="#ffffff"
                stroke-opacity="0.8"
                stroke-width="1"
                :d="tooth.path"
                :transform="tooth.matrix"
              />
            </g>
            <g
              v-if="allPoints.length"
              :id="teeth[0].id"
              :style="
                {
                  transform: toothMatrixs['上切牙']
                }
              "
            >
              <path
                :id="teeth[0].id"
                :key="teeth[0].id"
                fill="#f00"
                fill-opacity="0.4"
                stroke="#f00"
                stroke-opacity="1"
                stroke-width="1"
                :d="teeth[0].path"
                :transform="teeth[0].matrix"
              />
            </g>
            <g
              v-if="allPoints.length"
              :id="teeth[1].id"
              :style="
                {
                  transform: toothMatrixs['下切牙']
                }
              "
            >
              <path
                :id="teeth[1].id"
                :key="teeth[1].id"
                fill="#f00"
                fill-opacity="0.4"
                stroke="#f00"
                stroke-opacity="1"
                stroke-width="1"
                :d="teeth[1].path"
                :transform="teeth[1].matrix"
              />
            </g>
            <g class="points">
              <template 
                v-for="item in allPoints"
              >
                <circle
                  v-if="true"
                  :id="item.landmark"
                  :key="item.landmark"
                  class="contro_points"
                  r="1"
                  :cx="item.x"
                  :cy="item.y"
                />
              </template>
              <template 
                v-for="item in teethOtherPoints"
                :key="item.landmark"
              >
                <circle
                  :id="item.landmark"
                  class="contro_points"
                  r="1"
                  :cx="item.x"
                  :cy="item.y"
                />
              </template>
            </g>
          </g>
        </svg>
      </div>
      <div class="setting">
        <div class="title">
          参数设置
        </div>
        <div class="card">
          <el-radio-group v-model="activeTeeth">
            <el-radio-button label="上切牙" />
            <el-radio-button label="下切牙" />
            <el-radio-button label="咬合平面" />
          </el-radio-group>
        </div>
        <div
          class="value"
        >
          <Slider
            v-model="teethTransform[activeTeeth].horizontal"
            title="水平："
            unit-text="mm"
          />
          <Slider
            v-model="teethTransform[activeTeeth].vertrical"
            title="垂直："
            unit-text="mm"
          />
          <Slider
            v-model="teethTransform[activeTeeth].angle"
            title="角度："
            unit-text="度"
          />
          <Slider
            v-model="FHAngle"
            title="FH平面："
            unit-text="度" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, Ref, ref, watch } from 'vue'
import PublicTools from '@/components/publicTools/index.vue'
import Slider from '@/components/slider/index.vue'
import { Point, KeyPoint } from '@/types/d3.types';
import { addDrag, addZoom, clearDrag, createLine, getAngle, pointUseMatrix, resetZoom } from '@/utils/d3.helper';
import { downloadSvg } from '@/utils/public'
import type { UploadProps, UploadRawFile } from 'element-plus';
import { getKeyPoints } from '@/api/vto';
import { line_UpFace, line_DownFace, line_Cheeks, line_UpTeeth, line_DownTeeth, line_Head, line_Head2, line_Eyes, line_Head3, line_Head4, line_Head5, controPoints, Teeth} from "@/utils/vtoLines";
import { calculationInitPoints, getOcclusalPlane, matrixAddMatrix } from '@/utils/vtoLineHelp';
import { ZoomTransform } from 'd3';
import { Matrix } from '@/utils/matrix';
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
const FHAngle = ref(0);
const activeTeeth = ref<'上切牙' | '下切牙'| '咬合平面'>("上切牙");
const unitVector = ref(0);
const oldAngle = ref(0);
const teethTransform = ref({
  '上切牙': {
    id: '上切牙',
    horizontal: 0,
    vertrical: 0,
    angle: 0,
  },
  "下切牙": {
    horizontal: 0,
    vertrical: 0,
    angle: 0,
  },
  "咬合平面": {
    horizontal: 0,
    vertrical: 0,
    angle: 0,
  },
})
const imgUrl = ref('');
const allPoints = ref<KeyPoint[]>([]);
const moveStart = ref<Point>([0,0]);
const movePoint = ref<KeyPoint>();
const teeth = ref(Teeth);
const teethOtherPoints = ref<KeyPoint[]>([]);
const OcclusalPlanePoint = ref<KeyPoint[]>([])
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
  const faterDom = document.querySelector('#toolContent')
  resetZoom(zoomSelector,transformSelector, width.value, height.value, (faterDom as HTMLDivElement).clientWidth, (faterDom as HTMLDivElement).clientHeight);
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
      nextTick(() => {
        handleRest();
      })
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
    const ruler0 = allPoints.value.find(i => i.landmark === 'ruler0')
    const ruler1 = allPoints.value.find(i => i.landmark === 'ruler1')
    const rulerDistance = allPoints.value.find(i => i.landmark === "rulerdistance");
    if(ruler0 && ruler1 && rulerDistance) {
      unitVector.value = Number(rulerDistance.distance) / Math.sqrt(Math.pow(ruler1.x - ruler0.x, 2) + Math.pow(ruler1.y - ruler0.y, 2))
    }
    const U6Distal = allPoints.value.find(i => i.landmark === 'U6Distal')
    const U6Mesial = allPoints.value.find(i => i.landmark === 'U6Mesial')
    const L6Distal = allPoints.value.find(i => i.landmark === 'L6Distal')
    const L6Mesial = allPoints.value.find(i => i.landmark === 'L6Mesial')
    const U1IncisalTip = allPoints.value.find(i => i.landmark === 'U1IncisalTip')
    const L1RootTip = allPoints.value.find(i => i.landmark === 'L1IncisalTip')
    if(U6Distal && U6Mesial && L6Distal && L6Mesial && U1IncisalTip && L1RootTip) {
      OcclusalPlanePoint.value = getOcclusalPlane(U6Distal,U6Mesial,L6Distal,L6Mesial,U1IncisalTip,L1RootTip)
    }
    const Or = allPoints.value.find(i => i.landmark === 'Or')
    const Po = allPoints.value.find(i => i.landmark === 'Po')
    if(Or && Po) {
      FHAngle.value = Number(getAngle([0,0], [10,0], [Po.x, Po.y],[Or.x, Or.y],).toFixed(1))
    }
  })
}
const onDrag = (type: "start" | "drag" | 'end', e: any, d: KeyPoint) => {
  if(type === "start") {
    console.log('start :>> ', e, d);
    moveStart.value = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
    movePoint.value = JSON.parse(JSON.stringify(d))
  }
  if(type === 'drag') {
    const moveEnd = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
    const moveDistant = [(moveEnd[0] - moveStart.value[0]) / zoomTransform.k, (moveEnd[1] - moveStart.value[1]) / zoomTransform.k]
    const point = allPoints.value.find(i=> i.landmark === movePoint.value?.landmark);
    (point as KeyPoint).x = (movePoint.value as KeyPoint).x + moveDistant[0];
    (point as KeyPoint).y = (movePoint.value as KeyPoint).y + moveDistant[1];
  }
}
const toothMatrixs = computed(
  () => {
    const upMatrix = new Matrix();
    const upToothPoint = allPoints.value.find(i => i.landmark === 'U1IncisalTip');
    let upTooth;
    if(upToothPoint){
      upMatrix.setAngleBy(teethTransform.value['上切牙'].angle, upToothPoint.x, upToothPoint.y)
      upMatrix.addPosition(teethTransform.value['上切牙'].horizontal / unitVector.value, teethTransform.value['上切牙'].vertrical / unitVector.value)
      upTooth = upMatrix.toString()
    }
    const downMatrix = new Matrix();
    const downToothPoint = allPoints.value.find(i => i.landmark === 'L1IncisalTip');
    let downTooth;
    if(downToothPoint){
      downMatrix.setAngleBy(teethTransform.value['下切牙'].angle, downToothPoint.x, downToothPoint.y)
      downMatrix.addPosition(teethTransform.value['下切牙'].horizontal / unitVector.value, teethTransform.value['下切牙'].vertrical / unitVector.value)
      downTooth = downMatrix.toString()
    }
    const occMatrix = new Matrix();
    let occ;
    if(OcclusalPlanePoint.value[0]){
      occMatrix.setAngleBy(teethTransform.value['咬合平面'].angle, OcclusalPlanePoint.value[0].x, OcclusalPlanePoint.value[0].y)
      occMatrix.addPosition(teethTransform.value['咬合平面'].horizontal / unitVector.value, teethTransform.value['咬合平面'].vertrical / unitVector.value)
      occ = occMatrix.toString()
    }
    return {
      '上切牙': upTooth,
      '下切牙': downTooth,
      '咬合平面': occ
    }
  },
)
watch(
  () => teethTransform,
  (newValue) => {
    const newAngle = newValue.value['咬合平面'].angle
    if(newAngle !== oldAngle.value) {
      const step = newAngle - oldAngle.value;
      const martix = new Matrix();
      const upMatrix = new Matrix();
      const downMatrix = new Matrix();
      const upEndMatrix = new Matrix();
      const downEndMatrix = new Matrix();
      const upToothPoint = allPoints.value.find(i => i.landmark === 'U1IncisalTip');
      const downToothPoint = allPoints.value.find(i => i.landmark === 'L1IncisalTip');
      let upTooth, downTooth, upEndTooth, downEndTooth;
      if(upToothPoint){
        upMatrix.setAngleBy(teethTransform.value['上切牙'].angle, upToothPoint.x, upToothPoint.y)
        upMatrix.addPosition(teethTransform.value['上切牙'].horizontal / unitVector.value, teethTransform.value['上切牙'].vertrical / unitVector.value)
        upEndMatrix.setAngleBy(teethTransform.value['上切牙'].angle + step, upToothPoint.x, upToothPoint.y)
        upEndMatrix.addPosition(teethTransform.value['上切牙'].horizontal / unitVector.value, teethTransform.value['上切牙'].vertrical / unitVector.value)
      }
      if(downToothPoint){
        downMatrix.setAngleBy(teethTransform.value['下切牙'].angle, downToothPoint.x, downToothPoint.y)
        downMatrix.addPosition(teethTransform.value['下切牙'].horizontal / unitVector.value, teethTransform.value['下切牙'].vertrical / unitVector.value)
        downEndMatrix.setAngleBy(teethTransform.value['下切牙'].angle + step, downToothPoint.x, downToothPoint.y)
        downEndMatrix.addPosition(teethTransform.value['下切牙'].horizontal / unitVector.value, teethTransform.value['下切牙'].vertrical / unitVector.value)
      }
      upTooth = upMatrix.toMatrix3()
      upEndTooth = upEndMatrix.toMatrix3()
      downTooth = downMatrix.toMatrix3()
      downEndTooth = downEndMatrix.toMatrix3()
      martix.setAngleBy(step, OcclusalPlanePoint.value[0].x, OcclusalPlanePoint.value[0].y)
      let upToMatrix = matrixAddMatrix(martix.toMatrix3(), upTooth)
      let downToMatrix = matrixAddMatrix(martix.toMatrix3(), downTooth)
      const upX = Number(((upToMatrix[6] - upEndTooth[6]) * unitVector.value).toFixed(4));
      const upY = Number(((upToMatrix[7] - upEndTooth[7]) * unitVector.value).toFixed(4));
      const downX = Number(((downToMatrix[6] - downEndTooth[6]) * unitVector.value).toFixed(4));
      const downY = Number(((downToMatrix[7] - downEndTooth[7]) * unitVector.value).toFixed(4));
      teethTransform.value['上切牙'].angle += step;
      teethTransform.value['上切牙'].horizontal += upX;
      teethTransform.value['上切牙'].vertrical += upY;
      teethTransform.value['下切牙'].angle += step;
      teethTransform.value['下切牙'].horizontal += downX;
      teethTransform.value['下切牙'].vertrical += downY;
      oldAngle.value = newValue.value['咬合平面'].angle
    }
  },
  {
    deep: true
  }
)
watch(
  ()=> allPoints.value,
  () => {
    if(allPoints.value.length) {
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
    teethOtherPoints.value = [];
    teeth.value.forEach(tooth => {
      const keypoint1 = allPoints.value.find(i => i.landmark === tooth.keyPoint[0]);
      const keypoint2 = allPoints.value.find(i => i.landmark === tooth.keyPoint[1]);
      const toothDistance = Math.sqrt(Math.pow(tooth.defaultPoint[1][0] - tooth.defaultPoint[0][0], 2) + Math.pow(tooth.defaultPoint[1][1] - tooth.defaultPoint[0][1], 2))
      const pointDistance = Math.sqrt(Math.pow((keypoint2 as KeyPoint).x - (keypoint1 as KeyPoint).x, 2) + Math.pow((keypoint2 as KeyPoint).y - (keypoint1 as KeyPoint).y, 2))
      const toothSc = pointDistance / toothDistance;
      const angle = getAngle((tooth.defaultPoint[0] as Point), (tooth.defaultPoint[1] as Point), [(keypoint1 as KeyPoint)?.x, (keypoint1 as KeyPoint)?.y], [(keypoint2 as KeyPoint)?.x, (keypoint2 as KeyPoint)?.y], true)
      const postionDistance = Math.sqrt(Math.pow(tooth.defaultPoint[0][0], 2) + Math.pow(tooth.defaultPoint[0][1], 2)) * toothSc;
      const positionAngle = getAngle([0,0], [10, 0], [0,0], (tooth.defaultPoint[0] as Point)) + angle;
      const positionX = Math.cos(positionAngle * Math.PI / 180) * postionDistance;
      const positionY = Math.sin(positionAngle * Math.PI / 180) * postionDistance;
      const matrix = new Matrix();
      matrix.setScale(toothSc, toothSc);
      matrix.setAngle(angle);
      matrix.setPostion((keypoint1 as KeyPoint).x - positionX, (keypoint1 as KeyPoint).y - positionY);
      tooth.otherPoint && tooth.otherPoint.forEach(i => {
        const point = pointUseMatrix(i.point as Point, matrix.toMatrix())
        teethOtherPoints.value.push({
          x: point[0],
          y: point[1],
          landmark: i.landmark
        })
      })
      tooth.matrix = matrix.toString();
    })
    }
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
      addDrag(".contro_points", allPoints.value,onDrag)
    })
  }
)
</script>

<style lang="scss" scoped>
.tool-content {
  @apply w-full overflow-hidden flex-1 flex justify-center items-center;
  height: calc(100vh - 100px);
}
.setting {
  @apply bg-gray-100 w-80;
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