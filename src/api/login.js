/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-03-22 14:19:43
 */

import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
    const headers = { ...parameter.headers }
    delete parameter.headers
    return axios({
        path: 'login',
        method: 'post',
        body: parameter,
        headers
    })
}

export function getSmsCaptcha (parameter) {
    return axios({
        path: 'api.SendSms',
        method: 'post',
        body: parameter
    })
}

export function getRole () {
    return axios({
        path: 'getRole',
        method: 'post'
    })
}

export function getStore (parameter) {
    return axios({
        path: 'getLoginStore',
        method: 'post',
        body: parameter
    })
}
