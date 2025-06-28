import { Context, h } from "koishi";
import { writeFileSync, unlinkSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { Config } from "../index";

export function gxlp(ctx: Context,config:Config) {
  let wifegachaPath = "";
  if (path.join(__dirname).split("\\").pop()=="command"){
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
  ctx
    .command("更新老婆 <name> <image> 更新老婆信息")
    .action(async ({ session }, name, image) => {
      if(!config.wifeUpdateGroup.includes(session.userId.toString()) && !config.wifeAllOperationGroup.includes(session.userId.toString()) && session.userId !== config.adminId){
        return [h("quote", { id: session.messageId }), "你无权更新老婆"];
      }
      if (!name || !image)
        return [h("quote", { id: session.messageId }), "缺少参数"];
      if(name.split(config.wifeNameSeparator).length<2){
        return [h("quote", { id: session.messageId }), "老婆名称格式错误,请使用" + config.wifeNameSeparator + "分隔名称和来源"];
      }
      if(!image.includes("<img src=")){
        return [h("quote", { id: session.messageId }), "未检测到图片"];
      }
      const wifeData = (
        await ctx.database.get("wifeData", {name: name.split(config.wifeNameSeparator)[0]})
      )
      if(wifeData.length === 0){
        return [h("quote", { id: session.messageId }), "该老婆不存在，请使用添加老婆命令"];
      }
      const wifeImageData = await ctx.http.get(
        image.match(/<img\s+src="([^"]+)"/)?.[1].replaceAll("&amp;", "&")
      );
      const buffer = Buffer.from(wifeImageData);
      unlinkSync(wifeData[0].filepath);
      writeFileSync(path.join(wifegachaPath, `${name}.png`), buffer);
      await ctx.database.set("wifeData",{
        name: name.split(config.wifeNameSeparator)[0]
      }, {
        comeFrom: name.split(config.wifeNameSeparator)[1],
        filepath: path.join(wifegachaPath, `${name}.png`),
      });
      session.send([
        h("quote", { id: session.messageId }),
        "老婆更新成功",
        h.image(pathToFileURL(path.join(wifegachaPath, `${name}.png`)).href),
      ]);
    });
}
