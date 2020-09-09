<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-26 09:19:15
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
      :orderId="orderId"
      :submitClick="submitClick"
    >
      <a-form :form="form" v-show="clentViot">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">线路名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入线路名称" v-decorator="$check('logisticsRoute.name', {initialValue:BaseMessageObj.name})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">运输费用</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsRoute.cost',{initialValue:BaseMessageObj.cost})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">适用机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeRef"
                mode="multiple"
                placeholder="请选择适用机构"
                :maxTagCount="1"
                style="width:85%"
                :options="fenDianArr"
                :open="false"
                @focus="selectFocusEffect"
                v-model="tempObjArr"
                allowClear/>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">线路长度(公里)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsRoute.length',{initialValue:BaseMessageObj.length})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">全程用时(分)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="4320"
                :step="1"
                :precision="0"
                v-decorator="$check('logisticsRoute.useMin',{initialValue:BaseMessageObj.useMin})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">路段状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择路段状态"
                style="width:100%"
                :options="statusArr"
                v-decorator="$check('logisticsRoute.status',{initialValue:BaseMessageObj.status})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">红绿灯数</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="999"
                :step="1"
                :precision="0"
                v-decorator="$check('logisticsRoute.lamp',{initialValue:BaseMessageObj.lamp})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">送货时间(小时)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :min="0"
                :max="4320"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsRoute.sendTime',{initialValue:BaseMessageObj.sendTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="map" :style="{height: mapHeight + 'px'}">
        <span class="mapIcon" @click="onControlMap">
          <a-icon type="fullscreen-exit" style="font-size: 35px; color: #38adff" v-if="!clentViot" />
          <a-icon type="fullscreen" style="font-size: 35px; color: #38adff" v-else-if="clentViot" />
        </span>
        <lineMap :zoom="17" ref="lineMap" @drag="dragMap" :mapWidth="'100%'" mapHeight="100%"></lineMap>
      </div>
      <store :visible.sync="storeQuery" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" multiple/>
    </bt-modal>
  </div>
</template>
<style lang="less" scoped>
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .map {
        min-height: 540px;
        position: relative;
    }
    .mapIcon {
        width: 90px;
        height: 90px;
        z-index: 1000;
        position: absolute;
        top: 10px;
        right: -50px;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import store from '@pages/purchasing/pricePolicyManage/toop/schemaInformation'
import lineMap from './lineMap/index'
export default {
    name: 'LineManagement',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        store,
        lineMap
    },
    data () {
        return {
            clentViot: true,
            map: {
                width: '100%',
                height: '500px',
                transition: 0.2 + 's'
            },
            title: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '编号/名称',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '适用仓库',
                    type: 'select',
                    key: 'storeCodes',
                    filter: true,
                    path: 'OrganizationStoreFind',
                    label: ['code', 'name'],
                    value: 'code'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'LineManagement.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'LineManagement.delete',
                    fc: this.onDel
                },
                {
                    name: '详情',
                    action: 'LineManagement.get',
                    fc: e => this.$refs.newTable.showDetails('线路管理详情', e)
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
            fenDianArr: [], // 生效分店
            tempObjArr: [],
            storeQuery: false,
            statusArr: [
                {
                    key: '良好',
                    title: '良好'
                },
                {
                    key: '较差',
                    title: '较差'
                },
                {
                    key: '一般',
                    title: '一般'
                }
            ],
            lat: '',
            lng: '',
            orderId: '',
            routeInfoList: [],
            mapHeight: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '4ca0d1c7ffc241a5aa892903bf50c6ef:LineManagement'
            this.tableApiPath = 'DistributionRouteFindAll'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.queryFenDian()
        const that = this
        window.onresize = () => {
            if (that.clentViot) {
                that.mapHeight = window.innerHeight - 128 - 100
            } else {
                that.mapHeight = window.innerHeight - 128 - 100 - 168
                console.log(that.mapHeight, window.innerHeight, '地图高度')
            }
        }
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
            console.log(this.routeInfoList, '123465789')
            if (this.routeInfoList.length <= 2) {
                return this.$message.warning('添加路径最少为三个地点！')
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    this.submitLoading = true
                    console.log(values, '------------------')
                    if (this.addEdit === 'edit') {
                        values.id = this.rowId
                    }
                    values.longitude = this.lat
                    values.latitude = this.lng
                    values.storeCodes = this.tempObjArr.join(',')
                    const saveArr = Object.assign(values, { routeInfoList: this.routeInfoList })
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionRouteAdd' : 'DistributionRouteUpdate',
                        method: 'post',
                        body: saveArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.routeInfoList = []
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
                this.$refs.newTable.exportFile('DistributionRouteFindAll', this.seachValue)
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
            e.path = 'DistributionRouteFindAll'
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
                arr = map(this.selectArr, 'id')
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
                        path: 'DistributionRouteDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        onControlMap () {
            console.log(document.getElementsByClassName('doc')[0], '获取doc')
            if (this.clentViot) {
                this.clentViot = false
                this.mapHeight = window.innerHeight - 128 - 100
            } else {
                this.clentViot = true
                this.mapHeight = window.innerHeight - 128 - 100 - 168
                console.log(this.mapHeight, window.innerHeight, '地图高度')
            }
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            this.clentViot = true
            this.$nextTick(() => {
                this.mapHeight = window.innerHeight - 128 - 100 - 168
            })
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                console.log('新增')
                this.addEdit = 'add'
                this.BaseMessageObj = {
                    cost: '0.00',
                    length: 0,
                    useMin: 0,
                    status: '良好',
                    lamp: 0,
                    sendTime: 0,
                    radius: 0
                }
                this.tempObjArr = []
                this.title = '新增线路'
                this.orderId = ''
                // this.$refs.lineMap.clearArr()
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑', index)
                this.rowId = index.id
                this.addEdit = 'edit'
                this.orderId = index.code
                this.title = '编辑线路'
                this.BaseMessageObj = index
                if (index.storeCodes) {
                    this.tempObjArr = index.storeCodes.split(',')
                } else {
                    this.tempObjArr = []
                }

                this.editAssign(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        editAssign (e) {
            axios({
                path: 'DistributionRouteShow',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                console.log(res, '编辑返回数组')
                this.$refs.lineMap.editFun(res.data)
            })
        },
        /**
         * @name: 获取分店
         * @msg:
         * @param {type}
         * @return:
         */
        queryFenDian () {
            axios({
                path: 'OrganizationStoreQueryStoreByOrganize',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取分店', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.fenDianArr = [...data]
                }
            })
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQuery = true
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            this.tempObjArr = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        // 地图返回数据
        dragMap (data) {
            this.routeInfoList = data
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'LineManagement') {
                this.queryFenDian()
            }
        }
    // mapHeight (val) {
    //     this.mapHeight = val
    // }
    }
}
</script>
