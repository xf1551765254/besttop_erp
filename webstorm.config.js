/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-03-04 10:03:18
 */
'use strict'
const path = require('path')

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            '@': resolve('src'),
            '@views': resolve('src/views'),
            '@comp': resolve('src/components'),
            '@core': resolve('src/core'),
            '@utils': resolve('src/utils')
        }
    }
}
