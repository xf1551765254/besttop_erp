/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-03 19:53:49
 * @LastEditTime: 2019-04-29 09:36:32
 */
import moment from 'moment'
export default (value, mat) => {
    switch (mat) {
    case 'DateTime': return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
    case 'Date': return value ? moment(value).format('YYYY-MM-DD') : ''
    // eslint-disable-next-line
    case 'Sex': return value == 1 ? '男' : '女'
    // eslint-disable-next-line
    case 'Tiny': return value == 1 || value === true ? '是' : '否'
    case 'percentage': return `${(Number(value) * 100).toFixed(2)}%`
    case 'price': return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    default: return value
    }
}
