import { Context, Session } from "koishi";

export async function createUserData(ctx: Context, session: Session) {
  if (
    (
      await ctx.database.get("wifeUser", {
        userId: session.userId,
        groupId: session.channelId.toString(),
      })
    ).length === 0
  ) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    ctx.logger.info("还没有抽过老婆，创建用户数据");
    ctx.database.create("wifeUser", {
      userId: session.userId,
      groupId: session.channelId.toString(),
      wifeHistories: [],
      ntrOrdinal: 0,
      createdAt: new Date(),
      ntrCount: 0,
      ntrTotalCount: 0,
      ntrSuccessCount: 0,
      drawCount: 0,
      exchangeCount: 0,
      divorceCount: 0,
      totalAffection: 0,
      targetNtrCount: 0,
      targetNtrSuccessCount: 0,
      interactionWithOtherUser: [],
      operationDate: yesterday,
      lpdaDate: yesterday,
    });
  }
}
