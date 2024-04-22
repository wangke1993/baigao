import { randomUUID } from "crypto";
import { SnowflakeIdv1 } from 'simple-flakeid';
import * as os from 'os';

/**
 * 生成数字随机数
 * @param minNum ：起始值
 * @param maxNum ：最大值
 */
export const randomNumber = (minNum: number, maxNum: number): number => {
    if (minNum > maxNum) {
        throw new Error("start不能大于于end");
    }
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + Number(minNum);
}
/**
 * 生成N个不重复的数字随机数
 * @param n ：随机数个数
 * @param minNum ：起始值
 * @param maxNum ：最大值
 */
export const randomXNumber = (n: number, minNum: number, maxNum: number): number[] => {
    const numArr: number[] = [];
    for (let i = 0; i < n; i++) {
        let num = randomNumber(minNum, maxNum);
        if (numArr.length == 0) {
            numArr.push(num);
        } else {
            while (numArr.includes(num)) {
                num = randomNumber(minNum, maxNum);
            }
            numArr.push(num);
        }
    }
    return numArr;
}
/**
 * 生成N个可重复的数字随机数
 * @param n ：随机数个数
 * @param minNum ：起始值
 * @param maxNum ：最大值
 */
export const randomXNumberRepeatable = (n: number, minNum: number, maxNum: number): number[] => {
    const numArr: number[] = [];
    for (let i = 0; i < n; i++) {
        let num = randomNumber(minNum, maxNum);
        numArr.push(num);
    }
    return numArr;
}
/**
 * 获取UUID，不带横杠
 * @returns 去横杠UUID
 */
export const UUID = () => {
    return randomUUID().replace(/-/g, "");
}
/**
 * 获取一个对外的ip地址
 */
export const getLocalIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const interfaceInfo = interfaces[interfaceName];
        for (const inf of interfaceInfo) {
            if (inf.family === 'IPv4' && !inf.internal) {
                return inf.address
            }
        }
    }
}
const workerId = randomNumber(100000, 999999);
// FIXME:在大型分布式系统中，应单独将本模块取出，作为独立的服务生成雪花ID
/**
 * 获取雪花ID
 */
export const SnowflakeID = (): string => {
    // 创建Snowflake实例，传入机器ID或数据中心ID
    const snowflake = new SnowflakeIdv1({
        workerId,
    });
    return snowflake.NextId().toString();
}