<!--
 * @Description: 交易记录表格
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 13:58:50
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 17:14:13
 -->
<template>
  <div class="pay-record" ref="payrecord">
    <a-table rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="false" :scroll="{ y: tbodyHeight}">
      <template slot="payTypeName" slot-scope="text">
        <div class="text-overflow">{{ text }}</div>
      </template>
      <template slot="referNumber" slot-scope="text">
        <div class="text-overflow">{{ text }}</div>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
    name: 'PayRecord',
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        scrollY: {
            type: Number,
            default: 240
        }
    },
    data () {
        return {
            columns: [
                {
                    title: '支付方式',
                    dataIndex: 'payTypeName',
                    width: '33%',
                    scopedSlots: { customRender: 'payTypeName' }
                },
                {
                    title: '支付凭证',
                    dataIndex: 'referNumber',
                    width: '33%',
                    scopedSlots: { customRender: 'referNumber' }
                },
                {
                    title: '交易金额',
                    dataIndex: 'payAmount',
                    width: '33%'
                }
            ],
            tbodyHeight: 240
        }
    },
    mounted () {
        this.tbodyHeight = this.$refs.payrecord.clientHeight - 74
    },
    watch: {
        scrollY (val, oldval) {
            this.tbodyHeight = val - 53
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-header {
    background: #408BFF;
    .ant-table-thead > tr > th {
        background: #408BFF;
        color: #fff;
        border: none;
    }
}
.pay-record {
    flex: 1;
    border-radius: 6px;
    background: #fff;
    overflow: hidden;
}
.text-overflow {
    width: 100%;
    overflow: hidden;
}
</style>
