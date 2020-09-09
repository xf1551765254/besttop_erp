/*
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-10 15:28:42
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-22 13:40:56
 */
import Vue from 'vue'
import { axios } from '@/utils/request'
const getStatus = (type, number) => {
  // type:接口参数 , number: 下拉框位置
  axios({
    path: 'OrganizationConfigFindByType',
    method: 'past',
    body: { type: type }
  }).then(res => {
    if (res.flag === 1) {
      const data = res.data
      data.forEach(i => {
        i.title = i.value
        i.value = `${i.type}:${i.configKey}`
        i.key = `${i.type}:${i.configKey}`
      })
      console.log(data, '获取状态')
      Vue.prototype.$set(number, 'selectDataArr', data)
    }
  })
}
export default getStatus
