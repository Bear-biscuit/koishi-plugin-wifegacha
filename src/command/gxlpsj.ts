import { Context, h } from "koishi";
import { Config } from "../index";
import utils from "../utils";

export function gxlpsj(ctx: Context, config: Config) {
  ctx.command("更新老婆数据", "更新老婆数据").action(async ({ session }) => {
    if(session.userId !== config.adminId){
      return
    }
    await utils.upWifeData(ctx, config);
    session.send([h("quote", { id: session.messageId }), "更新老婆数据完成"]);
  });
}
