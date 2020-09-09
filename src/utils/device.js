/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-02-28 09:15:19
 */
import enquireJs from 'enquire.js'

export const DEVICE_TYPE = {
    DESKTOP: 'desktop',
    TABLET: 'tablet',
    MOBILE: 'mobile'
}

export const deviceEnquire = function (callback) {
    const matchDesktop = {
        match: () => {
            callback && callback(DEVICE_TYPE.DESKTOP)
        }
    }

    const matchLablet = {
        match: () => {
            callback && callback(DEVICE_TYPE.TABLET)
        }
    }

    const matchMobile = {
        match: () => {
            callback && callback(DEVICE_TYPE.MOBILE)
        }
    }

    // screen and (max-width: 1087.99px)
    enquireJs
        .register('screen and (max-width: 576px)', matchMobile)
        .register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet)
        .register('screen and (min-width: 1200px)', matchDesktop)
}
