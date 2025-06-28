import { Context, h } from "koishi";
import { Config } from "../index";
import sprit from "../utils/sprit";
import utils from "../utils";

export function lptj(ctx: Context, config: Config) {
  ctx.command("老婆图鉴 [targetUserId] 查看老婆图鉴").action(async ({ session }, targetUserId) => {
    let userId = session.userId;
    if(targetUserId){
      userId = targetUserId.match(/<at id="(\d+)"\s*\/>/)?.[1];
    }
    // 创建用户数据
    await utils.createUserData(ctx, session);
    // 创建目标用户数据
    if(targetUserId){
      await utils.createTarget(ctx, session, userId);
    }
    const lpAllNum = (await ctx.database.get("wifeData", {})).length;
    // ctx.logger.info("老婆总数：", lpAllNum);
    if (config.illustratedBook) {
      const lpList = (
        await ctx.database.get("wifeUser", {
          groupId: session.channelId.toString(),
          userId: userId,
        })
      )[0].wifeHistories.map((item) => item.wifeName);
      const imageBuffer = await sprit.generateMixedBackgroundImage(ctx, config, lpList);
      session.send([
        h("quote", { id: session.messageId }),
        "老婆图鉴（含牛老婆）",
        h.image(imageBuffer, "png"),
        `老婆收集进度：${lpList.length}/${lpAllNum}`,
      ]);
    } else {
      const lpList = (
        await ctx.database.get("wifeUser", {
          groupId: session.channelId.toString(),
          userId: userId,
        })
      )[0].wifeHistories
        .filter((item) => !item.isNtr)
        .map((item) => item.wifeName);
      const imageBuffer = await sprit.generateMixedBackgroundImage(ctx, config, lpList);
      session.send([
        h("quote", { id: session.messageId }),
        "老婆图鉴（不含牛老婆）",
        h.image(imageBuffer, "png"),
        `老婆收集进度：${lpList.length}/${lpAllNum}`,
      ]);
    }
  });
}
