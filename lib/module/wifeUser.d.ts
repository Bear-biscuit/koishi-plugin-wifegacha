import { Context } from "koishi";
import { Config } from "../index";
export interface WifeUser {
    id: number;
    userId: string;
    groupId: string;
    wifeName: string;
    ntrOrdinal: number;
    fuckWifeDate: Date;
    lpdaDate: Date;
    drawWifeDate: Date;
    wifeHistories: Array<{
        wifeName: string;
        getWifeDate: Date;
        getNum: number;
        isNtr: boolean;
        ntrGetCount: number;
        exchangeGetCount: number;
        divorceCount: number;
        affection: number;
        affectionLevel: number;
    }>;
    interactionWithOtherUser: Array<{
        otherUserId: string;
        groupId: string;
        ntrCount: number;
        ntrSuccessCount: number;
        exchangeCount: number;
    }>;
    createdAt: Date;
    ntrCount: number;
    ntrTotalCount: number;
    ntrSuccessCount: number;
    drawCount: number;
    exchangeCount: number;
    divorceCount: number;
    totalAffection: number;
    targetNtrCount: number;
    targetNtrSuccessCount: number;
}
declare module "koishi" {
    interface Tables {
        wifeUser: WifeUser;
    }
}
export declare function wifeUser(ctx: Context, config: Config): void;
