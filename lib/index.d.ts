import { Context, Schema } from "koishi";
export declare const name = "wifegacha";
export declare const inject: string[];
export interface Config {
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
    fuckWifeBlockGroup: string[];
    wifeNameSeparator: string;
    wifeAllOperationGroup: string[];
    wifeUploadGroup: string[];
    wifeUpdateGroup: string[];
    wifeDeleteGroup: string[];
    adminId: string;
    lpdaDateInterval: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): Promise<void>;
