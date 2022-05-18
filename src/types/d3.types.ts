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