import * as d3 from 'd3';
import { D3ZoomEvent } from 'd3';
export function addZoom<DataType>(parentElement: string, childElement: string, callback: (e: D3ZoomEvent<HTMLElement,unknown>, data?: DataType) => void) {
  const svg = d3.select<HTMLElement, unknown>(parentElement);
  const g = d3.select(childElement);
  const zoom = d3.zoom<HTMLElement, unknown>().on('zoom', (e: D3ZoomEvent<HTMLElement, unknown>)=> {
    const { transform } = e;
    callback(e)
    g.attr('transform', transform.toString());
    g.style('stroke-width', 2 / Math.sqrt(transform.k))
  })
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}