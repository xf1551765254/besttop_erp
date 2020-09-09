<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-23 17:47:47
 -->
<template>
  <div>
    <h4 class="baseInfo">提货规模</h4>
    <a-row>
      <a-button class="categoryinfo-btn" @click="categoryinfoAdd">新增</a-button>
      <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
        <a-button class="categoryinfo-btn" type="danger">删除</a-button>
      </a-popconfirm>
    </a-row>
    <a-table
      rowKey="tbWebId"
      :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
      :columns="categoryinfoColumns"
      :dataSource="categoryinfoData"
      size="small"
      bordered
      :pagination="false"
      :scroll="scrollXY"
    >
      <template v-for="col in ['scopeMin','scopeMax','spriceRate','rewards','stepsReturn','shapeCash','shapeA','shapeB','shapeC','shapeD','note']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input-number
            v-if="col === 'scopeMin'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="Number.MAX_SAFE_INTEGER"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'scopeMax'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="Number.MAX_SAFE_INTEGER"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'spriceRate'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input
            v-else-if="col === 'rewards'"
            style="margin: -5px 0; width:100%"
            :value="text"
            @change="e => InputChange(e.target.value, record.tbWebId, col)"/>
          <a-input-number
            v-else-if="col === 'stepsReturn'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'shapeCash'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'shapeA'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'shapeB'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'shapeC'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input-number
            v-else-if="col === 'shapeD'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="100"
            :formatter="value => `${value}%`"
            :parser="value => value.replace('%', '')"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input
            v-else-if="col === 'note'"
            style="margin: -5px 0; width:100%"
            :value="text"
            @change="e => InputChange(e.target.value, record.tbWebId, col)"
          />
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.tbWebId)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>
<style lang="less">
.baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
export default {
    name: 'Scale',
    components: {
    },
    props: {
        detailsObj: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoData: [], // 表体
            scrollXY: {
                x: 1550,
                y: 350
            },
            categoryinfoColumns: [ // 表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '提货额起', dataIndex: 'scopeMin', width: 150, scopedSlots: { customRender: 'scopeMin' } },
                { title: '提货额止', dataIndex: 'scopeMax', width: 150, scopedSlots: { customRender: 'scopeMax' } },
                { title: '特价机比例%', dataIndex: 'spriceRate', width: 50, scopedSlots: { customRender: 'spriceRate' } },
                { title: '形式1：提货奖励', dataIndex: 'rewards', width: 100, scopedSlots: { customRender: 'rewards' } },
                { title: '形式3：规模台阶返点', dataIndex: 'stepsReturn', width: 100, scopedSlots: { customRender: 'stepsReturn' } },
                { title: '形式4:现汇奖励', dataIndex: 'shapeCash', width: 100, scopedSlots: { customRender: 'shapeCash' } },
                { title: '形式5率', dataIndex: 'shapeA', width: 100, scopedSlots: { customRender: 'shapeA' } },
                { title: '形式6率', dataIndex: 'shapeB', width: 100, scopedSlots: { customRender: 'shapeB' } },
                { title: '形式7额', dataIndex: 'shapeC', width: 100, scopedSlots: { customRender: 'shapeC' } },
                { title: '形式8额', dataIndex: 'shapeD', width: 100, scopedSlots: { customRender: 'shapeD' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            flagNum: 0,
            indexNumber: 1
        }
    },
    mounted () {

    },
    methods: {
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                console.log(target)
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (tbWebId) {
            if (tbWebId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].tbWebId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.tbWebId !== tbWebId)
            }
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            const { add } = this.$math
            this.flagNum++
            if (this.categoryinfoData.length === 0) {
                this.categoryinfoData.push({
                    index: this.indexNumber++,
                    tbWebId: this.flagNum,
                    scopeMin: '',
                    scopeMax: '',
                    spriceRate: '',
                    rewards: '',
                    stepsReturn: '',
                    shapeCash: '',
                    shapeA: '',
                    shapeB: '',
                    shapeC: '',
                    shapeD: '',
                    note: ''
                })
            } else {
                if (!this.categoryinfoData[this.categoryinfoData.length - 1].scopeMin) {
                    return this.$message.warning('请输入提货额起！')
                }
                if (!this.categoryinfoData[this.categoryinfoData.length - 1].scopeMax) {
                    return this.$message.warning('请输入提货额止！')
                }
                for (let i = 0; i < this.categoryinfoData.length; i++) {
                    if (this.categoryinfoData[i].scopeMin >= this.categoryinfoData[i].scopeMax) {
                        return this.$message.warning(`提货规模中第${add(i, 1, 0)}条,提货额止应大于提货额起，请修改！`)
                    }
                }
                if (this.categoryinfoData.length > 1) {
                    for (let i = 0; i < this.categoryinfoData.length - 1; i++) {
                        if (this.categoryinfoData[i + 1].scopeMin < this.categoryinfoData[i].scopeMax) {
                            return this.$message.warning(`提货规模中第${add(i, 2, 0)}条,提货额起不能小于上一条的提货额止，请修改！`)
                        }
                    }
                }
                this.categoryinfoData.push({
                    index: this.indexNumber++,
                    tbWebId: this.flagNum,
                    scopeMin: this.categoryinfoData[this.categoryinfoData.length - 1].scopeMax,
                    scopeMax: '',
                    spriceRate: '',
                    rewards: '',
                    stepsReturn: '',
                    shapeCash: '',
                    shapeA: '',
                    shapeB: '',
                    shapeC: '',
                    shapeD: '',
                    note: ''
                })
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        categoryinfoDataFun () {
            const arr = [...this.categoryinfoData]
            return arr
        },
        /**
         * @name: 编辑时设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        editSetBody (data) {
            const arr = [...data]
            for (const i of arr) {
                i.tbWebId = this.flagNum++
                i.index = this.indexNumber++
            }
            this.categoryinfoData = arr
        }

    },
    watch: {
    }
}
</script>
