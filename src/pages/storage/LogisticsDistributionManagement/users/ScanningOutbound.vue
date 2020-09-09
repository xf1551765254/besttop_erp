<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-06-21 15:54:44
 * @LastEditors: Reat
 * @LastEditTime: 2019-07-23 11:33:13
 -->
<template>
  <div>
    <a-modal
      v-model="scanVisible"
      title="扫码出库"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="1000"
      class="doc"
      :bodyStyle="{height:'600px',width:'1000px'}"
      destroyOnClose
      centered>
      <div>
        <a-input-search
          placeholder="请输入司机编号/司机名称/送货单号/商品编码"
          style="width: 100%"
          v-model="bills"
          @search="onSearch"
          autoFocus
          :disabled="disabled"
        />
      </div>
      <div class="tabBox">
        <a-tabs @change="callback" type="card" defaultActiveKey="defaultActiveKey">
          <a-tab-pane v-for="pane in panes" :tab="pane.driverName" :key="pane.driverCode">
            <div class="tabTable" v-for="(item, index) in pane.delivers" :key="index">
              <div class="tabLeft">
                <div>
                  <span class="tabName">{{ item.skuName }}</span>
                  <span class="tabName">{{ item.skuCode }}</span>
                  <span class="tabName">{{ item.skuModel }}</span>
                </div>
                <div style="margin-top: 5px">
                  <span class="tabName">数量: {{ item.skuNum }}</span>
                  <span class="tabName">扫描数量: <a-input-number size="small" :min="0" :max="item.skuNum" v-model="item.skuScanNum" /></span>
                </div>
              </div>
              <div class="tabLeft">
                <div>
                  <span class="tabName">送货单号: {{ item.code }}</span>
                  <span class="tabName">预约送货时间: {{ item.sendTime }}</span>
                </div>
                <div style="margin: 5px 10px">
                  备注: {{ item.keepNote }}
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div slot="footer">
        <a-button size="small" @click="scanVisible=false">取消</a-button>
        <a-button type="primary" size="small" @click="onDriverStorage">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
export default {
    name: 'ScanningOutbound',
    data () {
        return {
            bills: '',
            disabled: false,
            panes: [],
            scanVisible: false,
            driverChange: '',
            defaultActiveKey: ''
        }
    },
    methods: {
        scanOpen () {
            this.panes = []
            this.bills = ''
            this.driverChange = ''
            this.scanVisible = true
        },
        onDriverStorage () {
            const list = this.panes.filter(i => i.driverCode === this.driverChange)
            let errList = []
            let deliverList = []
            console.log(list, '获取当前司机')
            if (list.length === 1) {
                deliverList = list[0].delivers
                errList = deliverList.filter(i => i.skuNum !== i.skuScanNum)
                console.log(errList, '存在差异数据!')
            }
            if (errList.length > 0) {
                const err = []
                for (const i of errList) {
                    err.push(i.code)
                }
                this.$notification.error({
                    message: '提示',
                    description: `送货单${err.join('，')}扫描出库商品数量异常,无法出库!`
                })
            } else {
                axios({
                    path: 'BillDeliverScanOutbound',
                    method: 'post',
                    body: {
                        delivers: deliverList
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        // console.log(res.data)
                        this.$emit('onSearch', '1')
                        this.panes = []
                        this.bills = ''
                        this.driverChange = ''
                        this.scanVisible = false
                    }
                })
            }
            // let list = []
            // this.panes.forEach(i => {
            //     if (i.driverCode === this.driverChange) {
            //         list = [...i.delivers]
            //     }
            // })
            // for (const i of this.panes) {
            //     if (i.driverCode === this.driverChange) {
            //         list = [...i.delivers]
            //     }
            // }
            // console.log(list, '7777777')
            // const sum = list.filter(i => i.skuNum !== i.skuScanNum)
            // console.log(sum, '888888')
            // if (sum.length > 0) {
            //     for (const i of sum) {
            //         this.$notification.error({
            //             message: '提示',
            //             description: `送货单${i.code}扫描出库商品数量异常,无法出库!`
            //         })
            //     }
            // } else {
            //     axios({
            //         path: 'BillDeliverScanOutbound',
            //         method: 'post',
            //         body: {
            //             delivers: list
            //         }
            //     }).then(res => {
            //         if (res.flag === 1) {
            //             // console.log(res.data)
            //             this.$emit('onSearch', '1')
            //             this.panes = []
            //             this.bills = ''
            //             this.driverChange = ''
            //             this.scanVisible = false
            //         }
            //     })
            // }
        },
        /**
         * @name: 查询
         */
        async onSearch (e) {
            let sum = null
            // console.log(e)
            // 判断司机是否存在
            const c = /^[a-z|A-Z]{1}/
            // console.log(c.test(e), '4444444444')
            if (e.length < 10) {
                sum = 1
                // console.log(sum, '司机')
                const driverBean = this.panes.some(i => i.driverCode === e)
                // console.log(driverBean, '司机判断')
                if (driverBean) {
                    return this.$message.warning('已存在当前司机信息,请重新输入!')
                }
            } else if (c.test(e)) {
                sum = 2
                // console.log(sum, '送货单')
                for (const o of this.panes) {
                    // console.log(this.driverChange, '55555')
                    if (this.driverChange === o.driverCode) {
                        const delivers = o.delivers.map(i => i.code === e)
                        // console.log(delivers[0], '送货单判断')
                        if (delivers[0]) {
                            return this.$message.warning('当前司机下已存在该送货单,请重新输入!')
                        }
                    }
                }
            } else if (e.length >= 10 && !isNaN(Number(e))) {
                sum = 3
                console.log(sum, '商品')
            } else {
                return this.$message.warning('请输入正确信息!')
            }
            this.disabled = true
            const res = await axios({
                path: 'BillDeliverScanFind',
                method: 'post',
                body: {
                    scandy: e
                }
            })
            if (res.flag === 1) {
                const data = [...res.data]
                if (data.length === 0) {
                    this.disabled = false
                    this.bills = ''
                    this.$message.warning('当前输入未查到数据!')
                    return
                }
                this.disabled = false
                this.bills = ''
                if (this.panes.length === 0 && sum !== 3) {
                    this.driverChange = data[0].driverCode
                }
                if (sum === 3) {
                    this.onSkuCode(this.panes, data)
                } else if (sum === 1) {
                    this.panes.push(...data)
                } else if (sum === 2) {
                    this.onSameDriver(this.panes, data)
                }
            } else {
                this.disabled = false
            }
        },
        onSameDriver (list, data) {
            if (list.length === 0) {
                // console.log(data[0], '拿到')
                list.push(data[0])
            } else {
                const arr = list.filter(i => i.driverCode === data[0].driverCode)
                if (arr.length > 0) {
                    // console.log(arr, 'arr')
                    list.forEach(i => {
                        if (i.driverCode === data[0].driverCode) {
                            const deliver = data[0].delivers[0]
                            const result = i.delivers.some(o => o.code === deliver.code)
                            if (result) {
                                this.$message.warning('司机' + i.driverName + '已经出库该单据商品!')
                            } else {
                                i.delivers.push(deliver)
                            }
                        }
                    })
                } else {
                    list.push(data[0])
                }
            }
        },
        /**
         * @name: 判断商品条码
         */
        onSkuCode (list, data) {
            console.log(this.driverChange, '司机选择了')
            if (!this.driverChange) { return this.$message.warning('请选择司机!') }
            let sum = false
            for (const i of data) {
                for (const e of list) {
                    if (i.driverCode === this.driverChange && this.driverChange === e.driverCode) {
                        for (const o of e.delivers) {
                            if (o.code === i.delivers[0].code && o.skuNum > o.skuScanNum) {
                                o.skuScanNum = Number(o.skuScanNum) + 1
                                // this.defaultActiveKey = i.driverCode
                                break
                            }
                        }
                    } else {
                        sum = true
                    }
                }
            }
            if (sum) {
                this.$message.warning('当前司机无法出库该商品!')
            }
        },
        /**
         * @name:选项卡
         */
        callback (e) {
            this.driverChange = e
            console.log(e, '选择司机')
        }
    }
}
</script>
<style lang="less">
  .tabBox {
    .ant-tabs-content {
      height: 450px;
      padding: 5px;
      border: 1px solid #ccc;
      overflow-y: auto;
    }
  }
.tabTable {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    border: 1px solid #ccc;
  .tabLeft {
      width: 500px;
      height: 100%;
      padding: 10px 10px;
      border-right: 1px solid #ccc;
      .tabName {
          margin: 5px 10px;
          display: inline;
      }
  }
  .tabRight {
      width: 500px;
      height: 100%;
  }
}
</style>
