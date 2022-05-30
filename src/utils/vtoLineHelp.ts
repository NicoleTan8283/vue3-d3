import { KeyPoint, PointZ } from "@/types/d3.types"
import { Transform } from "@/utils/transform";
/**
* 特征的初始化时计算一些划线用点
*/
export function calculationInitPoints(uuid: string, points: KeyPoint[]) {
   function getTrans(def0:PointZ, def1:PointZ, range0:PointZ, range1:PointZ) {
       const domain = [],
           range = []
       domain.push([def0.x, def0.y])
       domain.push([def1.x, def1.y])
       range.push([range0.x, range0.y])
       range.push([range1.x, range1.y])
       return estimate(domain, range)
   }

   //计算 Ptm、Pt 区域的5个点
   if (arrayObjectIndexOf(points, 'Pt1', 'landmark') == -1) {
       const ptm_def = { x: 497, y: 595 }
       const pt1_def = { x: 489, y: 536 }
       const pt_def = { x: 482, y: 478 }
       const pt2_def = { x: 510, y: 458 }
       const pt3_def = { x: 499, y: 536 }
       const ptP = point(points, 'Pt')
       const ptmP = point(points, 'Ptm')

       const ptTrans = getTrans(pt_def, ptm_def, ptP, ptmP)
       const pt1P = ptTrans.transform([pt1_def.x, pt1_def.y])
       const pt2P = ptTrans.transform([pt2_def.x, pt2_def.y])
       const pt3P = ptTrans.transform([pt3_def.x, pt3_def.y])

       editorPoints(points, 'Pt1', pt1P[0], pt1P[1])
       editorPoints(points, 'Pt2', pt2P[0], pt2P[1])
       editorPoints(points, 'Pt3', pt3P[0], pt3P[1])
   }

   //计算 眼眶结构 区域的点
   if (arrayObjectIndexOf(points, 'Or0', 'landmark') == -1) {
       const Or0_def = { x: 667.6470588235294, y: 218.90660592255125 }
       const Eye_def = { x: 659.4117647058823, y: 250.0949126803341 }
       const Or1_def = { x: 661.8235294117648, y: 290.0485952923311 }
       const Or_def = { x: 691.7647058823529, y: 313.05998481397114 }
       const Or2_def = { x: 709.1176470588235, y: 299.81776765375855 }

       const eyeP = point(points, 'eye')
       const OrP = point(points, 'Or')

       const eyeTrans = getTrans(Eye_def, Or_def, eyeP, OrP)
       const Or0 = eyeTrans.transform([Or0_def.x, Or0_def.y])
       const Or1 = eyeTrans.transform([Or1_def.x, Or1_def.y])
       const Or2 = eyeTrans.transform([Or2_def.x, Or2_def.y])

       editorPoints(points, 'Or0', Or0[0], Or0[1])
       editorPoints(points, 'Or1', Or1[0], Or1[1])
       editorPoints(points, 'Or2', Or2[0], Or2[1])
   }

   function usePointsTransOw(def1: PointZ, def2: PointZ, point1: PointZ, point2: PointZ, points3: KeyPoint[]) {
       usePointsTrans(def1, def2, point1, point2, points3, points)
       // let tempanspns,
       //     trans = getTrans(def1, def2, point1, point2)
       // points.forEach((pos) => {
       //     tempanspns = trans.transform([pos.x, pos.y])
       //     editorPoints(
       //         points,
       //         pos.landmark,
       //         tempanspns[0],
       //         tempanspns[1]
       //     )
       // })
   }

   //兼容老旧特侦点检测，老数据没有这几个点
   if (!point(points, 'Skull1')) {
       const S0Ba2_def = { x: 633.046875, y: 242.0 }
       const S0Ba4_def = { x: 551.046875, y: 263.0 }
       const S0Ba5_def = {
           x: 530.3859755572149,
           y: 265.37744858685653,
       }
       const S0_def = { x: 523.9153873219208, y: 271.8480368221506 }
       const S0Ba6_def = { x: 524.6191671620244, y: 288.6086969790251 }
       const S0Ba7_def = { x: 502.046875, y: 297.0 }
       const S0Ba8_def = {
           x: 488.71332804361975,
           y: 285.16666412353516,
       }
       const S0Ba9_def = { x: 494.04687500000006, y: 266.0 }
       const S_def = { x: 508.1732, y: 281.2767 }
       const Na_def = { x: 797.2, y: 251 }

       const S0BaPoints1 = []
       S0BaPoints1.push({
           landmark: 'Skull1',
           x: S0Ba2_def.x,
           y: S0Ba2_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull2',
           x: S0Ba4_def.x,
           y: S0Ba4_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull3',
           x: S0Ba5_def.x,
           y: S0Ba5_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull4',
           x: S0_def.x,
           y: S0_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull5',
           x: S0Ba6_def.x,
           y: S0Ba6_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull6',
           x: S0Ba7_def.x,
           y: S0Ba7_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull7',
           x: S0Ba8_def.x,
           y: S0Ba8_def.y,
       })
       S0BaPoints1.push({
           landmark: 'Skull8',
           x: S0Ba9_def.x,
           y: S0Ba9_def.y,
       })

       const SP = point(points, 'S')
       const NA = point(points, 'Na')

       usePointsTransOw(S_def, Na_def, SP, NA, S0BaPoints1)
   }

   //计算 颅底结构 区域的点
   if (arrayObjectIndexOf(points, 'S0Ba0', 'landmark') == -1) {
       const S0Ba0_def = {
           x: 679.5248865466314,
           y: 222.18989381045364,
       }
       const S0Ba1_def = {
           x: 652.0466613769531,
           y: 235.16666412353513,
       }
       const S0Ba2_def = { x: 633.046875, y: 242.0 }
       const S0Ba3_def = { x: 589.546661376953, y: 252.66666412353513 }
       const S0Ba4_def = { x: 551.046875, y: 263.0 }
       const S0Ba5_def = {
           x: 530.3859755572149,
           y: 265.37744858685653,
       }
       const S_def = { x: 508.1732, y: 281.2767 }
       const Na_def = { x: 797.2, y: 251 }
       const S0_def = { x: 523.9153873219208, y: 271.8480368221506 }
       const S0Ba6_def = { x: 524.6191671620244, y: 288.6086969790251 }
       const S0Ba7_def = { x: 502.046875, y: 297.0 }
       const S0Ba8_def = {
           x: 488.71332804361975,
           y: 285.16666412353516,
       }
       const S0Ba9_def = { x: 494.04687500000006, y: 266.0 }
       const S0Ba10_def = {
           x: 484.5036226160384,
           y: 267.7303897633271,
       }
       const S0Ba11_def = {
           x: 469.54666137695307,
           y: 296.83333079020184,
       }
       const S0Ba12_def = {
           x: 429.56464607651424,
           y: 355.0885741555124,
       }
       const S0Ba13_def = {
           x: 392.08595070558516,
           y: 421.2813575608667,
       }
       const Ba_def = { x: 393.04687500000006, y: 451.0 }
       const S0Ba15_def = {
           x: 411.5624461454503,
           y: 433.02450741038587,
       }
       const S0Ba16_def = {
           x: 432.1506814395679,
           y: 415.3774485868565,
       }
       const S0Ba17_def = { x: 472.73891673368547, y: 389.49509564568 }
       const S0Ba17t_def = {
           x: 537.8799947102864,
           y: 369.3333307902018,
       }
       const S0Ba18_def = {
           x: 598.7133280436199,
           y: 335.16666412353516,
       }
       const S0Ba19_def = { x: 613.046875, y: 211.0 }
       const S0Ba20_def = {
           x: 667.7335364168176,
           y: 268.76617906713096,
       }
       const S0Ba21_def = {
           x: 652.8980269777082,
           y: 278.09957930210066,
       }
       const S0Ba22_def = {
           x: 623.7133280436198,
           y: 283.49999745686847,
       }

       //定上半部分位置
       const SP = point(points, 'S')
       const NA = point(points, 'Na')

       //加上 SP 定下半部分位置
       const BaP = point(points, 'Ba')

       const S0BaPoints1 = []
       // S0BaPoints1.push({ landmark: 'S0Ba0', x: S0Ba0_def.x, y: S0Ba0_def.y });
       // S0BaPoints1.push({ landmark: 'S0Ba1', x: S0Ba1_def.x, y: S0Ba1_def.y });
       // if (!point(points, 'Skull1')) S0BaPoints1.push({ landmark: 'Skull1', x: S0Ba2_def.x, y: S0Ba2_def.y });
       // S0BaPoints1.push({ landmark: 'S0Ba3', x: S0Ba3_def.x, y: S0Ba3_def.y });
       // if (!point(points, 'Skull2')) S0BaPoints1.push({ landmark: 'Skull2', x: S0Ba4_def.x, y: S0Ba4_def.y });
       // if (!point(points, 'Skull3')) S0BaPoints1.push({ landmark: 'Skull3', x: S0Ba5_def.x, y: S0Ba5_def.y });
       // if (!point(points, 'Skull4')) S0BaPoints1.push({ landmark: 'Skull4', x: S0_def.x, y: S0_def.y });
       // if (!point(points, 'Skull5')) S0BaPoints1.push({ landmark: 'Skull5', x: S0Ba6_def.x, y: S0Ba6_def.y });
       // if (!point(points, 'Skull6')) S0BaPoints1.push({ landmark: 'Skull6', x: S0Ba7_def.x, y: S0Ba7_def.y });
       // if (!point(points, 'Skull7')) S0BaPoints1.push({ landmark: 'Skull7', x: S0Ba8_def.x, y: S0Ba8_def.y });
       // if (!point(points, 'Skull8')) S0BaPoints1.push({ landmark: 'Skull8', x: S0Ba9_def.x, y: S0Ba9_def.y });
       S0BaPoints1.push({
           landmark: 'S0Ba10',
           x: S0Ba10_def.x,
           y: S0Ba10_def.y,
       })
       S0BaPoints1.push({
           landmark: 'S0Ba11',
           x: S0Ba11_def.x,
           y: S0Ba11_def.y,
       })
       // S0BaPoints1.push({
       //     landmark: 'S0Ba12',
       //     x: S0Ba12_def.x,
       //     y: S0Ba12_def.y,
       // })
       // S0BaPoints1.push({
       //     landmark: 'S0Ba13',
       //     x: S0Ba13_def.x,
       //     y: S0Ba13_def.y,
       // })
       // S0BaPoints1.push({ landmark: 'S0Ba19', x: S0Ba19_def.x, y: S0Ba19_def.y });
       // S0BaPoints1.push({ landmark: 'S0Ba20', x: S0Ba20_def.x, y: S0Ba20_def.y });
       // S0BaPoints1.push({ landmark: 'S0Ba21', x: S0Ba21_def.x, y: S0Ba21_def.y });
       // S0BaPoints1.push({ landmark: 'S0Ba22', x: S0Ba22_def.x, y: S0Ba22_def.y });

       const S0BaPoints2 = []
       S0BaPoints2.push({
           landmark: 'S0Ba13',
           x: S0Ba13_def.x,
           y: S0Ba13_def.y,
       })
       S0BaPoints2.push({
           landmark: 'S0Ba15',
           x: S0Ba15_def.x,
           y: S0Ba15_def.y,
       })
       S0BaPoints2.push({
           landmark: 'S0Ba16',
           x: S0Ba16_def.x,
           y: S0Ba16_def.y,
       })
       S0BaPoints2.push({
           landmark: 'S0Ba17',
           x: S0Ba17_def.x,
           y: S0Ba17_def.y,
       })
       S0BaPoints2.push({
           landmark: 'S0Ba17t',
           x: S0Ba17t_def.x,
           y: S0Ba17t_def.y,
       })
       S0BaPoints2.push({
           landmark: 'S0Ba18',
           x: S0Ba18_def.x,
           y: S0Ba18_def.y,
       })

       const S0BaPoints3 = []
       S0BaPoints3.push({
           landmark: 'S0Ba0',
           x: S0Ba0_def.x,
           y: S0Ba0_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba1',
           x: S0Ba1_def.x,
           y: S0Ba1_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba3',
           x: S0Ba3_def.x,
           y: S0Ba3_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba19',
           x: S0Ba19_def.x,
           y: S0Ba19_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba20',
           x: S0Ba20_def.x,
           y: S0Ba20_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba21',
           x: S0Ba21_def.x,
           y: S0Ba21_def.y,
       })
       S0BaPoints3.push({
           landmark: 'S0Ba22',
           x: S0Ba22_def.x,
           y: S0Ba22_def.y,
       })

       const S0BaPoints4 = []
       S0BaPoints4.push({
           landmark: 'S0Ba12',
           x: S0Ba12_def.x,
           y: S0Ba12_def.y,
       })

       usePointsTransOw(S_def, Na_def, SP, NA, S0BaPoints1)
       usePointsTransOw(S_def, Ba_def, SP, BaP, S0BaPoints2)

       const S0Ba11_n = point(points, 'S0Ba11')
       const S0Ba13_n = point(points, 'S0Ba13')
       usePointsTransOw(
           S0Ba11_def,
           S0Ba13_def,
           S0Ba11_n,
           S0Ba13_n,
           S0BaPoints4
       )
       const skull2 = point(points, 'Skull2')
       const skull1 = point(points, 'Skull1')
       usePointsTransOw(S0Ba4_def, S0Ba2_def, skull2, skull1, S0BaPoints3)
   }

   //上颌骨形态模板
   if (arrayObjectIndexOf(points, 'maxilla__2', 'landmark') == -1) {
       const PNS_def = { x: 110, y: 196 }
       const maxilla_1_def = { x: 186, y: 182 }
       const maxilla_2_def = { x: 277, y: 181 }
       const maxilla_3_def = { x: 378, y: 196 }
       const maxilla_4_def = { x: 508, y: 221 }
       // const maxilla_5_def = {x : 544, y : 220};
       const maxilla_6_def = { x: 600, y: 223 }
       const maxilla_7_def = { x: 670, y: 206 }
       // const maxilla_8_def = {x : 700, y : 184};
       const maxilla_9_def = { x: 732, y: 180 }
       const maxilla_10_def = { x: 760, y: 205 }
       // const maxilla_11_def = {x : 794, y : 208};
       const maxilla_12_def = { x: 800, y: 225 }
       const maxilla_13_def = { x: 841, y: 237 }
       // const maxilla_14_def = {x : 867, y : 233};
       const ANS_def = { x: 887, y: 243 }

       const mo3 = point(points, 'maxilla_outline_3')
       const PNS = point(points, 'PNS')
       const ANS = point(points, 'ANS')

       const AnsPnsPoints1 = []
       AnsPnsPoints1.push({
           landmark: 'maxilla__1',
           x: maxilla_1_def.x,
           y: maxilla_1_def.y,
       })
       AnsPnsPoints1.push({
           landmark: 'maxilla__2',
           x: maxilla_2_def.x,
           y: maxilla_2_def.y,
       })
       AnsPnsPoints1.push({
           landmark: 'maxilla__3',
           x: maxilla_3_def.x,
           y: maxilla_3_def.y,
       })
       AnsPnsPoints1.push({
           landmark: 'maxilla__4',
           x: maxilla_4_def.x,
           y: maxilla_4_def.y,
       })
       // AnsPnsPoints1.push({landmark: 'maxilla__5', x: maxilla_5_def.x, y: maxilla_5_def.y});
       AnsPnsPoints1.push({
           landmark: 'maxilla__6',
           x: maxilla_6_def.x,
           y: maxilla_6_def.y,
       })
       AnsPnsPoints1.push({
           landmark: 'maxilla__7',
           x: maxilla_7_def.x,
           y: maxilla_7_def.y,
       })
       // AnsPnsPoints1.push({landmark: 'maxilla__8', x: maxilla_8_def.x, y: maxilla_8_def.y});

       const AnsPnsPoints2 = []
       AnsPnsPoints2.push({
           landmark: 'maxilla__10',
           x: maxilla_10_def.x,
           y: maxilla_10_def.y,
       })
       // AnsPnsPoints2.push({landmark: 'maxilla__11', x: maxilla_11_def.x, y: maxilla_11_def.y});
       AnsPnsPoints2.push({
           landmark: 'maxilla__12',
           x: maxilla_12_def.x,
           y: maxilla_12_def.y,
       })
       AnsPnsPoints2.push({
           landmark: 'maxilla__13',
           x: maxilla_13_def.x,
           y: maxilla_13_def.y,
       })
       // AnsPnsPoints2.push({landmark: 'maxilla__14', x: maxilla_14_def.x, y: maxilla_14_def.y});

       usePointsTransOw(PNS_def, maxilla_9_def, PNS, mo3, AnsPnsPoints1)
       usePointsTransOw(maxilla_9_def, ANS_def, mo3, ANS, AnsPnsPoints2)
       // let tempanspns;
       // let anspnsTrans1 = getTrans(PNS_def, maxilla_9_def, PNS, mo3);
       // AnsPnsPoints1.forEach(pos => {
       //     tempanspns = anspnsTrans1.transform([pos.x, pos.y]);
       //     editorPoints(points, pos.landmark, tempanspns[0], tempanspns[1]);
       // });

       // let anspnsTrans2 = getTrans(maxilla_9_def, ANS_def, mo3, ANS);
       // AnsPnsPoints2.forEach(pos => {
       //     tempanspns = anspnsTrans2.transform([pos.x, pos.y]);
       //     editorPoints(points, pos.landmark, tempanspns[0], tempanspns[1]);
       // });

       //计算 maxilla__6 PNS maxilla_outline_8 夹角，如果太小会向上移动 maxilla_outline_3，然后重新计算模板
       const myLPNS = point(points, 'PNS')
       const mypatten4 = point(points, 'maxilla__6')
       const mypatten4dir = [mypatten4.x - myLPNS.x, mypatten4.y - myLPNS.y]

       const myL8 = point(points, 'maxilla_outline_8')
       const myL8dir = [myL8.x - myLPNS.x, myL8.y - myLPNS.y]
       const mypatten4norm1 = Math.sqrt(
           mypatten4dir[0] * mypatten4dir[0] +
           mypatten4dir[1] * mypatten4dir[1]
       )
       const myL8dirnorm1 = Math.sqrt(
           myL8dir[0] * myL8dir[0] + myL8dir[1] * myL8dir[1]
       )
       const cosmy =
           (mypatten4dir[0] * myL8dir[0] + mypatten4dir[1] * myL8dir[1]) /
           mypatten4norm1 /
           myL8dirnorm1
       if (Math.acos(cosmy) < 0.14) {
           if ((0.14 - Math.acos(cosmy)) / 0.14 < 0.15) {
               mo3.y = mo3.y - 5 * (1 + (0.14 - Math.acos(cosmy)) / 0.14)
           } else {
               mo3.y =
                   mo3.y - 10 * (1 + ((0.14 - Math.acos(cosmy)) / 0.14) * 3)
           }

           usePointsTransOw(PNS_def, maxilla_9_def, PNS, mo3, AnsPnsPoints1)
           usePointsTransOw(maxilla_9_def, ANS_def, mo3, ANS, AnsPnsPoints2)
       }
   }

   //计算 2颗前牙 的点
   if (arrayObjectIndexOf(points, 'U1Left', 'landmark') == -1) {
       const teeth1_l = { x: 62.5, y: 49.94 } //上牙
       const teeth1_r = { x: 19.5, y: 81.24 }
       const teeth1_u = { x: 5.561, y: 1.122 }
       const teeth1_d = { x: 79.228, y: 132.748 }

       const teeth2_l = { x: 61, y: 67.15 } //下牙
       const teeth2_r = { x: 28.3, y: 40.77 }
       const teeth2_u = { x: 81.658, y: 0.73 }
       const teeth2_d = { x: 2.51, y: 112.722 }

       const u1r = point(points, 'U1RootTip')
       const u1i = point(points, 'U1IncisalTip')
       const l1r = point(points, 'L1RootTip')
       const l1i = point(points, 'L1IncisalTip')

       const u1Points = []
       u1Points.push({
           landmark: 'U1Left',
           x: teeth1_l.x,
           y: teeth1_l.y,
       })
       u1Points.push({
           landmark: 'U1Right',
           x: teeth1_r.x,
           y: teeth1_r.y,
       })

       const l1Points = []
       l1Points.push({
           landmark: 'L1Left',
           x: teeth2_l.x,
           y: teeth2_l.y,
       })
       l1Points.push({
           landmark: 'L1Right',
           x: teeth2_r.x,
           y: teeth2_r.y,
       })

       let tempu1l1
       const u1t = getTrans(teeth1_u, teeth1_d, u1i, u1r)
       u1Points.forEach((pos) => {
           tempu1l1 = u1t.transform([pos.x, pos.y])
           editorPoints(points, pos.landmark, tempu1l1[0], tempu1l1[1])
       })

       const l1t = getTrans(teeth2_u, teeth2_d, l1r, l1i)
       l1Points.forEach((pos) => {
           tempu1l1 = l1t.transform([pos.x, pos.y])
           editorPoints(points, pos.landmark, tempu1l1[0], tempu1l1[1])
       })

       //增加点
       const myU1Right = point(points, 'U1Right')
       const myA = point(points, 'A')
       const U1rAx =
           (myU1Right.x + myA.x) / 2 -
           0.1 *
           Math.sqrt(
               Math.abs(myU1Right.x - myA.x) ** 2 +
               Math.abs(myU1Right.y - myA.y) ** 2
           )
       const U1rAy = (myU1Right.y + myA.y) / 2

       editorPoints(points, 'U1RightA_mid', U1rAx, U1rAy)

       const myL1Right = point(points, 'L1Right')
       const myB = point(points, 'B')
       const L1rBx =
           (myL1Right.x + myB.x) / 2 -
           0.07 *
           Math.sqrt(
               Math.abs(myL1Right.x - myB.x) ** 2 +
               Math.abs(myL1Right.y - myB.y) ** 2
           )
       const L1rBy = (myL1Right.y + myB.y) / 2

       editorPoints(points, 'L1RightB_mid', L1rBx, L1rBy)
   }

   //计算标尺
  //  const px_sella_nasion_distance = pointToPointDistance(
  //      point(points, 'Na'),
  //      point(points, 'S')
  //  )
  //  const mm_px_ratio = 71.8 / px_sella_nasion_distance
  //  const ruler_length_px = 10 / mm_px_ratio
  //  const ruler_origin =
  //      points[arrayObjectIndexOf(points, 'SoftTissueNa', 'landmark')]
  //  if (ruler_origin.y - ruler_length_px <= 0)
  //      ruler_origin.y += 0 - ruler_origin.y + ruler_length_px + 30

   // console.log('ruler0Pos, ruler1Pos:', uuid, ruler0Pos, ruler10Pos)
   //没有检测到标尺时，以前是前端计算标尺位置，后来修改为后端计算标尺位置
   // if (!ruler0Pos || (ruler0Pos.x < 0 && ruler0Pos.y < 0)) {
   //     isNoRuler = true
   //     editorPoints(
   //         points,
   //         'ruler0',
   //         ruler_origin.x + 50,
   //         ruler_origin.y
   //     )
   // }

   // if (!ruler10Pos || (ruler10Pos.x < 0 && ruler10Pos.y < 0)) {
   //     isNoRuler = true
   //     editorPoints(
   //         points,
   //         'ruler1',
   //         ruler_origin.x + 50,
   //         ruler_origin.y - ruler_length_px
   //     )
   // }
  //  const rulerDis = point(points, 'rulerdistance')

  //  if (rulerDis) {
  //      if (!rulerDis.distance) {
  //          setRulerDistance(points, 10)
  //      }

  //      let noR = false
  //      if (rulerDis.rulerexist !== false) {
  //          //标尺比例，前端和 AI 对比，差别大于 20% 就算不对
  //          const ratioRuler = getRuler_MM_PX_Ratio(points)
  //          noR = mm_px_ratio - ratioRuler > mm_px_ratio * 0.35
  //          // if (noR) {
  //          //     //以预估为准
  //          //     const rulerD = pointToPointDistance2(
  //          //         points,
  //          //         'ruler0',
  //          //         'ruler1'
  //          //     )

  //          //     setRulerDistance(
  //          //         points,
  //          //         (rulerD * mm_px_ratio).toFixed(1)
  //          //     )
  //          // }
  //          // console.log(
  //          //     '🚀 ~ file: cephpoint.js ~ line 1070 ~ init_Ceph_Points ~ mm_px_ratio',
  //          //     uuid,
  //          //     mm_px_ratio,
  //          //     ratioRuler
  //          // )
  //      }

       //没有检测到标尺点
      //  let rulerStore = store.get('noRulers')
      //  if (false === rulerDis.rulerexist || noR) {
      //      if (!rulerStore) rulerStore = {}
      //      rulerStore[uuid] = true
      //      store.set('noRulers', rulerStore)
      //  } else {
      //      if (rulerStore && rulerStore[uuid]) delete rulerStore[uuid]
      //  }

       // let ruler0Pos = utilTools.point(
       //     state.cephPoints[uuid][fileName],
       //     'ruler0'
       // )
       // let ruler10Pos = utilTools.point(
       //     state.cephPoints[uuid][fileName],
       //     'ruler1'
       // )
       // let rulerDis = utilTools.point(state.cephPoints[uuid][fileName], 'rulerdistance');
       // if (!Vue.prototype.Config.rulerDis) Vue.prototype.Config.rulerDis = {}
       // if (!Vue.prototype.Config.rulerDis[uuid]) Vue.prototype.Config.rulerDis[uuid] = {}
       // console.log('------rulerDis-----', uuid, rulerDis)
       // if (!rulerDis) {
       //     Vue.prototype.Config.rulerDis[uuid][fileName] = 10.0
       // }else{
       //     Vue.prototype.Config.rulerDis[uuid][fileName] = rulerDis.distance
       // }
  //  }

   //重新计算 2 颗后牙点
   // console.log(' rulerDis.distance:', rulerDis.distance)
  //  const distance = rulerDis && rulerDis.distance ? rulerDis.distance : 10
  //  const _ruler0 = point(points, 'ruler0'),
  //      _ruler1 = point(points, 'ruler1'),
  //      _pist = Math.sqrt(
  //          Math.pow(_ruler0.x - _ruler1.x, 2) +
  //          Math.pow(_ruler0.y - _ruler1.y, 2)
  //      )

  //  //上磨牙
  //  const _distU = 10.41 * (_pist / distance),
  //      _U6Distal = point(points, 'U6Distal'),
  //      _U6Mesial = point(points, 'U6Mesial')
  //  if (!_U6Distal.userSet && !_U6Mesial.userSet) {
  //      //用户没有手动调整后牙，自动计算后牙大小
  //      const _centerU = new THREE.Vector3(
  //          (_U6Distal.x + _U6Mesial.x) / 2,
  //          (_U6Distal.y + _U6Mesial.y) / 2,
  //          0
  //      ),
  //          _ud = new THREE.Vector3(_U6Distal.x, _U6Distal.y, 0),
  //          _um = new THREE.Vector3(_U6Mesial.x, _U6Mesial.y, 0),
  //          _vud = _ud
  //              .sub(_centerU)
  //              .normalize()
  //              .multiplyScalar(_distU / 2),
  //          _vum = _um
  //              .sub(_centerU)
  //              .normalize()
  //              .multiplyScalar(_distU / 2),
  //          _rud = _vud.add(_centerU),
  //          _rum = _vum.add(_centerU)

  //      editorPoints(points, 'U6Distal', _rud.x, _rud.y)
  //      editorPoints(points, 'U6Mesial', _rum.x, _rum.y)
  //  }

  //  //下磨牙
  //  const _distL = 10.91 * (_pist / distance),
  //      _L6Distal = point(points, 'L6Distal'),
  //      _L6Mesial = point(points, 'L6Mesial')

  //  if (!_L6Distal.userSet && !_L6Mesial.userSet) {
  //      //用户没有手动调整后牙，自动计算后牙大小
  //      const _centerL = new THREE.Vector3(
  //          (_L6Distal.x + _L6Mesial.x) / 2,
  //          (_L6Distal.y + _L6Mesial.y) / 2,
  //          0
  //      ),
  //          _ld = new THREE.Vector3(_L6Distal.x, _L6Distal.y, 0),
  //          _dm = new THREE.Vector3(_L6Mesial.x, _L6Mesial.y, 0),
  //          _vld = _ld
  //              .sub(_centerL)
  //              .normalize()
  //              .multiplyScalar(_distL / 2),
  //          _vlm = _dm
  //              .sub(_centerL)
  //              .normalize()
  //              .multiplyScalar(_distL / 2),
  //          _rld = _vld.add(_centerL),
  //          _rlm = _vlm.add(_centerL)

  //      editorPoints(points, 'L6Distal', _rld.x, _rld.y)
  //      editorPoints(points, 'L6Mesial', _rlm.x, _rlm.y)
  //  }
}
function estimate(domain: number[][], range: number[][]) {
 
  // Alias
  const X = domain
  const Y = range
 
  // Allow arrays of different length but
  // ignore the extra points.
  const N = Math.min(X.length, Y.length)
 
  // If length is zero, no estimation can be done. We choose the indentity
  // transformation be the best quess.
  if (N === 0) {
   return new Transform(1, 0, 0, 0)
  } // else
 
  let i, a = 0, b = 0, c, d
  let a1 = 0
  let b1 = 0
  let c1 = 0
  let d1 = 0
  let a2 = 0
  let b2 = 0
  let ad = 0
  let bc = 0
  let ac = 0
  let bd = 0
  for (i = 0; i < N; i += 1) {
   a = X[i][0]
   b = X[i][1]
   c = Y[i][0]
   d = Y[i][1]
   a1 += a
   b1 += b
   c1 += c
   d1 += d
   a2 += a * a
   b2 += b * b
   ad += a * d
   bc += b * c
   ac += a * c
   bd += b * d
  }
 
  // Denominator.
  const den = N * a2 + N * b2 - a1 * a1 - b1 * b1
 
  const eps = 0.00000001
  if (-eps < den && den < eps) {
   // The domain points are the same.
   // We guess the translation to the mean of the range to be the best guess.
   // Here a, b represents the mean of domain points.
   return new Transform(1, 0, c1 / N - a, d1 / N - b)
  }
 
  // Estimators
  const s = (N * (ac + bd) - a1 * c1 - b1 * d1) / den
  const r = (N * (ad - bc) + b1 * c1 - a1 * d1) / den
  const tx = (-a1 * (ac + bd) + b1 * (ad - bc) + a2 * c1 + b2 * c1) / den
  const ty = (-b1 * (ac + bd) - a1 * (ad - bc) + a2 * d1 + b2 * d1) / den
 
  return new Transform(s, r, tx, ty)
 }
 function editorPoints(points:KeyPoint[], landmark: string, x: number, y: number) {
    const index = arrayObjectIndexOf(points, landmark, 'landmark')
    if (index == -1) {
     points.push({ landmark: landmark, x: x, y: y, isActive: false })
    } else {
     points[index].x = x
     points[index].y = y
    }
 }
 function arrayObjectIndexOf(points:KeyPoint[], name: string, key: 'landmark'): number {
  return points.findIndex(point => point[key] === name)
 }

 function point(points: KeyPoint[], name: string): KeyPoint {
   return points.find(i => i.landmark === name) || {x: 0, y: 0, landmark: 'error'}
 }
 function usePointsTrans(def1: PointZ, def2: PointZ, point1: PointZ, point2: PointZ, points: KeyPoint[], allpoints: KeyPoint[]) {
   function getTrans(def0: PointZ, def1: PointZ, range0: PointZ, range1: PointZ) {
    const domain = [],
     range = []
    domain.push([def0.x, def0.y])
    domain.push([def1.x, def1.y])
    range.push([range0.x, range0.y])
    range.push([range1.x, range1.y])
    return estimate(domain, range)
   }
  
   let tempanspns;
   const trans = getTrans(def1, def2, point1, point2)
   points.forEach((pos: KeyPoint) => {
    tempanspns = trans.transform([pos.x, pos.y])
    editorPoints(allpoints, pos.landmark, tempanspns[0], tempanspns[1])
   })
  }

export function getOcclusalPlane(U6Distal: KeyPoint, U6Mesial: KeyPoint,L6Distal: KeyPoint,L6Mesial: KeyPoint, U1IncisalTip: KeyPoint, L1IncisalTip: KeyPoint): KeyPoint[] {
  const molarsCenter:KeyPoint = {
    x: (U6Distal.x + U6Mesial.x + L6Distal.x + L6Mesial.x) / 4,
    y: (U6Distal.y + U6Mesial.y + L6Distal.y + L6Mesial.y) / 4,
    landmark: 'molarsCenter'
  }
  const incisalTipCenter:KeyPoint = {
    x: (U1IncisalTip.x + L1IncisalTip.x) / 2,
    y: (U1IncisalTip.y + L1IncisalTip.y) / 2,
    landmark: 'incisalTipCenter'
  }
  return [molarsCenter, incisalTipCenter]
}


export function matrixAddMatrix(matrix: number[], matrix2: number[]) {
  const newMatrix = [];
  const a00 = matrix[0],
    a01 = matrix[1],
    a02 = matrix[2];
  const a10 = matrix[3],
    a11 = matrix[4],
    a12 = matrix[5];
  const a20 = matrix[6],
    a21 = matrix[7],
    a22 = matrix[8];
  const b00 = matrix2[0],
    b01 = matrix2[1],
    b02 = matrix2[2];
  const b10 = matrix2[3],
    b11 = matrix2[4],
    b12 = matrix2[5];
  const b20 = matrix2[6],
    b21 = matrix2[7],
    b22 = matrix2[8];
  newMatrix[0] = b00 * a00 + b01 * a10 + b02 * a20;
  newMatrix[1] = b00 * a01 + b01 * a11 + b02 * a21;
  newMatrix[2] = b00 * a02 + b01 * a12 + b02 * a22;
  newMatrix[3] = b10 * a00 + b11 * a10 + b12 * a20;
  newMatrix[4] = b10 * a01 + b11 * a11 + b12 * a21;
  newMatrix[5] = b10 * a02 + b11 * a12 + b12 * a22;
  newMatrix[6] = b20 * a00 + b21 * a10 + b22 * a20;
  newMatrix[7] = b20 * a01 + b21 * a11 + b22 * a21;
  newMatrix[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return newMatrix
}