/*
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-06 17:30:55
 * @LastEditTime: 2019-04-06 18:53:06
 */
const echarts = require('echarts/lib/echarts')
// 引入折线图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
const defaultOption = {

}

const init = (dom) => {
    console.log(dom)
    const myChart = echarts.init(dom)
    return myChart
}

/**
 * @name:
 * @msg:
 * @param {Object} myChart init得到的myChart实例
 * @param {Object} option echarts的配置项，具体参考https://www.echartsjs.com/option.html
 * @return:
 */
const setOption = (myChart, option) => {
    myChart.setOption(Object.assign(defaultOption, option))
}

export {
    init,
    setOption
}
