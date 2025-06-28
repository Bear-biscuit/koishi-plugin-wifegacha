import { Context, h } from "koishi";
import { Config } from "../index";
import path from "path";
import { pathToFileURL } from "url";
import utils from "../utils";

export function lpda(ctx: Context, config: Config) {
  ctx.command("老婆档案 [wifeName] 查询老婆档案").action(async ({ session }, wifeName) => {
    // 创建用户数据
    await utils.createUserData(ctx, session);
    // 获取所有老婆数据
    const wifeData = await ctx.database.get("wifeData", {});
    // 获取用户数据
    const wifeUser = await ctx.database.get("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString(),
    });

    if (wifeName) {
      if (!wifeData.find((item) => item.name === wifeName)) {
        // 查找可能的老婆
        const possibleWife = wifeData.filter((item) =>
          item.name.includes(wifeName)
        );
        if (possibleWife.length > 0) {
          session.send([
            h("quote", { id: session.messageId }),
            "你可能是想找：\n",
            possibleWife.map((item) => item.name).join("\n"),
          ]);
        } else {
          session.send([h("quote", { id: session.messageId }), "老婆不存在"]);
        }
      } else {
        const now = new Date().getTime();
        const diffTime = Math.abs(now - wifeUser[0].lpdaDate.getTime());
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
        const wife = wifeData.find((item) => item.name === wifeName);
        if (wife) {
          if (
            !wife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )
          ) {
            wife.groupData.push({
              groupId: session.channelId.toString(),
              drawCount: 0,
              ntrCount: 0,
              fuckCount: 0,
              divorceCount: 0,
              ntrFailCount: 0,
            });
            await ctx.database.set(
              "wifeData",
              {
                name: wife.name,
              },
              {
                groupData: wife.groupData,
              }
            );
          }
          if (
            wifeUser[0].wifeHistories.find((item) => item.wifeName === wifeName)
          ) {
            session.send([
              h("quote", { id: session.messageId }),
              `名字：${wife.name}\n`,
              `${wife.comeFrom ? `来自：${wife.comeFrom}\n` : ""}`,
              h.image(pathToFileURL(wife.filepath).href),
              `- 你们相遇的时间是：${
                wifeUser[0].wifeHistories
                  .find((item) => item.wifeName === wifeName)
                  ?.getWifeDate.toLocaleString()
                  .split("T")[0]
              }\n`,
              `- 你一共抽到她${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.getNum
              }次\n`,
              `- 你一共牛到手${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.ntrGetCount
              }次\n`,
              `- 你一共交换到手${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.exchangeGetCount
              }次\n`,
              `- 你一共离婚${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.divorceCount
              }次\n`,
              `- 她对你的好感度：${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.affection
              }\n`,
              `- 她对你的好感等级：${
                wifeUser[0].wifeHistories.find(
                  (item) => item.wifeName === wifeName
                )?.affectionLevel
              }\n`,
              `-----------\n`,
              `- 本群一共抽到${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.drawCount
              }次\n`,
              `- 本群一共被牛${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.ntrCount
              }次\n`,
              `- 本群总好感度：${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.fuckCount
              }\n`,
              `- 本群一共离婚${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.divorceCount
              }次\n`,
              `- 本群一共被牛走${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.ntrFailCount
              }次\n`,
            ]);
          } else {
            session.send([
              h("quote", { id: session.messageId }),
              `名字：${wife.name}\n`,
              `${wife.comeFrom ? `来自：${wife.comeFrom}\n` : ""}`,
              h.image(pathToFileURL(wife.filepath).href),
              `- 本群一共抽到${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.drawCount
              }次\n`,
              `- 本群一共被牛${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.ntrCount
              }次\n`,
              `- 本群总好感度：${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.fuckCount
              }\n`,
              `- 本群一共离婚${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.divorceCount
              }次\n`,
              `- 本群一共被牛走${
                wife.groupData.find(
                  (item) => item.groupId === session.channelId.toString()
                )?.ntrFailCount
              }次\n`,
            ]);
          }
        }
      }
    } else {
      const now = new Date().getTime();
      const diffTime = Math.abs(now - wifeUser[0].lpdaDate.getTime());
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
      const groupWifeData = wifeData.filter((item) =>
        item.groupData.find(
          (item) => item.groupId === session.channelId.toString()
        )
      );
      if (groupWifeData.length > 0) {
        // 被娶最多的老婆
        const mostDrawWife = groupWifeData.sort(
          (a, b) =>
            b.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.drawCount -
            a.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.drawCount
        )[0];
        // 被牛最多的老婆
        const mostNtrWife = groupWifeData.sort(
          (a, b) =>
            b.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrCount -
            a.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrCount
        )[0];
        // 好感度最高的老婆
        const mostFuckWife = groupWifeData.sort(
          (a, b) =>
            b.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.fuckCount -
            a.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.fuckCount
        )[0];
        // 离婚最多的老婆
        const mostDivorceWife = groupWifeData.sort(
          (a, b) =>
            b.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.divorceCount -
            a.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.divorceCount
        )[0];
        // 被牛走最多的老婆
        const mostNtrFailWife = groupWifeData.sort(
          (a, b) =>
            b.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrFailCount -
            a.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrFailCount
        )[0];
        session.send([
          h("quote", { id: session.messageId }),
          "本群老婆统计：\n",
          `- 被娶最多的老婆：${mostDrawWife.name}，共${
            mostDrawWife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.drawCount
          }次\n`,
          `- 被牛最多的老婆：${mostNtrWife.name}，共${
            mostNtrWife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrCount
          }次\n`,
          `- 好感度最高的老婆：${mostFuckWife.name}，共${
            mostFuckWife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.fuckCount
          }次\n`,
          `- 离婚最多的老婆：${mostDivorceWife.name}，共${
            mostDivorceWife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.divorceCount
          }次\n`,
          `- 被牛走最多的老婆：${mostNtrFailWife.name}，共${
            mostNtrFailWife.groupData.find(
              (item) => item.groupId === session.channelId.toString()
            )?.ntrFailCount
          }次\n`,
        ]);
      } else {
        session.send([
          h("quote", { id: session.messageId }),
          "本群没有老婆档案",
        ]);
      }
    }
  });
}
