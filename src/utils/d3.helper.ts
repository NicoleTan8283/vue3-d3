import * as d3 from 'd3';
import { D3ZoomEvent } from 'd3';
import { Point } from '@/types/d3.types';
/**
 * 对父元素添加缩放拖住监听，并设置子元素的tranform为对应的矩阵
 * @param parentElement 缩放拖拽监听的父元素
 * @param childElement 缩放的元素
 * @param callback 缩放事件回调
 */
export function addZoom<DataType>(parentElement: string, childElement: string, callback?: (e: D3ZoomEvent<HTMLElement,unknown>, data?: DataType) => void) {
  const svg = d3.select<HTMLElement, unknown>(parentElement);
  const g = d3.select(childElement);
  const zoom = d3.zoom<HTMLElement, unknown>().on('zoom', (e: D3ZoomEvent<HTMLElement, unknown>)=> {
    const { transform } = e;
    if(callback) {
      callback(e)
    }
    g.attr('transform', transform.toString());
    g.style('stroke-width', 2 / Math.sqrt(transform.k))
  });
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}
/**
 * 恢复缩放初始位置和缩放默认大小
 * @param select 拖拽监听的父元素
 * @param zoomSelect 缩放的元素
 * @param width 缩放的宽度，d3设置translateTo(0,0)是回到宽高的一半
 * @param height 缩放的高度，d3设置translateTo(0,0)是回到宽高的一半
 */
export function resetZoom(select: string, zoomSelect: string, width = 0, height = 0) {
  const selector = d3.select<HTMLElement, unknown>(select);
  const zoomSelector = d3.select(zoomSelect);
  const zoom = d3.zoom<HTMLElement, unknown>();
  zoom.scaleTo(selector, 1);
  zoom.translateTo(selector, width / 2,height / 2);
  const transform = d3.zoomTransform(selector.node() as HTMLElement);
  zoomSelector.attr('transform',transform.toString())
}
/**
 * 使用d3.curveBundle.bata(0.5)生成svg线
 * @param points 点位数组
 * @returns 返回线的path的d值
 */
export function createLine(points: [Point]): string {
  const lineGenerator = d3.line();
  const curve = d3.curveBundle.beta(0.5);
  lineGenerator.curve(curve);
  return lineGenerator(points) || "";
}
/**
 * 计算任意两直线的角度
 * @param point1 直线1点1
 * @param point2 直线1点2
 * @param point3 直线2点1
 * @param point4 直线2点2
 * @returns 返回两条直线相交的角度
 */
export function getAngle(point1: Point, point2:Point, point3:Point, point4:Point): number {
  const evA = [point2[0] - point1[0], point2[1] - point1[1]];
  const evALength = Math.sqrt(Math.pow(evA[0], 2) + Math.pow(evA[1], 2));
  const evB = [point4[0] - point3[0], point4[1] - point3[1]];
  const evBLength = Math.sqrt(Math.pow(evB[0], 2) + Math.pow(evB[1], 2));
  const dotProduct = evA[0] * evB[0] + evA[1] * evB[1];
  const angle = Math.acos(dotProduct / (evALength * evBLength)) * 180 / Math.PI;
  return angle;
}

/**
 * 传入两个点构成的线数组和两个点构成的标尺数据以及标尺长度计算线长度返回
 * @param line 两个点组成的线数组
 * @param ruler 标尺点数组
 * @param biaochi 标尺长度
 * @returns 线长度
 */
export function getLineLength(line: [Point, Point], ruler: [Point, Point], biaochi: number) {
  const evLine = [line[1][0] - line[0][0], line[1][1] - line[0][1]];
  const evRuler = [ruler[1][0] - ruler[0][0], ruler[1][1] - ruler[0][1]];
  const lineLength = Math.sqrt(Math.pow(evLine[0], 2) + Math.pow(evLine[1], 2));
  const rulerLength = Math.sqrt(Math.pow(evRuler[0], 2) + Math.pow(evRuler[1], 2));
  return lineLength / rulerLength * biaochi;
}