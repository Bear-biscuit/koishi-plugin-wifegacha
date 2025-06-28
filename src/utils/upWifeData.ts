import { Context } from "koishi";
import { readdirSync } from "fs";
import path from "path";
import sprit from "./sprit";
import { Config } from "../index";

let wifegachaPath = "";
if (path.join(__dirname).split("\\").pop()=="utils"){
  wifegachaPath = path.join(
    __dirname,
    "../../../..",
    "data/assets/wifegacha"
  );
}else{
  wifegachaPath = path.join(
    __dirname,
    "../../..",
    "data/assets/wifegacha"
  );
}

export async function upWifeData(ctx: Context,config:Config) {
  // 获取老婆数据
  const wifeData = await ctx.database.get("wifeData", {})
  // 获取老婆文件列表
  const files = readdirSync(wifegachaPath);
  // 遍历文件列表
  for (const file of files) {
    // 使用 path.parse 拆解文件名
    const parsed = path.parse(file);
    const splitName = config.wifeNameSeparator
    const wifeName = parsed.name.split(splitName)[0]
    const comeFrom = parsed.name.split(splitName)[1]
    // 判断老婆数据是否存在
    if(wifeData.find(item => item.name === wifeName)){
      continue;
    }
    // 创建老婆数据
    ctx.database.create('wifeData', {
      name: wifeName,
      comeFrom: comeFrom,
      filepath: path.join(wifegachaPath, file),
      createdAt: new Date(),
      groupData: []
    })
  }
  ctx.logger.info('wifeData表更新完成')
  sprit.generateThumbnails(ctx)

}
