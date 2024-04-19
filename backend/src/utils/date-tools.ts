/**
 * 时间格式化
 * @param date 
 * @param template YYYY-MM-DD HH:mm:ss
 * @returns 
 */
export const formatDate = (date: Date, template: string = 'YYYY-MM-DD HH:mm:ss') => {
    // console.log('-----格式化date---------', date);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    return template
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}
/**
 * 指定时间当月还剩余多少天
 * @param date 
 */
export const howManyDaysRemainInASpecifiedMonth = (date: Date): number => {
    const currentDate = date;
    // 获取当前月份的最后一天
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // 计算剩余天数
    const remainingDays = lastDayOfMonth.getDate() - currentDate.getDate() + 1;
    return remainingDays;
}
/**
 * 获取当月有多少天
 * @param date 
 * @returns 
 */
export const numberOfDaysInTheCurrentMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
/**
 * 本月最后一天时间
 */
export const onTheLastDayOfThisMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
/**
 * 相差多少个月
 * @param start
 * @param end 
 * @returns 
 */
export const howManyMonthsAreThereDifferences = (start: Date, end: Date): number => {

    // 获取开始日期和结束日期的年份和月份
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    // 计算相差的月份数
    const diffYear = endYear - startYear;
    const diffMonth = endMonth - startMonth;

    return diffYear * 12 + diffMonth;
}
/**
 * 两个月份相等
 * @param a 
 * @param b 
 * @returns 
 */
export const equalMonths = (a: Date, b: Date) => {
    const res = a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
    return res;
}

/**
 * a和b相差几天
 * @param a 前
 * @param b 后
 * @returns 
 */
export const howManyDaysApart = (a: Date, b: Date) => {
    // 计算相差的天数
    const dayDiff = b.getDate() - a.getDate();
    return dayDiff;
}

/**
 * 设置到0时0分0秒0毫秒
 * @param d 
 * @param type 设置 ['H', "m", 's', 'ms']
 * @returns 
 */
export const setDateToZero = (d: Date, type = ['H', "m", 's', 'ms']) => {
    if (type.includes('H')) {
        d.setHours(0);
    }
    if (type.includes('m')) {
        d.setMinutes(0);
    }
    if (type.includes('s')) {
        d.setSeconds(0);
    }
    if (type.includes('ms')) {
        d.setMilliseconds(0);
    }
    return d;
}