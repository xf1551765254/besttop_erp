<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-28 10:11:28
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="调度组管理"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="tag">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="调度员" key="1">
          <a-table
            :scroll="{ y: 220 }"
            :pagination="false"
            rowKey="userCode"
            size="small"
            bordered
            :columns="yardmanColumns"
            :dataSource="billsDataYardman">
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="司机" key="2">
          <a-table
            :scroll="{ y: 220 }"
            :pagination="false"
            rowKey="userCode"
            size="small"
            bordered
            :columns="driverColumns"
            :dataSource="billsDataDriver">
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="品类品牌" key="3">
          <div class="classTag">
            <a-tag v-for="(item,index) in classTagList" :key="index" @close="classTagClone(item.code)">{{ item.code }}-{{ item.name }}</a-tag>
          </div>
          <div class="classTag">
            <a-tag v-for="(item,index) in brandTagList" :key="index" @close="brandTagClone(item.code)">{{ item.code }}-{{ item.name }}</a-tag>
          </div>
          <a-table
            rowKey="goodsCode"
            size="small"
            :pagination="false"
            :columns="columnsGoods"
            :dataSource="billsDataGoods"
            bordered
            :scroll="{ y: 220}">
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </preview>
</template>
<style scoped>
    .classTag {
        width: 100%;
        height: 60px;
        border: 2px solid #eeeeee;
        border-radius: 5px;
        margin-bottom:20px;
        overflow-y: scroll;
        padding: 10px;
    }
</style>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
export default {
    components: { Preview },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            previewVisbel: false,
            previewContent: {
                headers: {}
            },
            tags: [],
            // 基础信息
            previewHeaders: [
                { key: 'upStoreCode', name: '公司' },
                { key: 'groupName', name: '调度组名称' },
                { key: 'sourceTypeName', name: '派工单据来源' },
                { key: 'deliveInstall', name: '是否送按一体' },
                { key: 'note', name: '调度组描述' }
            ],
            driverColumns: [
                { title: '司机编码', dataIndex: 'userCode', width: 80 },
                { title: '司机名称', dataIndex: 'userName', width: 150 },
                { title: '手机号', dataIndex: 'phone', width: 100 },
                { title: '新增人', dataIndex: 'createByName', width: 100 },
                { title: '新增时间', dataIndex: 'createTime' }
            ],
            billsDataDriver: [],
            yardmanColumns: [ // 调度员表头
                { title: '调度员编码', dataIndex: 'userCode', width: 100 },
                { title: '调度员名称', dataIndex: 'userName', width: 150 },
                { title: '手机号', dataIndex: 'phone', width: 100 },
                { title: '新增人', dataIndex: 'createByName', width: 100 },
                { title: '新增时间', dataIndex: 'createTime' }
            ],
            billsDataYardman: [], // 调度员数据
            classTagList: [],
            brandTagList: [],
            columnsGoods: [
                { title: '序号', dataIndex: 'index', width: 50 },
                { title: 'SKU编码', dataIndex: 'goodsCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'goodsName' }
            ],
            billsDataGoods: []
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'DistributionDispatchingGroupFindDetail',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.billsDataYardman = res.data.dispatchingUsers
                    this.billsDataDriver = res.data.driverUsers
                    this.classTagList = []
                    this.brandTagList = []
                    this.billsDataGoods = []
                    for (const i of res.data.logisticsDispatchingPowers) {
                        if (i.classCode) {
                            this.classTagList.push({
                                code: i.classCode,
                                name: i.className
                            })
                        }
                        if (i.brandCode) {
                            this.brandTagList.push({
                                code: i.brandCode,
                                name: i.brandName
                            })
                        }
                        if (i.goodsCode) {
                            this.billsDataGoods.push({
                                goodsCode: i.goodsCode,
                                goodsName: i.goodsName,
                                index: this.billsDataDriver.length + 1
                            })
                        }
                    }
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsDataYardman.length = 0
            this.billsDataDriver.length = 0
            axios({
                path: 'DistributionDispatchingGroupFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    console.log(e, '666')
                    this.previewContent.headers = {
                        ...e,
                        groupName: e.groupName,
                        upStoreCode: e.upStoreCode ? `${e.upStoreCode}-${e.upStoreName}` : '',
                        note: e.note
                    }
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
                this.findDetail()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
            if (!val) {
                this.previewContent.headers = {}
                this.billsDataYardman.length = 0
                this.billsDataDriver.length = 0
                this.classTagList.length = 0
                this.brandTagList.length = 0
                this.billsDataGoods.length = 0
            }
        }
    }
}
</script>
