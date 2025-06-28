import { Context, Session } from "koishi";

export async function createGroupWifeData(ctx: Context, session: Session,wifename:string) {
  const wifeData = (await ctx.database.get("wifeData", {
    name: wifename,
  }))[0]
  if (
    (
      !wifeData.groupData.find((item) => item.groupId === session.channelId.toString())
    )
  ) {
    ctx.logger.info("该老婆在当前群中没有数据，创建数据");
    wifeData.groupData.push({
      groupId: session.channelId.toString(),
      drawCount: 0,
      ntrCount: 0,
      fuckCount: 0,
      divorceCount: 0,
      ntrFailCount: 0,
    })
    await ctx.database.set("wifeData", {
      name: wifename,
    }, {
      groupData: wifeData.groupData
    });
  }
}
