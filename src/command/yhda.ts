import { Context, h } from "koishi";
import { Config } from "../index";
import utils from "../utils";

export function yhda(ctx: Context, config: Config) {
  ctx.command("用户档案 [userId] 查看用户档案").action(async ({ session }, userId) => {
    // 创建用户数据
    await utils.createUserData(ctx, session);
    // 创建群数据
    await utils.createGroupData(ctx, session);
    // 获取用户数据
    const wifeUser = (
      await ctx.database.get("wifeUser", {
        userId: session.userId,
        groupId: session.channelId.toString(),
      })
    )[0];
    // 获取群数据
    const groupData = (
      await ctx.database.get("groupData", {
        groupId: session.channelId.toString(),
      })
    )[0];
    // 获取老婆总数
    const wifeDataNum = (await ctx.database.get("wifeData", {})).length;
    const now = new Date().getTime();
      const diffTime = Math.abs(now - wifeUser.lpdaDate.getTime());
      const diffSeconds = Math.floor(diffTime / 1000);
      if (diffSeconds < config.lpdaDateInterval) {
        const minutes = Math.floor(
          (config.lpdaDateInterval - diffSeconds) / 60
        );
        const seconds = (config.lpdaDateInterval - diffSeconds) % 60;
        session.send([
          h("quote", { id: session.messageId }),
          `档案查询冷却中，${minutes}分${seconds}秒后可以再次查询`,
        ]);
        return;
      }
      // 更新用户档案查询时间
      await ctx.database.set(
        "wifeUser",
        {
          userId: session.userId,
          groupId: session.channelId.toString(),
        },
        {
          lpdaDate: new Date(),
        }
      );
    // 获取老婆历史记录数量
    if (userId) {
      userId = userId.match(/<at id="(\d+)"\s*\/>/)?.[1];
      // 创建目标用户数据
      await utils.createTarget(ctx, session, userId);
      // 获取目标用户数据
      const targetwifeUser = (
        await ctx.database.get("wifeUser", {
          userId: userId,
          groupId: session.channelId.toString(),
        })
      )[0]
      // 获取目标的老婆历史记录数量
      const wifeHistoriesNum = targetwifeUser.wifeHistories.length;
      // 获取目抽老婆次数
      const drawCount = targetwifeUser.drawCount;
      // 获取目标牛老婆次数
      const ntrCount = targetwifeUser.ntrCount;
      // 获取目标牛老婆总次数
      const ntrTotalCount = targetwifeUser.ntrTotalCount;
      // 获取目标牛老婆成功次数
      const ntrSuccessCount = targetwifeUser.ntrSuccessCount;
      // 获取目标离婚次数
      const divorceCount = targetwifeUser.divorceCount;
      // 获取目标交换次数
      const exchangeCount = targetwifeUser.exchangeCount;
      // 获取目标老婆总好感度
      const totalAffection = targetwifeUser.totalAffection;
      // 获取目标被牛次数
      const targetNtrCount = targetwifeUser.targetNtrCount;
      // 获取目标被牛成功次数
      const targetNtrSuccessCount = targetwifeUser.targetNtrSuccessCount;
      session.send([
        h("quote", { id: session.messageId }),
        `- 目标用户档案：\n`,
        `- 老婆收集进度：${wifeHistoriesNum}/${wifeDataNum}\n`,
        `- 抽老婆次数：${drawCount}\n`,
        `- 牛老婆次数：${ntrCount}\n`,
        `- 牛老婆总次数：${ntrTotalCount}\n`,
        `- 牛老婆成功次数：${ntrSuccessCount}\n`,
        `- 离婚次数：${divorceCount}\n`,
        `- 交换次数：${exchangeCount}\n`,
        `- 老婆总好感度：${totalAffection}\n`,
        `- 被牛次数：${targetNtrCount}\n`,
        `- 被牛成功次数：${targetNtrSuccessCount}\n`,
      ]);
    }else{
      // 获取个人的老婆历史记录数量
      const wifeHistoriesNum = wifeUser.wifeHistories.length;
      // 获取目抽老婆次数
      const drawCount = wifeUser.drawCount;
      // 获取目标牛老婆次数
      const ntrCount = wifeUser.ntrCount;
      // 获取目标牛老婆总次数
      const ntrTotalCount = wifeUser.ntrTotalCount;
      // 获取个人牛老婆成功次数
      const ntrSuccessCount = wifeUser.ntrSuccessCount;
      // 获取目标离婚次数
      const divorceCount = wifeUser.divorceCount;
      // 获取个人交换次数
      const exchangeCount = wifeUser.exchangeCount;
      // 获取个人老婆总好感度
      const totalAffection = wifeUser.totalAffection;
      // 获取个人被牛次数
      const targetNtrCount = wifeUser.targetNtrCount;
      // 获取个人被牛成功次数
      const targetNtrSuccessCount = wifeUser.targetNtrSuccessCount;
      // 获取群数据
      // 群总抽老婆次数
      const groupDrawCount = groupData.drawCount;
      // 群总牛老婆次数
      const groupNtrCount = groupData.ntrTotalCount;
      // 群总牛老婆成功次数
      const groupNtrSuccessCount = groupData.ntrSuccessCount;
      // 群总离婚次数
      const groupDivorceCount = groupData.divorceTotalCount;
      // 群总交换次数
      const groupExchangeCount = groupData.exchangeCount;
      // 群总日老婆次数
      const groupFuckCount = groupData.fuckTotalCount;
      session.send([
        h("quote", { id: session.messageId }),
        `- 群档案：\n`,
        `- 群总抽老婆次数：${groupDrawCount}\n`,
        `- 群总牛老婆次数：${groupNtrCount}\n`,
        `- 群总牛老婆成功次数：${groupNtrSuccessCount}\n`,
        `- 群总离婚次数：${groupDivorceCount}\n`,
        `- 群总交换次数：${groupExchangeCount}\n`,
        `- 群总日老婆次数：${groupFuckCount}\n`,
        `---------------\n`,
        `- 个人档案：\n`,
        `- 老婆收集进度：${wifeHistoriesNum}/${wifeDataNum}\n`,
        `- 抽老婆次数：${drawCount}\n`,
        `- 牛老婆次数：${ntrCount}\n`,
        `- 牛老婆总次数：${ntrTotalCount}\n`,
        `- 牛老婆成功次数：${ntrSuccessCount}\n`,
        `- 离婚次数：${divorceCount}\n`,
        `- 交换次数：${exchangeCount}\n`,
        `- 老婆总好感度：${totalAffection}\n`,
        `- 被牛次数：${targetNtrCount}\n`,
        `- 被牛成功次数：${targetNtrSuccessCount}\n`,
      ]);
    }
  });
}
