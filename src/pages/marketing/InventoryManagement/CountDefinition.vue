<!--
 * @Description: 盘点定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 11:01:00
 * @LastEditTime: 2019-08-19 18:58:41
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <a-button
        style="margin-right: 10px;"
        v-action:add
        type="primary"
        size="small"
        @click="setCount"
        icon="setting">盘点设置</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 盘点设置 -->
    <a-modal
      title="盘点设置"
      v-model="dialogAddChild"
      :width="800"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      centered
      destroyOnClose>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="formCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="subLoading" @click="handleSubmit">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">盘点日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                :disabledDate="disabledDate"
                v-decorator="$check('CountDefinition.stocktakingTime', {initialValue:setStocktakingTime})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">生成标志</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                style="width:100%"
                placeholder="请选择生成标志"
                v-decorator="$check('CountDefinition.creatType')"
                :options="creatTypeDorpArr"
                allowClear>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">盘点分店</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-select
                ref="storeEffectRef"
                style="width:90%"
                mode="multiple"
                :open="false"
                placeholder="请选择盘点分店"
                :maxTagCount="3"
                v-decorator="$check('CountDefinition.storeCode')"
                :options="storeCodeDorpArr"
                allowClear>
              </a-select>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:10%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 生效分店 -->
        <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
  @import "../../../assets/modalStyle.less";
</style>
<script>
import map from 'lodash.map'
import { mapGetters } from 'vuex'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import store from '@comp/BasicQuery/store'
import moment from 'moment'
export default {
    name: 'CountDefinition',
    components: { NewTable, SeachBox, store },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单号'
                },
                {
                    type: 'select',
                    key: 'storeCode',
                    title: '分店代码',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'OrganizationStoreFind'
                },
                {
                    key: 'creatFlag',
                    type: 'select',
                    title: '设置状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'stocktaking_define_status'
                    }
                },
                {
                    key: 'stocktakingTime',
                    type: 'date',
                    title: '盘点日期',
                    mat: 'YYYY-MM-DD'
                }
            ],
            btns: ['del'],
            seachValue: {}, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 菜单
            menuOpt: [
                { name: '删除',
                    action: 'CountDefinition.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'CountDefinition.get',
                    fc: e => this.$refs.newTable.showDetails('盘点定义详情', e)
                }
            ],
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 盘点设置
            dialogAddChild: false,
            subLoading: false, // 提交加载按钮
            form: this.$form.createForm(this),
            // 下拉款
            storeCodeDorpArr: [],
            creatTypeDorpArr: [],
            storeQueryEffect: false,
            tempObjArrEffect: []
        }
    },
    computed: {
        setStocktakingTime () {
            return moment().add(1, 'days')
        }
    },
    mounted () {
        this.seachValue.stocktakingTime = moment(this.seachValue.stocktakingTime).format('YYYY-MM-DD')
        this.$nextTick(() => {
            this.tableCode = 'fa0bb782fbaf04e443a1a7675f373d15:CountDefinition'
            this.tableApiPath = 'StocktakingDefineQuery'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getStoreCodeDorpArr()
        this.getCreatTypeDorpArr()
    },
    methods: {
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            console.log(this.$refs.storeEffectRef.value)
            if (this.$refs.storeEffectRef.value) {
                this.tempObjArrEffect = [...this.$refs.storeEffectRef.value]
            }
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelectEffect (arr) {
            // const newarr = [...this.tempObjArrEffect]
            this.tempObjArrEffect = [...map(arr, 'code')]// 将门店选择器选中的项目显示在选择框中
            this.form.setFieldsValue({
                storeCode: [...this.tempObjArrEffect]
            })
        },
        /**
         * @name: 盘点时间 禁止选择
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDate (curent) {
            return moment(curent).isBefore(moment().startOf('day').add(1, 'days'))
        },
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'StocktakingDefineQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
            this.tableIdsArr = []
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'StocktakingDefineQuery' })
            this.tableIdsArr = []
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSingleData = tableRow
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'StocktakingDefineDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            // _this.reLoadTableData()

                            _this.$refs.newTable.del(arr, 'id')
                            _this.tableIdsArr = []
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 盘点分店
         * @msg:
         * @param {type}
         * @return:
         */
        getStoreCodeDorpArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}--${i.name}`
                        i.value = i.code
                    })
                    this.storeCodeDorpArr = [...data]
                }
            })
        },
        /**
         * @name: 生成标志
         * @msg:
         * @param {type}
         * @return:
         */
        getCreatTypeDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'stocktaking_define_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('lin', res)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.creatTypeDorpArr = data
                }
            })
        },
        /**
         * @name: 盘点取消按钮
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.dialogAddChild = false
        },
        /**
         * @name: 盘点设置弹框
         * @msg:
         * @param {type}
         * @return:
         */
        setCount () {
            this.tempObjArrEffect = []
            this.dialogAddChild = true
        },

        /**
         * @name: 盘点提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (autiData) {
            const _this = this
            console.log(123)
            autiData.preventDefault() //
            const { form: { validateFields } } = this
            console.log(validateFields)
            this.form.validateFields((err, values) => {
                if (!err) {
                    _this.subLoading = true
                    values.stocktakingTime = values.stocktakingTime.format('YYYY-MM-DD')
                    values.storeCode = values.storeCode.join(',')
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    axios({
                        path: 'StocktakingDefineAdd', // 接口path名，必传
                        method: 'post',
                        body: values
                    }).then(res => {
                        _this.subLoading = false
                        if (res.flag === 1) {
                            _this.dialogAddChild = false
                            _this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler () {}

    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'CountDefinition') {
                this.getStoreCodeDorpArr()
                this.getCreatTypeDorpArr()
            }
        }
    }

}
</script>
