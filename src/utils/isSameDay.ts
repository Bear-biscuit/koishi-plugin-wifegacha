import { Context, Session } from "koishi";

export async function isSameDay(ctx: Context, inputTime: Date, session: Session) {
  const userData = (await ctx.database.get("wifeUser", {
    userId: session.userId,
    groupId: session.channelId.toString(),
  }))[0];
  const inputDateOnly = inputTime.toString().split('T')[0];
  const storedDateOnly = userData.operationDate.toString().split('T')[0];
  return inputDateOnly === storedDateOnly;
}