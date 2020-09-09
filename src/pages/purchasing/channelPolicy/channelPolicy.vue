<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-04 16:51:17
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload">
      <a-button v-action:edit style="margin-left:10px;" type="primary" size="small" @click="submitClick()">保存</a-button>
    </seachBox>
    <!-- 表格 -->
    <a-table
      rowKey="serialNumber"
      size="small"
      :columns="categoryinfoColumns"
      :dataSource="billsData"
      :pagination="false"
      bordered>
      <template v-for="col in ['headChoose','note']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-select
            v-if="col === 'headChoose'"
            :options="typeArr"
            :defaultValue="record.headChoose"
            style="margin: -5px 0;width:100%;"
            @change="e => InputChange(e, record.serialNumber, col)" />
          <a-input
            v-else-if="col === 'note'"
            style="margin: -5px 0; width:100%"
            :value="text"
            @change="e => InputChange(e.target.value, record.serialNumber, col)"
          />
          <span v-else>{{ text }}</span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'ChannelPolicy',
    components: {
        SeachBox
    },
    data () {
        return {
            slots: ['headChoose', 'note'],
            tableCode: '',
            tableApiPath: '',
            seachValue: {

            },
            btns: ['add', 'del', 'export', 'print'],
            categoryinfoColumns: [
                { title: '序号', dataIndex: 'serialNumber', align: 'center', width: 50 },
                { title: '政策形式', dataIndex: 'typeValue', align: 'center', width: 150 },
                { title: '开单价', dataIndex: 'billingRate', align: 'center', width: 150 },
                { title: '单头选择', dataIndex: 'headChoose', align: 'center', width: 150, scopedSlots: { customRender: 'headChoose' } },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } }
            ], // 表头
            billsData: [],
            typeArr: [
                {
                    key: '有',
                    title: '有'
                },
                {
                    key: '无',
                    title: '无'
                }
            ],
            serialNumber: '0'
        }
    },
    mounted () {
        this.channelPolicyFun()
    },
    methods: {
        /**
         * @name:监听单据表格编辑
         */
        InputChange (val, count, key) {
            console.log(val, count, key)
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.serialNumber)[0]
            if (target) {
                target[key] = val
                if (key === 'headChoose') {
                    if (target.headChoose === '有') {
                        target.billingRate = '当前价'
                    } else {
                        target.billingRate = '批发价'
                    }
                }
                this.billsData = newData
            }
        },
        channelPolicyFun () {
            axios({
                path: 'StrategyDefineFind',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    const arr = res.data.strategyShapeDefines
                    this.serialNumber = '0'
                    arr.forEach(i => {
                        this.serialNumber++
                        i.serialNumber = this.serialNumber
                    })
                    this.billsData = arr
                }
            })
        },
        // 搜索框方法
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        /**
         * @name: 编辑弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            const newArr = [...this.billsData]
            axios({
                path: 'StrategyDefineUpdate',
                method: 'post',
                body: {
                    strategyShapeDefines: newArr
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'channelPolicy') {
                this.channelPolicyFun()
            }
        }
    }
}
</script>
