import { Context, Session } from "koishi";
/**
 * 检查 group 是否当天重复，并根据情况执行不同逻辑
 * @param {Map} dataMap - 存储数据的 Map 对象
 * @param {string} group - 群号或键名
 * @param {string} inputTime - 当前时间字符串，格式为 '2025-06-23T12:43:37.392Z'
 * @param {Session} session - 会话对象
 */
export declare function checkGroupDate(ctx: Context, group: string, inputTime: string, session: Session): Promise<any>;
