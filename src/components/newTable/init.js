/*
 * @Description: 自动初始化表头表体
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-28 20:31:30
 * @LastEditTime: 2019-08-19 15:38:40
 */
import Vue from 'vue'
import is from 'is_js'
import { axios } from '@/utils/request'
import { TABLEHEADER, isCompanyEnv } from '@/config/api.config'
/**
 * @name: 初始化表头
 * @msg:
 * @param {type}
 * @return:
 */
const initTableColumns = async (tableCode, other = false) => {
    let cols = []
    if (is.string(tableCode)) {
        cols = await getTableColumnsFromDb(tableCode, other)
        if (isCompanyEnv || is.null(cols)) {
            cols = await getTableColumns(tableCode, other)
        }
    } else if (is.array(tableCode)) {
        cols = other ? { other: null, data: tableCode } : [...tableCode]
    }
    return cols
}
/**
 * @name: 初始化表体
 * @msg:
 * @param {type}
 * @return:
 */
const initTableData = async (tableCode, pams = {}) => {
    let data = []; let res = {}
    if (is.string(tableCode)) {
        res = await getTableData(tableCode, pams)
        if (is.array(res.list)) {
            data = [...res.list]
            delete res.list
        } else if (is.array(res.data)) {
            data = [...res.data]
            delete res.data
        }
    } else if (is.array(tableCode)) {
        data = [...tableCode]
    }
    initDataTbId(data, 0)
    res.data = data
    return res
}
/**
 * @name: 从indexedDB获取表头
 * @msg:
 * @param {type}
 * @return:
 */
const getTableColumnsFromDb = (tableCode, other) => {
    return new Promise((resolve, reject) => {
        try {
            const GetRes = Vue.prototype.$idb.transaction(['columns']).objectStore('columns').get(tableCode)
            GetRes.onsuccess = async () => {
                if (is.undefined(GetRes.result)) {
                    Vue.prototype.$logger.info('表头来源-->请求表头', true)
                    const cols = await getTableColumns(tableCode, other)
                    resolve(cols)
                } else {
                    Vue.prototype.$logger.info('表头来源-->本地数据库表头', true)
                    const data = other ? { other: GetRes.result.other, data: GetRes.result.columns } : GetRes.result.columns
                    resolve(data)
                }
            }
            GetRes.onerror = async (event) => {
                Vue.prototype.$logger.error('数据库出错，请求表头')
                const cols = await getTableColumns(tableCode, other)
                resolve(cols)
            }
        } catch (error) {
            resolve(null)
        }
    })
}
/**
 * @name: 请求表头
 * @msg:
 * @param {type}
 * @return:
 */
const getTableColumns = async (tableCode, other) => {
    const body = {
        URL: TABLEHEADER,
        path: 'tableHead',
        method: 'post',
        body: { tableCode }
    }
    const res = await axios(body)
    if (res.flag === 1) {
        if (is.array(res.data) && res.data.length > 0) {
            delete res.data[res.data.length - 1].width
            Vue.prototype.$idb.transaction(['columns'], 'readwrite').objectStore('columns').put({ id: tableCode, other: res.other, columns: res.data })
        }
        return other ? res : res.data
    }
    return other ? { other: null, data: [] } : []
}
/**
 * @name: 请求表体
 * @msg:
 * @param {type}
 * @return:
 */
const getTableData = async (tableCode, pams = {}, path) => {
    if (is.undefined(pams.path) || is.empty(pams.path)) {
        Vue.prototype.$message.error('参数PATH缺失')
        return []
    }
    if (tableCode.indexOf(':') < 0) {
        Vue.prototype.$message.error('参数tableCode错误')
        return []
    }
    path = pams.path
    delete pams.path
    const res = await axios({
        path: path,
        method: 'post',
        headers: { tableCode },
        body: pams
    })
    if (res.flag === 1) {
        return is.array(res.data) ? res : res.data
    }
    return []
}

function initDataTbId (data, i = 0) {
    data.forEach(d => {
        d.bt_id = ++i
        if ('children' in d && is.not.null(d.children)) {
            initDataTbId(d.children, i * 100)
        }
    })
}
export {
    initTableColumns,
    initTableData
}
