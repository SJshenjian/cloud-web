/**
 * 表单校验工具类
 *
 * @author shenjian
 * @since 2023/7/26
 */

import {isEmpty} from "lodash";

/**
 * 是否为中文
 *
 * @param str
 * @returns {boolean}
 */
export function isChinese(str) {
    return /^[\u4E00-\u9FA5]+$/.test(str);
}

/**
 * 是否包含中文
 */
export function hasChinese(str) {
    for (let i= 0;  i < str.length; i++) {
        if (isChinese(str[i])) {
            return true;
        }
    }
    return false;
}

/**
 * 判断是否手机号
 */
export function isMobile(val) {
    let exp = new RegExp(/^1\d{10}$/)
    return exp.test(val)
}

/**
 * 判断是否正整数
 */
export function isInt(val) {
    let exp = new RegExp(/^[1-9]\d*$/)
    return exp.test(val)
}

/**
 * 是否安全字符(不含特殊字符)
 * @param val
 * @returns {boolean}
 */
export function isSafeChar(val) {
    let exp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
    return !exp.test(val)
}

export function orgCodeValidator(ruler, value, callback)  {
    if (isEmpty(value)) {
        callback(new Error("请选择所属机构!"))
    } else {
        callback()
    }
}

