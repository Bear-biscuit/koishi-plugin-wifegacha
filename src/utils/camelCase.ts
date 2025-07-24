import { Context } from "koishi";

/**
 * 计算牛老婆成功率（%）
 * @param lpNum 黄毛老婆数量
 * @param ntrSuccessCount 黄毛牛老婆成功次数
 * @param targetWifeNum 苦主老婆数量
 * @param targetaffectionLevel 苦主老婆好感度等级
 * @param targetTodayAffection 苦主今日获得好感度
 * @param affection 黄毛对苦主老婆的好感度
 * @param targetWifeAffection 苦主老婆的好感度
 * @returns 成功率
 */
export function camelCase(lpNum: number,ntrSuccessCount:number,targetWifeNum:number,targetaffectionLevel:number,targetTodayAffection:number,affection:number=0,targetWifeAffection:number=0) {
  // const a = 0.8 * Math.pow(0.05,1/(lpNum+ntrSuccessCount))
  // const b = 0.5 + Math.atan(targetWifeNum/targetaffectionLevel)/Math.PI
  // const c = (Math.exp(targetTodayAffection)/6 + 0.5) * Math.pow(0.01,affection)
  // const rate = (a * b / c) * 100
  // console.log(a,b,c,rate)
  // // 保留两位小数（数字类型）
  // return Number(rate.toFixed(2));
  const result = 50 + (100*Math.atan(affection-targetWifeAffection))/Math.PI

  return parseFloat(result.toFixed(2)); // 返回数字类型，保留两位小数
}
