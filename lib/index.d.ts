import { Context, Schema } from "koishi";
export declare const name = "wifegacha";
export declare const inject: string[];
export interface Config {
    blockGroup: string[];
    ntrOrdinal: number;
    probabilityMath: number;
    ntrSwitchgear: boolean;
    ntrBlockGroup: string[];
    illustratedBook: boolean;
    divorceLimit: number;
    divorceSwitchgear: boolean;
    divorceBlockGroup: string[];
    fuckWifeCoolingTime: number;
    fuckWifeSwitchgear: boolean;
    fuckWifeDetailedReply: boolean;
    fuckWifeVoiceReply: boolean;
    fuckWifeBlockGroup: string[];
    wifeNameSeparator: string;
    wifeAllOperationGroup: string[];
    wifeUploadGroup: string[];
    wifeUpdateGroup: string[];
    wifeDeleteGroup: string[];
    adminId: string;
    wifeImageQuality: number;
    lpdaDateInterval: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): Promise<void>;
