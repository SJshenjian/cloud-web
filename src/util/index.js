import { ElMessage } from 'element-plus'
import {isEmpty} from "lodash";

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * 格式化时间格式
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 * (new Date()).format("yyyy年MM月dd日 HH时mm分ss秒") ==> 2006年07月02日 20时09分04秒
 * (new Date()).format("yyyy/MM/dd HH:mm") ==> 2006/07/02 20:09
 * @param {date} date
 * @param {String} fmt 例如yyyy/MM/dd HH:mm
 * @returns {String}  例如：2020/12/01 12:33
 */
export function formatDate(date, fmt) {
  if (!date) {
    return ''
  } else {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d',
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? '\u661f\u671f'
          : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * 获取Guid的方法
 * @returns {String}
 */
export function newGuid() {
  var guid = ''
  for (var i = 1; i <= 32; i++) {
    var n = Math.floor(Math.random() * 16.0).toString(16)
    guid += n
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      guid += '-'
    }
  }
  return guid
}

/**
 * 存储localStorage
 * @param {名字} name
 * @param {储存的内容} content
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 * @param {名字} name
 */
export const getStore = (name) => {
  if (!name) return false
  return window.localStorage.getItem(name)
}

/**
 * @param {名字} name
 */
export const removeStore = (name) => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 将字典值转换成format值
 * @param {*} dirs  字典映射
 */
export function dirToFormatMap(dirs) {
  var t = {}
  for (var key in dirs) {
    var dir = dirs[key]
    t[key] = {}
    for (let index = 0; index < dir.length; index++) {
      t[key][dir[index].code] = dir[index].value
    }
  }
  return t
}

/**
 *
 * @param {*} origin
 * @param {*} target
 * @param {*} decimal
 */
export function selectTargetPropertyValTosString(
  origin,
  target,
  decimal = ';'
) {
  const s = new Set()
  for (let i = 0; i < origin.length; i++) {
    s.add(origin[i][target] || '')
  }
  return [...s].join(decimal)
}

/**
 * arr 求和
 * @param {*} arr
 */
export function sumArrayItem(arr = []) {
  return arr.reduce((x, y) => {
    return x * 1 + y * 1
  })
}

/**
 * @param {提示文字} msg
 * @param {类型} type
 */
export function alertMessage(msg, type) {
  ElMessage({
    message: msg,
    center: true,
    type: type || 'success',
    duration: 2 * 1000,
  })
}

/**
 * 将数据转化为fromData
 * @param {数据参数} data
 */
export function fromDataTrim(data) {
  var formData = new FormData()
  for (var key in data) {
    formData.append(key, data[key])
  }
  return formData
}

export function dateFormat(row, column) {
  const daterc = row[column.property]
  if (daterc) {
    if (daterc.indexOf('T') === -1) return daterc
    const arr = daterc.split('T')
    const d = arr[0]
    const darr = d.split('-')
    // const t = arr[1]
    // const tarr = t.split('.000')
    // const marr = tarr[0].split(':')
    // const dd = darr[0] + '-' + darr[1] + '-' + darr[2] + ' ' + marr[0] + ':' + marr[1] + ':' + marr[2].substring(0, 2)
    const dd = darr[0] + '-' + darr[1] + '-' + darr[2]
    return dd
  }
}

/**
 * 根据出生日期获取年龄
 * @param val
 */
export function getAgeByBirthday(birthday) {
  const now = new Date()
  let age = now.getFullYear() - birthday.getFullYear();
  let month = 0;
  if (now.getMonth() < birthday.getMonth() || (now.getMonth() === birthday.getMonth() && now.getDate() < birthday.getDate())) {
    age--;
    month = now.getMonth() + 11 - birthday.getMonth();
  } else if (now.getMonth() > birthday.getMonth()) {
    month = now.getMonth() - birthday.getMonth();
  } else if (now.getMonth() === birthday.getMonth()) {
    if (now.getDate() >= birthday.getDate()) {
      month = 0;
    } else {
      age--;
      month = 11;
    }
  }
  if (month == 0) {
    return age + " 岁";
  } else {
    return age + " 岁 " + month + "个月";
  }
}

/**
 * 获取数值，最多小数点两位
 */
export function getNumber(val) {
  if (isEmpty(val)) {
    return ''
  }
  val = val.replaceAll("e", "")
  return val.match(/\d+(\.\d{1,2})?/)[0]
}

/**
 * 获取BMI
 */
export function getBmi(weight, height) {
  if (isEmpty(weight) || isEmpty(height)) {
    return 0
  }
  try {
    let weightNumber = Number.parseFloat(weight)
    let heightNumber = Number.parseFloat(height)
    let bmi = 0
    if (weightNumber !== 0 && heightNumber !== 0) {
      bmi = weightNumber / (Math.pow(heightNumber / 100, 2))
    }
    return bmi.toFixed(2)
  } catch(e) {
    return 0
  }
}