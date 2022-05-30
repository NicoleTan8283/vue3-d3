export class Matrix {
  a = 0
  b = 0
  c = 0
  d = 0
  tx = 0
  ty = 0
  ta = 0
  tb = 0
  tc = 0
  td = 0
  swa = 1
  swy = 1
  constructor() {
    this.a = 1
    this.d = 1
    this.ta = this.a
    this.td = this.d
  }
  setAngle(angle: number) {
    const cosVal = Math.cos((angle * Math.PI) / 180);
    const sinVal = Math.sin((angle * Math.PI) / 180);
    this.a = this.swa * cosVal;
    this.b = this.swa * sinVal;
    this.c = this.swy * (-1 * sinVal)
    this.d = this.swy * cosVal
    this.ta = cosVal
    this.tb = sinVal
    this.tc = (-1 * sinVal)
    this.td = cosVal
  }
  setScale(sw = 1, sy = 1) {
    this.swa = sw;
    this.swy = sy;
    this.a = this.ta * sw;
    this.d = this.td * sw;
    this.b = this.tb * sy;
    this.c = this.tc * sy;
  }
  setPostion(tx: number, ty: number) {
    this.tx = tx;
    this.ty = ty;
  }
  toString() {
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
  }
  toMatrix() {
    return [this.a, this.b, this.c, this.d, this.tx, this.ty]
  }
  toMatrix3() {
    return [this.a, this.b, 0, this.c, this.d, 0, this.tx, this.ty, 1]
  }
  setAngleBy(angle:number, centerX:number , centerY: number) {
    const cosVal = Math.cos((angle * Math.PI) / 180);
    const sinVal = Math.sin((angle * Math.PI) / 180);
    const rVal = Math.sqrt(centerX * centerX + centerY * centerY);
    const rangeVal = (Math.asin(centerY / rVal) * 180) / Math.PI;
    const newRangeVal = rangeVal + Number(angle);
    const positionX = Math.cos((newRangeVal * Math.PI) / 180) * rVal;
    const positionY = Math.sin((newRangeVal * Math.PI) / 180) * rVal;
    this.a = cosVal;
    this.b = sinVal;
    this.c = -sinVal;
    this.d = cosVal;
    this.tx = centerX - positionX;
    this.ty = centerY - positionY;
  }
  addPosition(positionX: number, positionY: number) {
    this.tx = this.tx + positionX;
    this.ty = this.ty + positionY;
  }
}