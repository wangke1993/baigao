import axios from "axios"
import * as qs from 'qs';
import { MD5 } from 'crypto-js';
import { EnvConfig } from "src/utils/env-config";
const envConfig = new EnvConfig();
const appid = envConfig.BAIDU_TRANSLATE_APPID;
const SECRET_KEY = envConfig.BAIDU_TRANSLATE_KEY;
const BASE_URL = "http://api.fanyi.baidu.com/api/trans/vip/translate"
export const translateZhToEn = async (keyWord?: string) => {
    if (keyWord) {
        const { data:
            { error_msg, error_code, trans_result }
        } = await axios.get(
            `${BASE_URL}?${getQuery(keyWord, 'en')}`,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        if (!(error_code && error_msg)) {
            return trans_result[0].dst.trim();
        } else {
            throw new Error(error_msg);
        }
    }
}
const getQuery = (q: string, to: string) => {
    const query: any = {
        q,
        from: 'auto',
        to,
        appid,
        salt: new Date().getTime(),
    }
    query.sign = MD5(`${appid}${query.q}${query.salt}${SECRET_KEY}`).toString();
    return qs.stringify(query);
}