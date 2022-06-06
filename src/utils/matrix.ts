import { mat3, ReadonlyMat3, ReadonlyVec2 } from "gl-matrix";
import { matrixMultplyMatrix } from "./vtoLineHelp";

export function useMatrixs(matrixs: ReadonlyMat3[]) {
  let outMatrix: mat3 = mat3.create();
  matrixs.forEach(matrix => {
    outMatrix = matrixMultplyMatrix(matrix, outMatrix)
    console.log('outMatrix :>> ', outMatrix);
  })
  return outMatrix;
}


export function matrixToTransform(matrix: ReadonlyMat3) {
  return `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[3]}, ${matrix[4]}, ${matrix[6]}, ${matrix[7]})`
}

export function rotateByPoint(rad: number, v: ReadonlyVec2) {
  const beforeMoveMatrix = mat3.translate(mat3.create(), mat3.create(), [-v[0], -v[1]])
  const rotateMatrix = mat3.rotate(mat3.create(), beforeMoveMatrix, (rad * Math.PI) / 180);
  const afterMoveMatrix = mat3.translate(mat3.create(), rotateMatrix, v);
  return afterMoveMatrix;
}