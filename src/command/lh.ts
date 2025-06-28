import { Context, h } from "koishi";
import { Config } from "../index";
import utils from "../utils";

export function lh(ctx: Context, config: Config) {
  ctx.command("离婚 解除婚姻关系").action(async ({ session }) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    if(!config.divorceSwitchgear){
      session.send([h("quote", { id: session.messageId }), "离婚功能未开启，请联系管理员"]);
      return;
    }
    if(config.divorceBlockGroup.includes(session.channelId.toString())){
      session.send([h("quote", { id: session.messageId }), "本群离婚功能已被禁止，请联系管理员"]);
      return;
    }
    // 创建用户数据
    await utils.createUserData(ctx, session)
    // 创建群数据
    await utils.createGroupData(ctx, session)
    // 群数据
    const groupData = (await ctx.database.get("groupData", {
      groupId: session.channelId.toString(),
    }))[0];
    // 用户数据
    const userData = (
      await ctx.database.get("wifeUser", {
        userId: session.userId,
        groupId: session.channelId.toString(),
      })
    )[0];
    // ctx.logger.info(userData);
    if (!userData?.wifeName) {
      session.send([h("quote", { id: session.messageId }), "你还没有老婆"]);
      return;
    }
    // 老婆数据
      const wifeData = (await ctx.database.get("wifeData", {
      name: userData.wifeName,
    }))[0];
    // 离婚次数是否达到上限
    if (userData.divorceCount >= config.divorceLimit) {
      session.send(`你已经离婚${config.divorceLimit}次了，你这个渣男`);
      return;
    }
    // 更新用户数据
    ctx.database.set(
      "wifeUser",
      { userId: session.userId, groupId: session.channelId.toString() },
      {
        divorceCount: userData.divorceCount + 1,
        wifeName: "",
      }
    );
    // 更新群数据
    ctx.database.set(
      "groupData",
      { groupId: session.channelId.toString() },
      {
        divorceTotalCount: groupData.divorceTotalCount + 1,
      }
    );
    // 更新老婆数据
    await utils.createGroupWifeData(ctx, session, userData.wifeName);
    const groupWifeData = wifeData.groupData.map(item =>{
      if(item.groupId === session.channelId.toString()){
        item.divorceCount += 1;
      }
      return item;
    })
    await ctx.database.set("wifeData", {
      name: userData.wifeName,
    }, {
      groupData: groupWifeData
    });
    session.send([
      h("quote", { id: session.messageId }),
      `你和${userData.wifeName}离婚了`,
    ]);
  });
}
