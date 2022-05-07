/**
 * 将svg Dom转为图片后下载，如果svg Dom 有image标签，请确保image标签的href属性为图片的base64编码
 * @param svgSelector svg DOM 选择器
 * @param width 图片宽度
 * @param height 图片高度
 * @param name 图片名称
 */
export function downloadSvg(svgSelector: string, width: number, height:number, name= '未命名') {
  const svg = document.querySelector(svgSelector);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const svgData = (new XMLSerializer()).serializeToString(svg as SVGSVGElement);
  const DOMURL = window.URL || window.webkitURL || window;
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8'});
  const url = DOMURL.createObjectURL(svgBlob);
  img.onload = function() {
    (ctx as CanvasRenderingContext2D ).drawImage(img,0,0);
    DOMURL.revokeObjectURL(url);
    const imgUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const a = document.createElement('a');
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
    a.setAttribute('download', `${name}.png`);
    a.setAttribute('href', imgUrl);
    a.setAttribute('target', '_blank');
    a.dispatchEvent(evt)
  }
  img.src = url;
}