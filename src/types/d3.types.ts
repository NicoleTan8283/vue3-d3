import { Matrix } from "@/utils/matrix";

export type Point = [number, number];
export interface PointZ {
  x: number;
  y: number;
}
export interface KeyPoint extends PointZ {
  landmark: string;
  isActive?: boolean;
  distance?: number;
  contro?: boolean;
}
export type toothSvgType = {
  name: string;
  roundPoint: {
    names: string[]
    dString: string
  }
  centerPoint: {
    names: string[]
    dString: string
  }
  positionPoint: {
    AI: string[],
    SVG: string[],
  };
  matrix: Matrix;
}