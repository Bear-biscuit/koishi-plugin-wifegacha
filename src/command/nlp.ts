import { Context, h } from "koishi";
import { Config } from "../index";
import utils from "../utils";

export function nlp(ctx: Context, config: Config) {
  ctx
    .command("牛老婆 <userId> 牛指定群友老婆")
    .action(async ({ session }, userId) => {
      if (ctx.config.blockGroup.includes(session.channelId.toString())) {
        return;
      }
      if (!config.ntrSwitchgear) {
        session.send([
          h("quote", { id: session.messageId }),
          "牛老婆功能未开启，请联系管理员",
        ]);
        return;
      }
      if (config.ntrBlockGroup.includes(session.channelId.toString())) {
        session.send([
          h("quote", { id: session.messageId }),
          "本群牛老婆功能已被禁止，请联系管理员",
        ]);
        return;
      }
      // const userId = session.content.match(/<at id="(\d+)"\s*\/>/)?.[1];
      userId = session.content.match(/<at id="(\d+)"\s*\/>/)?.[1];
      if (!userId) {
        // 提示用户@要牛的群友
        session.send([h("quote", { id: session.messageId }), "请@要牛的群友"]);
        return;
      }
      if (userId === session.userId) {
        session.send([
          h("quote", { id: session.messageId }),
          "自己牛自己，你真是个变态🤓",
        ]);
        return;
      }
      // 创建目标用户数据
      await utils.createTarget(ctx, session, userId);
      // 创建用户数据
      await utils.createUserData(ctx, session);
      // 创建目标用户与当前用户交互数据
      await utils.createInteraction(ctx, session, userId);
      // 创建群数据
      await utils.createGroupData(ctx, session);
      // 获取用户数据
      const myUserData = (
        await ctx.database.get("wifeUser", {
          userId: session.userId,
          groupId: session.channelId.toString(),
        })
      )[0];
      // 获取目标用户数据
      const targetUserData = (
        await ctx.database.get("wifeUser", {
          userId,
          groupId: session.channelId.toString(),
        })
      )[0];
      // 获取群数据
      const groupData = (
        await ctx.database.get("groupData", {
          groupId: session.channelId.toString(),
        })
      )[0];
      // 获取老婆数据
      const wifeData = (
        await ctx.database.get("wifeData", { name: targetUserData.wifeName })
      )[0];

      if (!(await utils.isSameDay(ctx, new Date(), session))) {
        ctx.database.set(
          "wifeUser",
          { userId: session.userId, groupId: session.channelId.toString() },
          {
            operationDate: new Date(),
            ntrCount: 0,
            divorceCount: 0,
            wifeName: "",
            // todayAffection: [],
          }
        );
      }

      if (myUserData.ntrCount >= config.ntrOrdinal && myUserData.ntrCount > 0) {
        session.send([
          h("quote", { id: session.messageId }),
          "你已经没有机会了",
        ]);
        return;
      }
      // 如果目标用户没有抽到老婆，则提示对方没有老婆
      if (!targetUserData || !targetUserData?.wifeName) {
        session.send([h("quote", { id: session.messageId }), "对方还没有老婆"]);
        return;
      }
      // 获取对方老婆好感等级
      const targetWifeAffectionLevel = targetUserData.wifeHistories.find(
        (item) => item.wifeName === targetUserData.wifeName
      )?.affectionLevel;
      // 更新用户牛老婆次数
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          ntrCount: myUserData.ntrCount + 1,
          ntrTotalCount: myUserData.ntrTotalCount + 1,
        }
      );
      // 更新目标用户与当前用户交互数据
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          interactionWithOtherUser: myUserData.interactionWithOtherUser.map(
            (item) => {
              if (
                item.otherUserId === userId &&
                item.groupId === session.channelId.toString()
              ) {
                item.ntrCount += 1;
              }
              return item;
            }
          ),
        }
      );
      // 更新目标用户被牛次数
      ctx.database.set(
        "wifeUser",
        { userId, groupId: session.channelId.toString() },
        {
          targetNtrCount: targetUserData.targetNtrCount + 1,
        }
      );
      // 更新群数据
      ctx.database.set(
        "groupData",
        { groupId: session.channelId.toString() },
        {
          ntrTotalCount: groupData.ntrTotalCount + 1,
        }
      );
      // 更新老婆数据
      await utils.createGroupWifeData(ctx, session, targetUserData.wifeName);
      const groupWifeData = wifeData.groupData.map((item) => {
        if (item.groupId === session.channelId.toString()) {
          item.ntrCount += 1;
        }
        return item;
      });
      await ctx.database.set(
        "wifeData",
        {
          name: targetUserData.wifeName,
        },
        {
          groupData: groupWifeData,
        }
      );
      // 获取需要的信息
      const lpNum = myUserData.wifeHistories.length;
      const ntrSuccessCount = myUserData.ntrSuccessCount;
      const targetWifeNum = targetUserData.wifeHistories.length;
      const targetaffectionLevel = targetWifeAffectionLevel;
      const targetWifeAffection = targetUserData.wifeHistories.find(
        (item) => item.wifeName === targetUserData.wifeName
      )?.affection ?? 0;
      // const targetTodayAffection = targetUserData.todayAffection.find(
      //   (item) => item.wifeName === targetUserData.wifeName
      // )?.todayAffection ?? 0;
      const affection =
        myUserData.wifeHistories.find(
          (item) => item.wifeName === targetUserData.wifeName
        )?.affection ?? 0; // 默认为 0

      // ctx.logger.info(`lpNum: ${lpNum}, ntrSuccessCount: ${ntrSuccessCount}, targetWifeNum: ${targetWifeNum}, targetaffectionLevel: ${targetaffectionLevel}, todayAffection: ${targetTodayAffection}, affection: ${affection}`);
      // 生成一个0-99的随机整数
      const randomNumber = Math.floor(Math.random() * 100);
      // 概率值
      let probabilityValue = 0;
      // 生成成功率
      const successRate = utils.camelCase(
        lpNum,
        ntrSuccessCount,
        targetWifeNum,
        targetaffectionLevel,
        // targetTodayAffection,
        affection,
        targetWifeAffection
      );
      // 概率计算方式
      if (config.probabilityMath === 0) {
        probabilityValue = config.probabilityMathDirect - targetWifeAffectionLevel * 10;
      } else {
        probabilityValue = successRate;
      }
      // ctx.logger.info(`生成的随机数: ${randomNumber}`);
      // 如果随机数小于概率（设定概率-好感等级*10），则牛老婆成功
      if (
        randomNumber <
        probabilityValue
      ) {
        // 先查找是否有对应的老婆历史记录
        let found = false;
        myUserData.wifeHistories.forEach((item) => {
          if (item.wifeName === targetUserData.wifeName) {
            // 找到则更新牛到的老婆次数
            item.ntrGetCount += 1;
            found = true;
          } else {
            // 没找到则不更新
            item;
          }
        });
        // 如果没有找到，说明是第一次抽到，新增一条记录
        if (!found) {
          // 新增一条记录
          myUserData.wifeHistories.push({
            wifeName: targetUserData.wifeName,
            getWifeDate: new Date(),
            getNum: 0,
            isNtr: true,
            ntrGetCount: 1,
            exchangeGetCount: 0,
            divorceCount: 0,
            affection: 0,
            affectionLevel: 0,
          });
        }
        // 更新用户数据
        ctx.database.set(
          "wifeUser",
          { userId: session.userId, groupId: session.channelId.toString() },
          {
            wifeName: targetUserData.wifeName,
            ntrSuccessCount: myUserData.ntrSuccessCount + 1,
            wifeHistories: myUserData.wifeHistories,
          }
        );
        // 更新目标用户与当前用户交互数据
        ctx.database.set(
          "wifeUser",
          { userId: session.userId, groupId: session.channelId.toString() },
          {
            interactionWithOtherUser: myUserData.interactionWithOtherUser.map(
              (item) => {
                if (
                  item.otherUserId === userId &&
                  item.groupId === session.channelId.toString()
                ) {
                  item.ntrSuccessCount += 1;
                }
                return item;
              }
            ),
          }
        );
        // 更新目标用户数据
        ctx.database.set(
          "wifeUser",
          { userId, groupId: session.channelId.toString() },
          {
            wifeName: "",
            targetNtrCount: targetUserData.targetNtrCount + 1,
            targetNtrSuccessCount: targetUserData.targetNtrSuccessCount + 1,
            ntrCount: targetUserData.ntrCount - 1,
          }
        );
        // 更新群数据
        ctx.database.set(
          "groupData",
          { groupId: session.channelId.toString() },
          {
            ntrSuccessCount: groupData.ntrSuccessCount + 1,
          }
        );
        // 更新老婆数据
        const groupWifeData = wifeData.groupData.map((item) => {
          if (item.groupId === session.channelId.toString()) {
            item.ntrFailCount += 1;
          }
          return item;
        });
        await ctx.database.set(
          "wifeData",
          {
            name: targetUserData.wifeName,
          },
          {
            groupData: groupWifeData,
          }
        );
        session.send([
          h("quote", { id: session.messageId }),
          `你的阴谋得逞了!\n${
            (await session.bot.getUser(userId)).name
          }的老婆（${targetUserData.wifeName}）是你的了🥵\n当前成功率：${
            probabilityValue
          }%`,
        ]);
      } else {
        session.send([
          h("quote", { id: session.messageId }),
          `你的阴谋失败了，黄毛被干掉了\n你还有${
            config.ntrOrdinal - myUserData.ntrCount - 1
          }次机会\n当前成功率：${
            probabilityValue
          }%`,
        ]);
      }
    });
}
