<template>
  <div>
    <svg
      width="672"
      height="576"
    >
      <g>
        <image
          href="/img/test.jpeg"
        />
        <g class="lines" />
        <g class="points" />
      </g>
    </svg>
    <div class="sidebar">
      <div class="header">
        D3 CURVE EXPLORER
      </div>
      <div
        v-for="(type, index) in curveTypes"
        :key="type.name"
        class="menu"
      >
        <div
          class="item"
          :style="{ backgroundColor: type.active ? colorScale(index) : '#fff', color: type.active ? '#fff' : '#444'}"
          @click="updateMenu(type)"
        >
          {{ type.name }}
        </div>
      </div>

      <div class="info">
        <span class="default">The JavaScript library <a href="https://d3js.org">D3</a> provides a number of <a href="https://github.com/d3/d3-shape#curves">curve types</a> to interpolate (or approximate) a set of points. Toggle each of the curve types using the buttons above. You can also add/remove/drag the points to change the shape of the curve.</span>
        <span class="text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3';
import { D3ZoomEvent, ZoomTransform } from 'd3';
import { onMounted, PropType, Ref, ref, watch } from 'vue';

type CurveData = {
  name:string;
  curve: d3.CurveFactory | d3.CurveBundleFactory;
  active: boolean;
  lineString: string | null;
  clear: boolean;
  info: string;
}
let curveTypes: Ref<CurveData[]> = ref([
  {name: 'curveLinear', curve: d3.curveLinear, active: true, lineString: '', clear: false, info: 'Interpolates the points using linear segments.'},
	{name: 'curveBasis', curve: d3.curveBasis, active: true, lineString: '', clear: true, info: 'Interpolates the start and end points and approximates the inner points using a B-spline.'},
	{name: 'curveBasisClosed', curve: d3.curveBasisClosed, active: false, lineString: '', clear: false, info: 'Uses a closed B-Spline to approximate the points.'},
	{name: 'curveBundle (ß=0)', curve: d3.curveBundle.beta(0), active: false, lineString: '', clear: true, info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is. If ß=0 the curve is straight.'},
	{name: 'curveBundle (ß=0.5)', curve: d3.curveBundle.beta(0.5), active: false, lineString: '', clear: false, info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is.'},
	{name: 'curveBundle (ß=1)', curve: d3.curveBundle.beta(1), active: false, lineString: '', clear: false, info: 'Same as curveBasis with the addition of a paramter ß which determines how close to a straight line the curve is. If ß=1 the curve is the same as curveBasis.'},
	{name: 'curveCardinal (tension=0)', curve: d3.curveCardinal.tension(0), active: false, lineString: '', clear: true, info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
	{name: 'curveCardinal (tension=0.5)', curve: d3.curveCardinal.tension(0.5), active: false, lineString: '', clear: false, info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
	{name: 'curveCardinal (tension=1)', curve: d3.curveCardinal.tension(1), active: false, lineString: '', clear: false, info: "Interpolates the points using a cubic B-spline. A tension parameter determines how 'taut' the curve is. As tension approaches 1 the segments become linear."},
	{name: 'curveCatmullRom (α=0)', curve: d3.curveCatmullRom.alpha(0), active: false, lineString: '', clear: true, info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=0 the parameterisation is uniform.'},
	{name: 'curveCatmullRom (α=0.5)', curve: d3.curveCatmullRom.alpha(0.5), active: false, lineString: '', clear: false, info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=0.5 the parameterisation is centripetal and self intersecting loops are avoided.'},
	{name: 'curveCatmullRom (α=1)', curve: d3.curveCatmullRom.alpha(1), active: false, lineString: '', clear: false, info: 'Similar to curveCardinal (tension=0) but with a parameter α that determines the parameterisation used to interpolate the points. If α=1 the parameterisation is chordal.'},
	{name: 'curveMonotoneX', curve: d3.curveMonotoneX, active: false, lineString: '', clear: true, info: 'Interpolates the points with a cubic spline which are monotonic (i.e. always increasing or always decreasing) in y.'},
	{name: 'curveMonotoneY', curve: d3.curveMonotoneY, active: false, lineString: '', clear: false, info: 'Interpolates the points with a cubic spline which are monotonic (i.e. always increasing or always decreasing) in x.'},
	{name: 'curveNatural', curve: d3.curveNatural, active: false, lineString: '', clear: true, info: 'Interpolates the points with a cubic spline with zero 2nd derivatives at the endpoints.'},
	{name: 'curveStep', curve: d3.curveStep, active: false, lineString: '', clear: true, info: 'Interpolates the points with alternating horizontal and vertical linear segments. The vertical segments lie midway between points.'},
	{name: 'curveStepAfter', curve: d3.curveStepAfter, active: false, lineString: '', clear: false, info: 'Interpolates the points with alternating horizontal and vertical linear segments. The y value changes after the x value.'},
	{name: 'curveStepBefore', curve: d3.curveStepBefore, active: false, lineString: '', clear: false, info: 'Interpolates the points with alternating horizontal and vertical linear segments. The y value changes before the x value.'}
])
let props = defineProps({
  img: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 672,
  },
  height: {
    type: Number,
    default: 576
  },
  points: {
    type: Array as PropType<[number,number][]>,
    default: () => {
      return []
    },
  },
})
const emit = defineEmits(['update:points']);
onMounted(()=> {
  drawLines();
  drawPoint();
  addZoom();
})
watch(
  ()=> props.points,
  () => {
    drawLines();
    drawPoint();
  }
  )
let lineGenerator =  d3.line();
let categoryScale = d3.scaleOrdinal(d3.schemeCategory10);
let lines: d3.Selection<SVGPathElement, CurveData, SVGGElement, number[]>;
let points: d3.Selection<SVGCircleElement, [number, number], SVGGElement, number[]>;
let startPoint:[number, number];
let startData:[number, number];
let pointIndex: number;
let transform: ZoomTransform;
function colorScale(d: number) {return d === 0 ? '#777' : categoryScale(d.toString());}
function drawLines() {
  curveTypes.value.forEach(i=> {
    if(i.active) {
      lineGenerator.curve(i.curve);
      i.lineString = lineGenerator(props.points);
    }
  })
  lines = d3.select<SVGGElement, number[]>('svg g.lines').selectAll<SVGPathElement, number[]>('path').data(curveTypes.value);
  lines.enter().append('path').merge(lines).attr('d', (d)=> d.lineString).style('stroke', (d, i)=> colorScale(i)).style('display', (d) => d.active ? "inline" :"none").style('fill', 'none')
  .on('mouseover', (event: MouseEvent,) => {
    (event.target as SVGPathElement).style.stroke = 'red';
    d3.select<SVGPathElement, number[]>((event.target as SVGPathElement)).raise();
  }).on('mouseout', (event: MouseEvent, data) => {
    let index = curveTypes.value.findIndex(i => i.name === data.name);
    (event.target as SVGPathElement).style.stroke = colorScale(index);
  })
}
const pointDrag = d3.drag<SVGCircleElement, [number, number]>().on('start', (e, data) => {
  startPoint = [e.sourceEvent.layerX, e.sourceEvent.layerY];
  pointIndex = props.points.findIndex(i => i[0] === data[0] && i[1] ===data[1]);
  startData = [data[0], data[1]]
}).on('drag', (event)=> {
  const moveDistance = [event.sourceEvent.layerX - startPoint[0], event.sourceEvent.layerY - startPoint[1]];
  let newPoint:[number, number] = [startData[0] + moveDistance[0] / transform.k, startData[1] + moveDistance[1] / transform.k];
  let newPoints = [...props.points];
  newPoints.splice(pointIndex, 1, newPoint);
  emit('update:points', newPoints);
})
function addZoom() {
  const svg = d3.select<SVGSVGElement, unknown>('svg');
  const g = d3.select('svg g');
  const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (e)=> {
    transform = e.transform
    g.attr('transform', transform.toString());
    g.style('stroke-width', 2 / Math.sqrt(transform.k))
  })
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}
function drawPoint() {
  points = d3.select<SVGGElement, number[]>('svg g.points').selectAll<SVGCircleElement, number[]>('circle').data([...props.points]);
  points.enter().append('circle').merge(points).attr('r',2).attr('cx', data => data[0] ).attr('cy', data => data[1]).call(pointDrag)
}
function updateMenu(curve: CurveData) {
  curve.active = !curve.active;
  drawLines();
}
</script>

<style lang="scss" scoped>

.sidebar {
	display: inline-block;
	position: relative;
	vertical-align: top;
	margin-top: 20px;
	width: 530px;
	color: #444;
  .header {
    font-size: 14px;
    font-weight: bold;
    text-align: right;
    color: #aaa;
    width: 100%;
  }
  .info {
    float: left;
    margin-top: 20px;
    line-height: 1.5em;
  }
}
  .menu .item {
    padding: 5px;
    border: 1px solid #ddd;
    margin: 4px 2px;
    float: left;
    cursor: pointer;
    border-radius: 8px;
    width: 160px;
    text-align: center;
  }
</style>