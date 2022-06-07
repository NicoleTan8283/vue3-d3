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
            <g
              v-if="allPoints.length"
              class="lines"
            >
              <path
                v-for="line in lineType"
                :id="line.name"
                :key="line.name"
                :d="line.lineString"
                stroke="#ffffff"
                stroke-opacity="0.8"
                fill="none"
              />
              <line
                v-if="OcclusalPlanePoint.length"
                :style="
                  {
                    transform: matrixToTransform(toothMatrixs['咬合平面'])
                  }
                "
                :x1="OcclusalPlanePoint[0].x"
                :y1="OcclusalPlanePoint[0].y"
                :x2="OcclusalPlanePoint[1].x"
                :y2="OcclusalPlanePoint[1].y"
                stroke="#f00"
              />
              <ellipse
                v-if="linePo.cx"
                :cx="linePo.cx"
                :cy="linePo.cy"
                :rx="linePo.rx"
                :ry="linePo.ry"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-opacity="0.8"
                stroke="#ffffff"
                fill="none"
              />
            </g>
            <g
              v-if="allPoints.length"
              class="teeth"
            >
              <template 
                v-for="tooth in svgPath" 
                :key="tooth.name"
              >
                <path
                  :id="tooth.name +'round'"
                  fill="#fff"
                  fill-opacity="0.2"
                  stroke="#ffffff"
                  stroke-opacity="0.8"
                  :d="tooth.roundPoint.dString"
                  :style="
                    {
                      transform: matrixToTransform(tooth.matrix)
                    }
                  "
                />
                <path
                  :id="tooth.name +'center'"
                  fill="none"
                  stroke="#ffffff"
                  stroke-opacity="0.8"
                  :d="tooth.centerPoint.dString"
                  :style="
                    {
                      transform: matrixToTransform(tooth.matrix)
                    }
                  "
                />
              </template>
              <path
                v-for="tooth in teeth"
                :id="tooth.id"
                :key="tooth.id"
                fill="#fff"
                fill-opacity="0.2"
                stroke="#ffffff"
                stroke-opacity="0.8"
                :d="tooth.path"
                :transform="tooth.matrix"
              />
            </g>
            <g
              v-if="allPoints.length"
              :id="teeth[0].id"
              :style="
                {
                  transform: matrixToTransform(toothMatrixs['上切牙'])
                }
              "
            >
              <path
                :id="svgPath[0].name +'round'"
                fill="#f00"
                fill-opacity="0.2"
                stroke="#f00"
                stroke-opacity="0.8"
                stroke-width="1"
                :d="svgPath[0].roundPoint.dString"
              />
              <path
                :id="svgPath[0].name +'center'"
                fill="none"
                stroke="#f00"
                stroke-opacity="0.8"
                stroke-width="1"
                :d="svgPath[0].centerPoint.dString"
              />
            </g>
            <g
              v-if="allPoints.length"
              :id="teeth[1].id"
              :style="
                {
                  transform: matrixToTransform(toothMatrixs['下切牙'])
                }
              "
            >
              <path
                :id="svgPath[1].name +'round'"
                fill="#f00"
                fill-opacity="0.2"
                stroke="#f00"
                stroke-opacity="0.8"
                stroke-width="1"
                :d="svgPath[1].roundPoint.dString"
              />
              <path
                :id="svgPath[1].name +'center'"
                fill="none"
                stroke="#f00"
                stroke-opacity="0.8"
                stroke-width="1"
                :d="svgPath[1].centerPoint.dString"
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
                  r="1"
                  :cx="item.x"
                  :cy="item.y"
                  :fill="item.isKeyPoint ? '#f00' : '#aaa'"
                  :stroke="item.isKeyPoint ? '#f00' : '#aaa'"
                  :style="
                    {
                      cursor: 'pointer'
                    }
                  "
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
import { Point, KeyPoint, toothSvgType } from '@/types/d3.types';
import { addDrag, addZoom, clearDrag, createLine, getAngle, pointUseMatrix, resetZoom } from '@/utils/d3.helper';
import { decimalAdjust, downloadSvg } from '@/utils/public'
import type { UploadProps, UploadRawFile } from 'element-plus';
import { getKeyPoints } from '@/api/vto';
import { line_UpFace, line_DownFace, line_Cheeks, line_UpTeeth, line_DownTeeth, KeyPoints, line_Head, line_Head2, line_Eyes,line_Ruler, line_Head3, line_Head4, line_Head5, controPoints, Teeth, upToothSvgRound, upToothSvgCenter, line_UpTooth, line_SVGUpTooth, lowToothSvgCenter, lowToothSvgRound, line_DownTooth, line_SVGDownTooth, line_UpTeeth2, line_UpTeeth3} from "@/utils/vtoLines";
import { calculationInitPoints, getOcclusalPlane, matrixMultplyMatrix } from '@/utils/vtoLineHelp';
import * as d3 from 'd3';
import { matrixToTransform, rotateByPoint, useMatrixs } from '@/utils/matrix';
import { getToothMatrix, lowtoothPoint, UptoothPoint } from '@/utils/tooth';
import { mat3 } from 'gl-matrix'
import * as _ from 'lodash'
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
const OcclusalPlanePoint = ref<KeyPoint[]>([])
const rulerDistance = ref(0)
let zoomTransform:d3.ZoomTransform;
onMounted(() => {
  addZoom(zoomSelector, transformSelector,(e)=> {
    zoomTransform = e.transform;
    const g = d3.select(transformSelector);
    const strokeWidth = width.value > 2000 ? 2.5: 1;
    g.style('stroke-width', strokeWidth / Math.sqrt(zoomTransform.k))
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
    name: 'line_UpTeeth2',
    pointsName: line_UpTeeth2,
    points: [],
    lineString: ''
  },
  {
    name: 'line_UpTeeth3',
    pointsName: line_UpTeeth3,
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
    name: 'line_Ruler',
    pointsName: line_Ruler,
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
let svgPath = ref<toothSvgType[]>([
  {
    name: 'upToothSvg',
    roundPoint: {
      names: upToothSvgRound,
      dString: ''
    },
    centerPoint: {
      names: upToothSvgCenter,
      dString: ''
    },
    positionPoint: {
      AI: line_UpTooth,
      SVG: line_SVGUpTooth,
    },
    matrix: mat3.create(),
  },
  {
    name: 'lowToothSvg',
    roundPoint: {
      names: lowToothSvgRound,
      dString: ''
    },
    centerPoint: {
      names: lowToothSvgCenter,
      dString: ''
    },
    positionPoint: {
      AI: line_DownTooth,
      SVG: line_SVGDownTooth,
    },
    matrix: mat3.create(),
  },
])
const handleRest = () => {
  const faterDom = document.querySelector('#toolContent')
  resetZoom(zoomSelector,transformSelector, width.value, height.value, (faterDom as HTMLDivElement).clientWidth, (faterDom as HTMLDivElement).clientHeight);
  const selector = d3.select<HTMLElement, unknown>(zoomSelector);
  const transform = d3.zoomTransform(selector.node() as HTMLElement);
  const g = d3.select(transformSelector);
  const strokeWidth = width.value > 2000 ? 2.5: 1;
  console.log('zoom')
  g.style('stroke-width', strokeWidth / Math.sqrt(transform.k))
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
const setOcc = () => {
    const U6Distal = allPoints.value.find(i => i.landmark === 'U6Distal')
    const U6Mesial = allPoints.value.find(i => i.landmark === 'U6Mesial')
    const L6Distal = allPoints.value.find(i => i.landmark === 'L6Distal')
    const L6Mesial = allPoints.value.find(i => i.landmark === 'L6Mesial')
    const U1IncisalTip = allPoints.value.find(i => i.landmark === 'U1IncisalTip')
    const L1RootTip = allPoints.value.find(i => i.landmark === 'L1IncisalTip')
    if(U6Distal && U6Mesial && L6Distal && L6Mesial && U1IncisalTip && L1RootTip) {
      OcclusalPlanePoint.value = getOcclusalPlane(U6Distal,U6Mesial,L6Distal,L6Mesial,U1IncisalTip,L1RootTip)
    }
}
const computedDistance = () => {
    const ruler0 = allPoints.value.find(i => i.landmark === 'ruler0')
    const ruler1 = allPoints.value.find(i => i.landmark === 'ruler1')
    if(ruler0 && ruler1) {
      unitVector.value = Number(rulerDistance.value) / Math.sqrt(Math.pow(ruler1.x - ruler0.x, 2) + Math.pow(ruler1.y - ruler0.y, 2))
    }
    console.log(unitVector.value)
}
const onGetKeyPoints = () => {
  getKeyPoints(imgUrl.value).then(res=> {
    console.log(JSON.parse(res.data))
    const points: KeyPoint[] = JSON.parse(res.data)
    calculationInitPoints(new Date().toString(), points)
    points.push(...UptoothPoint, ...lowtoothPoint)
    points.forEach((i:KeyPoint) => {
      i.contro = controPoints.includes(i.landmark) || KeyPoints.includes(i.landmark)
      i.isKeyPoint = KeyPoints.includes(i.landmark)
    })
    
    const distance = points.find(i => i.landmark === "rulerdistance");
    if(distance) {
      rulerDistance.value = Number(distance.distance)
    }
    allPoints.value = points;
    computedDistance();
    setOcc();
    const Or = allPoints.value.find(i => i.landmark === 'Or')
    const Po = allPoints.value.find(i => i.landmark === 'Po')
    if(Or && Po) {
      FHAngle.value = Number(getAngle({x:0,y: 0}, {x:10,y:0}, Po, Or).toFixed(1))
    }
    nextTick(
      () => {
        useToothMatrix()
      }
    )
  })
}
const onDrag = (type: "start" | "drag" | 'end', e: any, d: KeyPoint) => {
  if(type === "start") {
    moveStart.value = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
    movePoint.value = JSON.parse(JSON.stringify(allPoints.value.find(i=> i.landmark === d.landmark)))
  }
  if(type === 'drag') {
    _.debounce(() => {
      const moveEnd = [e.sourceEvent.offsetX, e.sourceEvent.offsetY];
      const moveDistant = [(moveEnd[0] - moveStart.value[0]) / zoomTransform.k, (moveEnd[1] - moveStart.value[1]) / zoomTransform.k]
      const point = allPoints.value.find(i=> i.landmark === movePoint.value?.landmark);
      (point as KeyPoint).x = (movePoint.value as KeyPoint).x + moveDistant[0];
      (point as KeyPoint).y = (movePoint.value as KeyPoint).y + moveDistant[1];
    }, 1000 / 90)()
  }
  if(type === 'end') {
    const toothAIPoint = svgPath.value.map(i => i.positionPoint.AI).flat(1)
    // 改变尺子距离
    if(line_Ruler.includes(d.landmark)) {
      computedDistance();
    } else if (toothAIPoint.includes(d.landmark)) {
      useToothMatrix()
    }
  }
}
const useToothMatrix = () => {
  svgPath.value.forEach(svg=> {
    const svgAllpoints = [...svg.roundPoint.names, ...svg.centerPoint.names]
    const newAllPoints = allPoints.value.map(point => {
      if(svgAllpoints.includes(point.landmark)) {
        const newPoint = pointUseMatrix(point, svg.matrix);
        return {
          ...point,
          x:decimalAdjust('round', newPoint.x, -4),
          y:decimalAdjust('round', newPoint.y, -4),
        }
      }else {
        return {
          ...point
        }
      }
    })
    svg.matrix = mat3.create();
    allPoints.value = newAllPoints
  })
}
const controPointsValue = computed(
  () => {
    const points = JSON.parse(JSON.stringify(allPoints.value.filter(point => point.contro === true)))
    return points
  }
)
const toothMatrixs = computed(
  () => {
    let upMatrix = mat3.create();
    const upToothPoint = allPoints.value.find(i => i.landmark === 'U1IncisalTip');
    if(upToothPoint){
      const roateMatrix = rotateByPoint(teethTransform.value['上切牙'].angle, [upToothPoint.x, upToothPoint.y])
      const translateMatrix = mat3.translate(mat3.create(),mat3.create(),[teethTransform.value['上切牙'].horizontal / unitVector.value, teethTransform.value['上切牙'].vertrical / unitVector.value])
      upMatrix = useMatrixs([roateMatrix,translateMatrix])
    }
    let downMatrix = mat3.create();
    const downToothPoint = allPoints.value.find(i => i.landmark === 'L1IncisalTip');
    console.log(downToothPoint)
    if(downToothPoint){
      const roateMatrix = rotateByPoint(teethTransform.value['下切牙'].angle, [downToothPoint.x, downToothPoint.y])
      const translateMatrix = mat3.translate(mat3.create(),mat3.create(),[teethTransform.value['下切牙'].horizontal / unitVector.value, teethTransform.value['下切牙'].vertrical / unitVector.value])
      downMatrix = useMatrixs([roateMatrix,translateMatrix])
    }
    let occMatrix = mat3.create();
    if(OcclusalPlanePoint.value[0]){
      const roateMatrix = rotateByPoint(teethTransform.value['咬合平面'].angle, [OcclusalPlanePoint.value[0].x, OcclusalPlanePoint.value[0].y])
      const translateMatrix = mat3.translate(mat3.create(),mat3.create(),[teethTransform.value['咬合平面'].horizontal / unitVector.value, teethTransform.value['咬合平面'].vertrical / unitVector.value])
      occMatrix = useMatrixs([roateMatrix,translateMatrix])
    }
    return {
      '上切牙': upMatrix,
      '下切牙': downMatrix,
      '咬合平面': occMatrix
    }
  },
)
const toothKeyPoint = ref<KeyPoint[]>([])
const linePo = computed(
  () => {
    const Po = allPoints.value.find(i => i.landmark === 'Po')
    const Po1 = allPoints.value.find(i => i.landmark === 'Po1')
    const ellipse = {
      cx: 0,
      cy: 0,
      rx: 0,
      ry: 0,
    }
    if(Po && Po1) {
      ellipse.cx = (Po.x + Po1.x) / 2;
      ellipse.cy = (Po.y + Po1.y) / 2;
      ellipse.ry = Math.abs(Po.y - Po1.y) / 2;
      ellipse.rx = ellipse.ry * 0.71428;
    }
    return ellipse
  }
)
watch(
  () => toothKeyPoint.value,
  (newValue, oldValue) => {
    if(JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
      svgPath.value.forEach(svg=> {
        console.time('a')
        svg.matrix = getToothMatrix(allPoints.value, svg.positionPoint.AI, svg.positionPoint.SVG);
        console.log(matrixToTransform(svg.matrix))
        console.log(svg.matrix)
        console.timeEnd('a')
        // const svgAllpoints = [...svg.roundPoint.names, ...svg.centerPoint.names]
        // const newAllPoints = allPoints.value.map(point => {
        //   if(svgAllpoints.includes(point.landmark)) {
        //     const newPoint = pointUseMatrix(point, svg.matrix.toMatrix());
        //     return {
        //       ...point,
        //       x:decimalAdjust('round', newPoint.x, -4),
        //       y:decimalAdjust('round', newPoint.y, -4),
        //     }
        //   }else {
        //     return {
        //       ...point
        //     }
        //   }
        // })
        // allPoints.value = newAllPoints
      })
    }
  },{
    deep: true
  }
)
watch(
  () => teethTransform,
  (newValue) => {
    const newAngle = newValue.value['咬合平面'].angle
    if(newAngle !== oldAngle.value) {
      const step = newAngle - oldAngle.value;
      let martix = mat3.create();
      let upEndMatrix = mat3.create();
      let downEndMatrix = mat3.create();
      const upToothPoint = allPoints.value.find(i => i.landmark === 'U1IncisalTip');
      const downToothPoint = allPoints.value.find(i => i.landmark === 'L1IncisalTip');
      let upTooth, downTooth, upEndTooth, downEndTooth;
      if(upToothPoint){
        const roateMatrix = rotateByPoint(teethTransform.value['上切牙'].angle + step, [upToothPoint.x, upToothPoint.y])
        const translateMatrix = mat3.translate(mat3.create(),mat3.create(),[teethTransform.value['上切牙'].horizontal / unitVector.value, teethTransform.value['上切牙'].vertrical / unitVector.value])
        upEndMatrix = useMatrixs([roateMatrix,translateMatrix])
      }
      if(downToothPoint){
        const roateMatrix = rotateByPoint(teethTransform.value['下切牙'].angle + step, [downToothPoint.x, downToothPoint.y])
        const translateMatrix = mat3.translate(mat3.create(),mat3.create(),[teethTransform.value['下切牙'].horizontal / unitVector.value, teethTransform.value['下切牙'].vertrical / unitVector.value])
        downEndMatrix = useMatrixs([roateMatrix,translateMatrix])
      }
      upTooth = toothMatrixs.value['上切牙']
      upEndTooth = upEndMatrix
      downTooth = toothMatrixs.value['下切牙']
      downEndTooth = downEndMatrix
      martix = rotateByPoint(step, [OcclusalPlanePoint.value[0].x, OcclusalPlanePoint.value[0].y])
      let upToMatrix = matrixMultplyMatrix(martix, upTooth)
      let downToMatrix = matrixMultplyMatrix(martix, downTooth)
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
      teeth.value.forEach(tooth => {
        const keypoint1 = allPoints.value.find(i => i.landmark === tooth.keyPoint[0]);
        const keypoint2 = allPoints.value.find(i => i.landmark === tooth.keyPoint[1]);
        const toothDistance = Math.sqrt(Math.pow(tooth.defaultPoint[1][0] - tooth.defaultPoint[0][0], 2) + Math.pow(tooth.defaultPoint[1][1] - tooth.defaultPoint[0][1], 2))
        const pointDistance = Math.sqrt(Math.pow((keypoint2 as KeyPoint).x - (keypoint1 as KeyPoint).x, 2) + Math.pow((keypoint2 as KeyPoint).y - (keypoint1 as KeyPoint).y, 2))
        const toothSc = pointDistance / toothDistance;
        if(keypoint1 && keypoint2) {
          const angle = getAngle({x: tooth.defaultPoint[0][0],y: tooth.defaultPoint[0][1]},{x: tooth.defaultPoint[1][0],y: tooth.defaultPoint[1][1]}, keypoint1, keypoint2, true)
          const postionDistance = Math.sqrt(Math.pow(tooth.defaultPoint[0][0], 2) + Math.pow(tooth.defaultPoint[0][1], 2)) * toothSc;
          const positionAngle = getAngle({x:0,y:0}, {x:1, y:0}, {x:0,y:0}, {x: tooth.defaultPoint[0][0],y: tooth.defaultPoint[0][1]}) + angle;
          const positionX = Math.cos(positionAngle * Math.PI / 180) * postionDistance;
          const positionY = Math.sin(positionAngle * Math.PI / 180) * postionDistance;
          const scaleMatrix = mat3.scale(mat3.create(), mat3.create(), [toothSc,toothSc]);
          const angleMatrix = mat3.rotate(mat3.create(), mat3.create(), (angle * Math.PI) / 180)
          const tanslate = mat3.translate(mat3.create(), mat3.create(), [(keypoint1 as KeyPoint).x - positionX, (keypoint1 as KeyPoint).y - positionY])
          tooth.matrix = matrixToTransform(useMatrixs([scaleMatrix, angleMatrix, tanslate]));
        }
      })
      lineType.value.forEach(i=> {
        const points: [number, number][] = []
        i.pointsName.forEach(name => {
          const findPoint = allPoints.value.find(item => item.landmark === name);
          if(findPoint) {
            points.push([findPoint.x, findPoint.y])
          }
        })
        i.lineString = createLine(points);
      })
      const names = [];
      const points: KeyPoint[] = [];
      svgPath.value.forEach(svg => {
        names.push(...svg.positionPoint.AI, ...svg.positionPoint.SVG)
        svg.positionPoint.AI.forEach(aipoint =>{
          const point = allPoints.value.find(i => i.landmark === aipoint);
          if(point) {
            points.push(point)
          }
        })
        svg.positionPoint.SVG.forEach(aipoint =>{
          const point = allPoints.value.find(i => i.landmark === aipoint)
          if(point) {
            points.push(point)
          }
        })
      })
      toothKeyPoint.value =JSON.parse(JSON.stringify(points))
      svgPath.value.forEach(svg=> {
        const roundPoints: Point[] = [];
        const centerPoints: Point[] = [];
        svg.roundPoint.names.forEach(name => {
          const findPoint = allPoints.value.find(item => item.landmark === name);
          if(findPoint) {
            roundPoints.push([findPoint.x, findPoint.y])
          }
        })
        svg.centerPoint.names.forEach(name => {
          const findPoint = allPoints.value.find(item => item.landmark === name);
          if(findPoint) {
            centerPoints.push([findPoint.x, findPoint.y])
          }
        })
        svg.roundPoint.dString = createLine(roundPoints, d3.curveCatmullRom.alpha(1));
        svg.centerPoint.dString = createLine(centerPoints, d3.curveCatmullRom.alpha(1));
      })
    }
  },
  {
    deep: true,
  }
)
watch(
  () => controPointsValue.value,
  () => {
    console.log('watch')
    clearDrag(".contro_points");
    nextTick(() => {
      addDrag(".contro_points", controPointsValue.value,onDrag)
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