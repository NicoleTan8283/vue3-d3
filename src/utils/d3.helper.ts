import * as d3 from 'd3';
import {  D3ZoomEvent, ZoomTransform } from 'd3';
import { KeyPoint, Point, PointZ } from '@/types/d3.types';
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
export function resetZoom(select: string, zoomSelect: string, width = 0, height = 0, fWidth = 0, fHeight = 0) {
  const selector = d3.select<HTMLElement, unknown>(select);
  const zoomSelector = d3.select(zoomSelect);
  const zoom = d3.zoom<HTMLElement, unknown>();
  const scale = Math.min(fWidth / width, fHeight / height);
  zoom.scaleTo(selector, scale);
  zoom.translateTo(selector, width / 2,height / 2);
  const transform = d3.zoomTransform(selector.node() as HTMLElement);
  zoomSelector.attr('transform',transform.toString())
}
/**
 * 使用d3.curveBundle.bata(0.5)生成svg线
 * @param points 点位数组
 * @returns 返回线的path的d值
 */
export function createLine(points: Point[], curve:d3.CurveFactory | d3.CurveFactoryLineOnly = d3.curveNatural): string {
  const lineGenerator = d3.line();
  lineGenerator.curve(curve);
  return lineGenerator(points) || "";
}
/**
 * 计算任意两直线的角度,默认返回角度范围[0, 180]，若需返回360度的角度返回请传递参数range360,并且线的两个点位顺序为起始点，结束点
 * @param point1 直线1点1
 * @param point2 直线1点2
 * @param point3 直线2点1
 * @param point4 直线2点2
 * @param range360 范围得角度范围是否为[0, 360]
 * @returns 返回两条直线相交的角度
 */
export function getAngle(point1: PointZ, point2:PointZ, point3:PointZ, point4:PointZ, range360 = false): number {
  const evA = [point2.x - point1.x, point2.y - point1.y];
  const evALength = Math.sqrt(Math.pow(evA[0], 2) + Math.pow(evA[1], 2));
  const evB = [point4.x - point3.x, point4.y - point3.y];
  const evBLength = Math.sqrt(Math.pow(evB[0], 2) + Math.pow(evB[1], 2));
  const dotProduct = evA[0] * evB[0] + evA[1] * evB[1];
  const angle = Math.acos(dotProduct / (evALength * evBLength)) * 180 / Math.PI;
  if(!range360) {
    return angle;
  } else {
    return evA[0] * evB[1] - evA[1] * evB[0] > 0 ? angle : 360 - angle
  }
}

/**
 * 传入两个点构成的线数组和两个点构成的标尺数据以及标尺长度计算线长度返回，如果不传入标尺长度则返回点位距离
 * @param line 两个点组成的线数组
 * @param ruler 标尺点数组
 * @param biaochi 标尺长度
 * @returns 线长度
 */
export function getLineLength(point1: PointZ | KeyPoint, point2: PointZ | KeyPoint, biaochi?: number) {
  const vectorLength = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
  return biaochi ? vectorLength * biaochi : vectorLength;
}

/**
 * 返回点位经过d3旋转拖拽后的真实坐标
 * @param point 屏幕坐标
 * @param transform d3旋转矩阵
 * @returns 返回点位的真实坐标
 */
export function getTruePoint(point: Point, transform: ZoomTransform): Point {
  return [(point[0] - transform.x) / transform.k, (point[1] - transform.y) / transform.k]
}

/**
 * 添加点击和移动事件，返回对应点位
 * @param select 选择器
 * @param callback 回调函数
 */
export function addClickAndMove(select: string,callback:(type: 'click' | 'move', points: Point) => void) {
  const selector = d3.select(select);
  selector.on('click', (event: MouseEvent)=> {
    back(event, 'click');
  }).on('mousemove', (event: MouseEvent) => {
    back(event, 'move');
  })
  function back(event: MouseEvent, type: 'click' | 'move') {
    const point = d3.pointer(event);
    callback(type, point)
  }
}
export function clearDistace(select: string) {
  const selector = d3.select(select);
  selector.on('click', null).on('mousemove', null);
}

/**
 * 给指定的选择器dom添加拖拽事件
 * @param select 需要添加拖拽的选择器
 * @param data 数据
 * @param callback 回调函数
 */
export function addDrag(select: string,data: any[], callback:(type: 'start' | 'drag' | 'end', event: any, d: any) => void) {
  
  const drag = d3.drag()
  .on('start',(event, d)=> {
    callback('start', event, d)
    })
	.on('drag', function(event, d) {
    callback('drag', event, d)
	})
  .on('end', function(event ,d) {
    callback('end', event, d)
  })
  const selector = d3.selectAll<Element, unknown>(select).data(data);
  selector.call(drag)
}

/**
 * 清除拖拽
 * @param select 清除drag的选择器
 */
export function clearDrag(select: string) {
  const drag = d3.drag()
  .on('start',null)
	.on('drag', null)
  const selector = d3.selectAll<Element, unknown>(select);
  selector.call(drag)
}
/**
 * 点运用矩阵变换
 * @param point 点
 * @param matrix 矩阵
 */
export function pointUseMatrix(point: PointZ | KeyPoint, matrix: number[]): PointZ {
  const transformPoint: PointZ = {x:matrix[0] * point.x + matrix[2] * point.y + matrix[4], y: matrix[1] * point.x + matrix[3] * point.y + matrix[5]}
  return transformPoint
}
