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

export function getAngle(point1: Point, point2:Point, point3:Point, point4:Point): number {
  return 1;
}