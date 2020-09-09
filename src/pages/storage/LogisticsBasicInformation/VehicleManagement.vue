<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-26 13:46:39
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">车牌号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入车牌号" v-decorator="$check('logisticsVehicle.code', {initialValue:BaseMessageObj.code})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">车辆类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择车辆类型"
                style="width:100%"
                :options="carTypeArr"
                v-decorator="$check('logisticsVehicle.style', {initialValue:BaseMessageObj.style})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">动力类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择动力类型"
                allowClear
                style="width:100%"
                :options="powerArr"
                v-decorator="$check('logisticsVehicle.carType', {initialValue:BaseMessageObj.carType})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">品牌型号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入品牌型号" v-decorator="$check('logisticsVehicle.brandModel', {initialValue:BaseMessageObj.brandModel})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">司机</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择合适司机"
                style="width:100%"
                :options="driverArr"
                mode="multiple"
                :maxTagCount="1"
                v-decorator="$check('logisticsVehicle.driverCode', {initialValue:BaseMessageObj.driverCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">显示图片</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择显示图片"
                v-decorator="$check('logisticsVehicle.pic', {initialValue:BaseMessageObj.pic})"
                style="width: 100%">
                <a-select-option value="jack">
                  <img src="@assets/vehicle1.png" class="vehicleImg">
                </a-select-option>
                <a-select-option value="lucy">
                  <img src="@assets/vehicle2.png" class="vehicleImg">
                </a-select-option>
                <a-select-option value="Yiminghe">
                  <img src="@assets/vehicle3.png" class="vehicleImg">
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <h4 class="baseInfo">货车参数</h4>
          <a-col :sm="8" :md="4" :xl="3">总重量（吨）</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入货车参数"
                style="width: 100%"
                :min="0"
                :max="100"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.weight',{initialValue:BaseMessageObj.weight})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">核定载重(吨)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入核定载重"
                style="width: 100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.checkWeight',{initialValue:BaseMessageObj.checkWeight})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">车长（米）</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入车长"
                style="width: 100%"
                :min="0"
                :max="25"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.carLength',{initialValue:BaseMessageObj.carLength})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">车宽（米）</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入车宽"
                style="width: 100%"
                :min="0"
                :max="5"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.width',{initialValue:BaseMessageObj.width})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">车高（米）</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入车高"
                style="width: 100%"
                :min="0"
                :max="10"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.height',{initialValue:BaseMessageObj.height})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">轴数</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择轴数"
                style="width:100%"
                :options="axisArr"
                v-decorator="$check('logisticsVehicle.axis', {initialValue:BaseMessageObj.axis})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">可坐人数</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入可坐人数"
                style="width: 100%"
                :min="0"
                :max="5"
                :step="1"
                :precision="0"
                v-decorator="$check('logisticsVehicle.men',{initialValue:BaseMessageObj.men})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">最高时速(公里)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入最高时速"
                style="width: 100%"
                :min="0"
                :max="200"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsVehicle.speed',{initialValue:BaseMessageObj.speed})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
  </div>
</template>
<style lang="less">
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .vehicleImg{
        width: 30px;
        display: block;
        line-height: 30px;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
export default {
    name: 'VehicleManagement',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            title: '新增费用项目',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '车牌号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '司机',
                    type: 'select',
                    key: 'driverCode',
                    filter: true,
                    path: 'PermissionsUserQuery',
                    label: ['code', 'name'],
                    value: 'code',
                    body: {
                        orderbyField: 'code asc'
                    }
                },
                {
                    title: '品牌型号',
                    type: 'input',
                    key: 'brandModel'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'VehicleManagement.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'VehicleManagement.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'LineManagement.get',
                    fc: e => this.$refs.newTable.showDetails('车辆管理详情', e)
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            costOfName: '',
            rowId: '',
            circuitArr: [], // 线路
            driverArr: [], // 司机
            carTypeArr: [],
            powerArr: [
            ],
            axisArr: [
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'c4e2a0c9422a4b0d9b76ec37fcdae005:VehicleManagement'
            this.tableApiPath = 'DistributionVehicleFindAll'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.circuit()
        this.driver()
        this.carTypeFun()
        this.powerFun()
        this.axisFun()
    },
    methods: {
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    if (Number(values.weight) < Number(values.checkWeight)) {
                        return this.$message.warning('核定载重不能大于总重量！')
                    }
                    this.submitLoading = true
                    console.log(values, '------------------')
                    if (this.addEdit === 'edit') {
                        values.id = this.rowId
                    }
                    values.driverCode = values.driverCode.join(',')
                    console.log(values.driverCode, 99999)
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionVehicleAdd' : 'DistributionVehicleUpdate',
                        method: 'post',
                        body: values,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
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
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionVehicleFindAll', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'DistributionVehicleFindAll'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
        },
        /**
         * @name: 表格右击删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (row) {
            this.onDel(row)
        },
        /**
         * @name: 删除方法
         * @msg:
         * @param {type}
         * @return:
         */
        onDel (e) {
            console.log(e)
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'provider_fee_status：2') {
                        this.$message.warning('选中得数据存在已审核数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'DistributionVehicleDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.selectArr.length = 0
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                console.log('新增')
                this.addEdit = 'add'
                this.BaseMessageObj = {
                    weight: '',
                    checkWeight: '',
                    width: '2.5',
                    height: '1.6',
                    axis: 'logistics_vehicle_axis:1',
                    men: '0',
                    speed: '0'
                }
                this.title = '新增车辆'
            } else {
                const obj = { ...index }
                this.rowId = obj.id
                obj.driverCode = obj.driverCode.split(',')
                this.BaseMessageObj = obj
                this.addEdit = 'edit'
                this.title = '编辑车辆'
            }
            // 打开modal
            this.addEditModel = true
        },
        circuit () {
            axios({
                path: 'DistributionRouteFindAll',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取线路', res.data.list)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.circuitArr = [...data]
                }
            })
        },
        driver () {
            axios({
                path: 'PermissionsUserQuery',
                method: 'post',
                body: {
                    type: 'sys_user_type:2',
                    orderbyField: 'code asc'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取司机', res.data.list)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.driverArr = [...data]
                }
            })
        },
        carTypeFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'logistics_vehicle_style'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取车辆类型', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.carTypeArr = [...data]
                }
            })
        },
        powerFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'logistics_vehicle_car_type'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获动力类型', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.powerArr = [...data]
                }
            })
        },
        axisFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'logistics_vehicle_axis'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获轴', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.axisArr = [...data]
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'VehicleManagement') {
                this.circuit()
                this.driver()
                this.carTypeFun()
                this.powerFun()
                this.axisFun()
            }
        }
    }
}
</script>
