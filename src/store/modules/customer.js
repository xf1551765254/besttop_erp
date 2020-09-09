/*
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-05-22 11:00:33
 * @LastEditors: haile
 * @LastEditTime: 2019-06-13 19:28:58
 */
const customer = {
    state: {
        // 零售选中的顾客id
        customerId: '',
        customerName: '',
        customerTelephone: ''
    },
    mutations: {
        SETCUSTOMERID: (state, customerId) => {
            state.customerId = customerId
        },
        SETCUSTOMERNAME: (state, customerName) => {
            state.customerName = customerName
        },
        SETCUSTOMERTELEPHONE: (state, customerTelephone) => {
            state.customerTelephone = customerTelephone
        }
    },
    actions: {
        setCustomerId ({ commit }, customerId) {
            commit('SETCUSTOMERID', customerId)
        },
        setCustomerName ({ commit }, customerName) {
            commit('SETCUSTOMERNAME', customerName)
        },
        setCustomerTelephone ({ commit }, customerTelephone) {
            commit('SETCUSTOMERTELEPHONE', customerTelephone)
        }
    }
}

export default customer
