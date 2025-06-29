import { Context, Schema, h } from "koishi";
import { mkdirSync, existsSync, readdirSync, writeFileSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { module } from "./module";
import { createWifeData } from "./utils/createWifeData";
import command from "./command";
import sprit from "./utils/sprit";

export const name = "wifegacha";
export const inject = ["database"];

export interface Config {
  // 屏蔽的群组
  blockGroup: string[];
  // 牛老婆次数
  ntrOrdinal: number;
  // 牛老婆概率
  probabilityMath: number;
  // 牛老婆总开关
  ntrSwitchgear: boolean;
  // 牛老婆屏蔽群组
  ntrBlockGroup: string[];
  // 图鉴收集是否包含牛老婆
  illustratedBook: boolean;
  // 离婚次数限制
  divorceLimit: number;
  // 离婚总开关
  divorceSwitchgear: boolean;
  // 离婚屏蔽群组
  divorceBlockGroup: string[];
  // 日老婆冷却时间
  fuckWifeCoolingTime: number;
  // 日老婆总开关
  fuckWifeSwitchgear: boolean;
  // 日老婆屏蔽群组
  fuckWifeBlockGroup: string[];
  // 老婆名称来源分隔符
  wifeNameSeparator: string;
  // 允许所有老婆操作权限的用户组
  wifeAllOperationGroup: string[];
  // 仅允许上传老婆权限的用户组
  wifeUploadGroup: string[];
  // 仅允许更新老婆权限的用户组
  wifeUpdateGroup: string[];
  // 仅允许删除老婆权限的用户组
  wifeDeleteGroup: string[];
  // 管理员ID
  adminId: string;
  // 档案查询时间间隔
  lpdaDateInterval: number;
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    wifeNameSeparator: Schema.string().default("+").description("老婆'名称' '来源'分隔符"),
    adminId: Schema.string().required().description("管理员ID"),
    lpdaDateInterval: Schema.number().default(10).description("档案查询时间间隔(秒)"),
    blockGroup: Schema.array(Schema.string())
      .default([])
      .collapse()
      .description("屏蔽的群组"),
  }).description("基础设置"),
  Schema.object({
    ntrOrdinal: Schema.number().default(5).description("牛老婆次数"),
    probabilityMath: Schema.number()
      .role("slider")
      .min(0)
      .max(100)
      .step(1)
      .default(50)
      .description("牛老婆概率(0-100)"),
    ntrSwitchgear: Schema.boolean().default(true).description("牛老婆总开关"),
    ntrBlockGroup: Schema.array(Schema.string())
      .default([])
      .collapse()
      .description("牛老婆屏蔽群组"),
  }).description("牛老婆设置"),
  Schema.object({
    illustratedBook: Schema.boolean()
      .default(false)
      .description("图鉴收集是否包含牛老婆"),
  }).description("图鉴设置"),
  Schema.object({
    divorceLimit: Schema.number().default(10).description("离婚次数限制"),
    divorceSwitchgear: Schema.boolean().default(true).description("离婚总开关"),
    divorceBlockGroup: Schema.array(Schema.string())
      .default([])
      .collapse()
      .description("离婚屏蔽群组"),
  }).description("离婚设置"),
  Schema.object({
    fuckWifeCoolingTime: Schema.number()
      .default(10)
      .description("日老婆冷却时间(秒)"),
    fuckWifeSwitchgear: Schema.boolean()
      .default(true)
      .description("日老婆总开关"),
    fuckWifeBlockGroup: Schema.array(Schema.string())
      .default([])
      .collapse()
      .description("日老婆屏蔽群组"),
  }).description("日老婆设置"),
  Schema.object({
    wifeAllOperationGroup: Schema.array(Schema.string()).role('table').description("允许所有老婆操作权限的用户组"),
    wifeUploadGroup: Schema.array(Schema.string()).role('table').description("仅允许上传老婆权限的用户组"),
    wifeUpdateGroup: Schema.array(Schema.string()).role('table').description("仅允许更新老婆权限的用户组"),
    wifeDeleteGroup: Schema.array(Schema.string()).role('table').description("仅允许删除老婆权限的用户组"),
  }).description("老婆更新权限设置"),
]);

const wifegachaPath = path.join(__dirname, "../../..", "data/assets/wifegacha");

export async function apply(ctx: Context, config: Config) {
  await module(ctx, config);
  ctx.logger.info("数据库初始化完成");
  sprit.ensureDirs();
  ctx.logger.info("sprit初始化完成");
  // write your plugin here
  // 初始化老婆图片文件夹
  if (!existsSync(wifegachaPath)) {
    ctx.logger.info("wifegacha文件夹不存在,开始初始化");
    mkdirSync(wifegachaPath);
  }
  // 初始化老婆数据
  if ((await ctx.database.get("wifeData", {})).length === 0) {
    ctx.logger.info("wifeData表中没有数据,开始初始化");
    createWifeData(ctx,config);
  }
  // ctx.logger.info((await ctx.database.get('wifeData', {})).map(item => item.name))
  // ctx.logger.info(getWifeImage(ctx, '波奇酱'))
  // const data = (await ctx.database.get('wifeUser', 1))[0]?.wifeHistories
  // ctx.logger.info(data)
  command.clp(ctx);
  command.nlp(ctx, config);
  command.chalp(ctx);
  command.lptj(ctx, config);
  command.lh(ctx, config);
  command.jhlp(ctx);
  command.rlp(ctx, config);
  command.tjlp(ctx, config);
  command.sclp(ctx, config);
  command.gxlp(ctx, config);
  command.lpda(ctx, config);
  command.yhda(ctx, config);
  command.gxlpsj(ctx, config);
  command.cmmlp(ctx, config);
}
