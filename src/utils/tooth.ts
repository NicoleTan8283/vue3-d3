import { KeyPoint, toothSvgType } from "@/types/d3.types";
import { getAngle, getLineLength } from "./d3.helper";
import { mat3 } from 'gl-matrix'
import { useMatrixs } from "./matrix";
export const UptoothPoint: KeyPoint[] = [
  {
      "x": 95.40691584465425,
      "y": 91.12422695643689,
      "landmark": "Ubsd"
  },
  {
      "x": 83.8605692327997,
      "y": 90.34967083311504,
      "landmark": "Utc_1"
  },
  {
      "x": 73.57862610286207,
      "y": 95.93286584236431,
      "landmark": "Utc_2"
  },
  {
      "x": 61.917679255606316,
      "y": 103.93696244542805,
      "landmark": "Utc_3"
  },
  {
      "x": 47.60230949234322,
      "y": 105.09006531661272,
      "landmark": "Utc_4"
  },
  {
      "x": 40.737363482305106,
      "y": 106.06573271584716,
      "landmark": "Ulsd"
  },
  {
      "x": 40.921609825068984,
      "y": 112.25763776776968,
      "landmark": "Ut_1"
  },
  {
      "x": 43.07661785384998,
      "y": 118.82921096575704,
      "landmark": "Ut_2"
  },
  {
      "x": 48.427126491811855,
      "y": 126.91424048987069,
      "landmark": "Ut_3"
  },
  {
      "x": 56.73940784953675,
      "y": 130.29608051486113,
      "landmark": "Ut_4"
  },
  {
      "x": 67.17985271712645,
      "y": 136.4497040633179,
      "landmark": "Ut_5"
  },
  {
      "x": 77.760578199533,
      "y": 147.99672662844947,
      "landmark": "Ut_6"
  },
  {
      "x": 83.98844178019124,
      "y": 160.17094160964683,
      "landmark": "Ut_7"
  },
  {
      "x": 87.27472681332162,
      "y": 166.40335481086456,
      "landmark": "Ut_8"
  },
  {
      "x": 99,
      "y": 171,
      "landmark": "UtI"
  },
  {
      "x": 103.81135944953006,
      "y": 161.45412554425116,
      "landmark": "Ut_9"
  },
  {
      "x": 106.43217383689911,
      "y": 143.6523865064697,
      "landmark": "Ut_10"
  },
  {
      "x": 106.51342230312486,
      "y": 128.5294806915294,
      "landmark": "UFa"
  },
  {
      "x": 102.48811383427433,
      "y": 110.60093955066476,
      "landmark": "Ut_12"
  },
  {
      "x": 99.20628390821601,
      "y": 98.17598091830378,
      "landmark": "Ut_13"
  },
  {
      "x": 89.62828591493307,
      "y": 80.60876472879117,
      "landmark": "Ut_14"
  },
  {
      "x": 75.81190138575778,
      "y": 63.234804508750514,
      "landmark": "Ut_15"
  },
  {
      "x": 65.44122001655633,
      "y": 49.88328042418162,
      "landmark": "Ut_16"
  },
  {
      "x": 55.07053864735487,
      "y": 36.53175633961274,
      "landmark": "Ut_17"
  },
  {
      "x": 33.57868000267739,
      "y": 10.619230075791702,
      "landmark": "Ut_18"
  },
  {
      "x": 16,
      "y": 5,
      "landmark": "Utr"
  },
  {
      "x": 9.043029875080677,
      "y": 15.88381366776815,
      "landmark": "Ut_19"
  },
  {
      "x": 9.113762310942867,
      "y": 28.47541825777621,
      "landmark": "Ut_20"
  },
  {
      "x": 19.662046331133013,
      "y": 58.52781101602688,
      "landmark": "Ut_21"
  },
  {
      "x": 36.30455233321559,
      "y": 95.61776239158372,
      "landmark": "Ut_22"
  },
]


export const lowtoothPoint: KeyPoint[] = [
  {
      "x": 100.63590037748861,
      "y": 82.63426917745387,
      "landmark": "Lbsd"
  },
  {
      "x": 89.79517834945115,
      "y": 81.58214879006962,
      "landmark": "Ltc_1"
  },
  {
      "x": 80.62241178064092,
      "y": 78.16000185317114,
      "landmark": "Ltc_2"
  },
  {
      "x": 72.30711167574083,
      "y": 68.65657156175973,
      "landmark": "Ltc_3"
  },
  {
      "x": 65.2847819417118,
      "y": 61.04670422724171,
      "landmark": "Ltc_4"
  },
  {
      "x": 53.96547821154611,
      "y": 60.74896342759586,
      "landmark": "Llsd"
  },
  {
      "x": 44.853242849543555,
      "y": 78.85973713997159,
      "landmark": "Lt_1"
  },
  {
      "x": 35.69075677156687,
      "y": 101.21095569734968,
      "landmark": "Lt_2"
  },
  {
      "x": 25.830252379186845,
      "y": 117.6992050518167,
      "landmark": "Lt_3"
  },
  {
      "x": 15.631060630622517,
      "y": 140.18224835261637,
      "landmark": "Lt_4"
  },
  {
      "x": 13.972658922758225,
      "y": 157.50280859577046,
      "landmark": "Lt_5"
  },
  {
      "x": 18.545908411741408,
      "y": 162.73346924972128,
      "landmark": "Ltr"
  },
  {
      "x": 28.708949520172492,
      "y": 162.57911752852075,
      "landmark": "Lt_6"
  },
  {
      "x": 43.18704833393353,
      "y": 152.68858614808994,
      "landmark": "Lt_7"
  },
  {
      "x": 61.98020485302454,
      "y": 133.06187510842875,
      "landmark": "Lt_8"
  },
  {
      "x": 72.76152176143047,
      "y": 120.5619446649535,
      "landmark": "Lt_9"
  },
  {
      "x": 88.84694927370977,
      "y": 100.1952888669783,
      "landmark": "Lt_10"
  },
  {
      "x": 107.921204726642,
      "y": 70.38603508640747,
      "landmark": "Lt_11"
  },
  {
      "x": 116.12219132466805,
      "y": 49.02301460408331,
      "landmark": "LFa"
  },
  {
      "x": 118.87867443370735,
      "y": 36.737213217068714,
      "landmark": "Lt_13"
  },
  {
      "x": 120.80540535380267,
      "y": 25.079485910214622,
      "landmark": "Lt_14"
  },
  {
      "x": 116.98106476667292,
      "y": 12.026599005059683,
      "landmark": "LtI"
  },
  {
      "x": 111.50137705680991,
      "y": 10.37409729801513,
      "landmark": "Lt_15"
  },
  {
      "x": 103.70373526986599,
      "y": 15.265783242828597,
      "landmark": "Lt_16"
  },
  {
      "x": 94.98479887071808,
      "y": 26.835635958509833,
      "landmark": "Lt_17"
  },
  {
      "x": 83.00925870958649,
      "y": 39.03221262291277,
      "landmark": "Lt_18"
  },
  {
      "x": 68.55687231296,
      "y": 46.679267455434754,
      "landmark": "Lt_19"
  },
]


export function getToothMatrix(allPoints: KeyPoint[], AIPoints: string[], ToothPoints: string[]): mat3 {
  let matrix = mat3.create();
  const AIpoint1 = allPoints.find(i => i.landmark === AIPoints[0]);
  const AIpoint2 = allPoints.find(i => i.landmark === AIPoints[1]);
  const ToothPoint1 = allPoints.find(i => i.landmark === ToothPoints[0]);
  const ToothPoint2 = allPoints.find(i => i.landmark === ToothPoints[1]);
  if(AIpoint1 && AIpoint2 && ToothPoint1 && ToothPoint2) {
    // const beforeMatrix =  new Matrix().addPosition(-ToothPoint1.x, -ToothPoint1.y);
    const beforeMatrix = mat3.translate(mat3.create(), mat3.create(), [-ToothPoint1.x, -ToothPoint1.y])
    const afterMatrix = mat3.translate(mat3.create(), mat3.create(), [AIpoint1.x, AIpoint1.y])
    console.log(beforeMatrix)
    // console.log(afterMatrix)
    const toothDistance = getLineLength(ToothPoint1, ToothPoint2);
    const pointDistance = getLineLength(AIpoint1, AIpoint2);
    const toothSc = pointDistance / toothDistance;
    const angle = getAngle(ToothPoint1, ToothPoint2, AIpoint1, AIpoint2, true)
    // const angleXtoKeyline = getAngle({x:0, y:0}, {x:1, y:0}, AIpoint1, AIpoint2, true)
    if(angle) {
      const scaleMatrix = mat3.scale(mat3.create(), mat3.create(), [toothSc, toothSc]);
      // console.log(scaleMatrix)
      const angleMatrix = mat3.rotate(mat3.create(), mat3.create(), (angle * Math.PI) / 180);
      // console.log('angleMatrix :>> ', angleMatrix);
      // const angleMatrix = new Matrix().setAngle(angle);
      // const angleByToxMatrix = new Matrix().setAngle(-angleXtoKeyline);
      // const angleByFromxMatrix = new Matrix().setAngle(angleXtoKeyline);
      // const scaleXMatrix = new Matrix().setScale(toothSc,toothSc);
      // const scaleMatrix = new Matrix().MultplyMatrix(angleByToxMatrix).MultplyMatrix(scaleXMatrix).MultplyMatrix(angleByFromxMatrix);
      // beforeMatrix.MultplyMatrix(scaleMatrix).MultplyMatrix(angleMatrix).MultplyMatrix(afterMatrix);
      // const lastMatrix = new Matrix().MultplyMatrix(beforeMatrix).MultplyMatrix(scaleMatrix).MultplyMatrix(angleMatrix).MultplyMatrix(afterMatrix)
      matrix = useMatrixs([beforeMatrix,scaleMatrix, angleMatrix,afterMatrix])
    }
  }
  return matrix;
}
