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