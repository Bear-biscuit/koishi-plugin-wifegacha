import { Context, h } from "koishi";
import { pathToFileURL } from "url";
import utils from "../utils";

export function clp(ctx: Context) {
  ctx.command("抽老婆 抽一个老婆").action(async ({ session }) => {
    if (ctx.config.blockGroup.includes(session.channelId.toString())) {
      return;
    }
    // 创建用户数据
    await utils.createUserData(ctx, session)
    // 创建群数据
    await utils.createGroupData(ctx, session)
    // 获取用户数据
    const userData = (
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
    // ctx.logger.info("userData", userData);
    const wifeName = await utils.checkGroupDate(
      ctx,
      session.channelId.toString(),
      new Date(),
      session
    );
    if (wifeName) {
      // if(!userData.todayAffection.find(item => item.wifeName === wifeName)){
      //   userData.todayAffection.push({
      //     wifeName: wifeName,
      //     todayAffection: 0,
      //   })
      // }
      // 更新群数据
      ctx.database.set(
        "groupData",
        { groupId: session.channelId.toString() },
        {
          drawCount: groupData.drawCount + 1,
        }
      );
      // 更新老婆数据
      await utils.createGroupWifeData(ctx, session, wifeName);
      const wifeData = (
        await ctx.database.get("wifeData", { name: wifeName })
      )[0];
      // ctx.logger.info("wifeData", wifeData);
      const groupWifeData = wifeData.groupData.map(item =>{
        if(item.groupId === session.channelId.toString()){
          item.drawCount += 1;
        }
        return item;
      })
      // ctx.logger.info("groupWifeData", groupWifeData);
      await ctx.database.set("wifeData", {
        name: wifeName,
      }, {
        groupData: groupWifeData
      });
      // 给用户设置当前老婆
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          wifeName: wifeName,
          drawCount: userData.drawCount + 1,
          // todayAffection: userData.todayAffection,
        }
      );

      // 先查找是否有对应的老婆历史记录
      let found = false;
      userData.wifeHistories.forEach((item) => {
        if (item.wifeName === wifeName) {
          // 找到则更新抽到次数，并设置为非牛老婆
          item.getNum += 1;
          item.isNtr = false;
          found = true;
        } else {
          // 没找到则不更新
          item;
        }
      });
      // 如果没有找到，说明是第一次抽到，新增一条记录
      if (!found) {
        // 新增一条记录
        userData.wifeHistories.push({
          wifeName: wifeName,
          getWifeDate: new Date(),
          getNum: 1,
          isNtr: false,
          ntrGetCount: 0,
          exchangeGetCount: 0,
          divorceCount: 0,
          affection: 0,
          affectionLevel: 0,
        });
      }
      // 更新用户的老婆历史记录
      ctx.database.set(
        "wifeUser",
        { userId: session.userId, groupId: session.channelId.toString() },
        {
          wifeHistories: userData.wifeHistories,
        }
      );
      // 获取老婆图片地址
      const wifeImage = (
        await ctx.database.get("wifeData", { name: wifeName })
      )[0].filepath;
      // 获取老婆来源
      const comeFrom = (
        await ctx.database.get("wifeData", { name: wifeName })
      )[0].comeFrom;

      if (found) {
        const imageBuffer = await utils.readImageAsBinarySync(wifeImage);
        // 如果找到，说明是重复抽到
        session.send([
          h("quote", { id: session.messageId }),
          `重复了。\n你今天抽到的老婆是:${wifeName}${
            comeFrom ? `\n来自《${comeFrom}》` : ""
          }\n上次抽到她的时间是${
            userData.wifeHistories
              .find((item) => item.wifeName === wifeName)
              ?.getWifeDate.toLocaleString()
              .split("T")[0]
          }`,
          h.image(imageBuffer, "image/png"),
        ]);
      } else {
        // 如果没找到，说明是第一次抽到
        const imageBuffer = await utils.readImageAsBinarySync(wifeImage);
        session.send([
          h("quote", { id: session.messageId }),
          `出新了！\n你今天抽到的老婆是:${wifeName}${
            comeFrom ? `\n来自《${comeFrom}》` : ""
          }`,
          h.image(imageBuffer, "image/png"),
        ]);
      }
    } else {
      // 看看原本有没有老婆
      if (userData.wifeName) {
        const wifeImage = (
          await ctx.database.get("wifeData", { name: userData.wifeName })
        )[0].filepath;
        const comeFrom = (
          await ctx.database.get("wifeData", { name: userData.wifeName })
        )[0].comeFrom;
        const imageBuffer = await utils.readImageAsBinarySync(wifeImage);
        session.send([
          h("quote", { id: session.messageId }),
          `你的老婆是 ${userData.wifeName} ${
            comeFrom ? `，来自《${comeFrom}》` : ""
          }`,
          h.image(imageBuffer, "image/png"),
        ]);
      } else {
        // 更新群数据
        ctx.database.set(
          "groupData",
          { groupId: session.channelId.toString() },
          {
            drawCount: groupData.drawCount + 1,
          }
        );
        // 如果没抽到，说明老婆都被娶走了
        session.send([
          h("quote", { id: session.messageId }),
          "悲，老婆都被娶走了……",
        ]);
      }
    }
  });
}
