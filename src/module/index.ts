import { Context } from "koishi";
import { Config } from "../index";
import { wifeUser } from "./wifeUser";
import { wifeData } from "./wifeData";
import { groupData } from "./groupData";

export async function module(ctx: Context, config: Config) {
  wifeUser(ctx, config);
  wifeData(ctx, config);
  groupData(ctx, config);
}
