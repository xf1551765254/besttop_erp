<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 18:57:07
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
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      :tableCode="tableCode"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      title="渠道政策配置单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">单据名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入单据名称"
                v-decorator="$check('wholesaleStrategyDefine.name',{initialValue:this.BaseMessageObj.name})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">商品品类</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                v-decorator="$check('wholesaleStrategyDefine.classCode',{initialValue:this.BaseMessageObj.classCode})"
                style="width: 100%"
                @change="onChangeClassCode"
                placeholder="请选择商品品类"
                mode="multiple"
                :options="typeArr"
                :maxTagCount="1"
                showSearch
                :filterOption="filterOption"
                allowClear>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">商品品牌</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="BrandRef"
                mode="multiple"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请选择商品品牌"
                :maxTagCount="1"
                style="width:85%"
                :options="brandArr"
                :open="false"
                @focus="BrandFocus"
                v-model="BrandObjArr"
                allowClear/>
              <a href="javascript:;" @click="BrandFocus">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDateStar"
                @change="changeData"
                v-decorator="$check('wholesaleStrategyDefine.beginTime',{initialValue:this.BaseMessageObj.beginTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                @change="changeDataEndTime"
                :disabledDate="disabledDate"
                v-decorator="$check('wholesaleStrategyDefine.endTime',{initialValue:this.BaseMessageObj.endTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeRef"
                mode="multiple"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请选择生效机构"
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
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('wholesaleStrategyDefine.note',{initialValue:this.BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <div style="padding:10px 0">
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox
              style="padding-bottom:5px;margin-left: 10px;"
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
            >
              全选
            </a-checkbox>
          </div>
          <a-checkbox-group
            :options="plainOptions"
            v-model="checkedList"
            style="padding-top:5px;white-space:pre-wrap;word-wrap:break-word;"
            @change="onChange" />
        </div>
        <SpecialMachine
          v-if="SpecialShow"
          :detailsObj="detailsObj"
          ref="SpecialMachineRef" ></SpecialMachine>
        <policy
          v-if="PolicyShow"
          :detailsObj="detailsObj"
          ref="PolicyRef" ></policy>
        <scale
          v-if="scaleShow"
          :detailsObj="detailsObj"
          ref="scaleRef" ></scale>
        <RegularPolicy
          v-if="RegularPolicyShow"
          :detailsObj="detailsObj"
          ref="RegularPolicyRef" ></RegularPolicy>
        <salesIncentive
          v-if="salesIncentiveShow"
          :detailsObj="detailsObj"
          ref="salesIncentiveRef" ></salesIncentive>
        <HalfOff
          v-if="HalfOffShow"
          :detailsObj="detailsObj"
          ref="HalfOffRef" ></HalfOff>
        <HighEndOutSample
          v-if="HighEndOutSampleShow"
          :detailsObj="detailsObj"
          ref="HighEndOutSampleRef" ></HighEndOutSample>
        <pickUpTheGoods
          v-if="PickUpTheGoodsShow"
          :visible.sync="PickUpTheGoodsShow"
          :detailsObj="detailsObj"
          ref="PickUpTheGoodsRef" ></pickUpTheGoods>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('wholesaleStrategyDefine.createBy', {initialValue: BaseMessageObj.createBy || `${this.$store.getters.code}-${this.$store.getters.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                v-decorator="$check('wholesaleStrategyDefine.createTime',{initialValue:this.BaseMessageObj.createTime})"
                disabled
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 生效分店 -->
      <schemaInformation :visible.sync="storeQuery" @onSelect="onStoreSelect" :pams="storeStatus" :defaultSelect="tempObjArr" multiple/>
      <brand :visible.sync="brandQuery" @onSelect="onSelectBrand" :defaultSelect="BrandObjArr"/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
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
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
import map from 'lodash.map'
import SpecialMachine from '@pages/purchasing/pricePolicyManage/channeListComponent/SpecialMachine'
import policy from '@pages/purchasing/pricePolicyManage/channeListComponent/policy'
import scale from '@pages/purchasing/pricePolicyManage/channeListComponent/scale'
import RegularPolicy from '@pages/purchasing/pricePolicyManage/channeListComponent/RegularPolicy'
import salesIncentive from '@pages/purchasing/pricePolicyManage/channeListComponent/salesIncentive'
import HalfOff from '@pages/purchasing/pricePolicyManage/channeListComponent/HalfOff'
import HighEndOutSample from '@pages/purchasing/pricePolicyManage/channeListComponent/HighEndOutSample'
import pickUpTheGoods from '@pages/purchasing/pricePolicyManage/channeListComponent/pickUpTheGoods'
import clonedeep from 'lodash.clonedeep'
import Preview from '@pages/purchasing/pricePolicyManage/preview/wholesaleChannelPreview'
// 导入生效分店组件
import schemaInformation from '@pages/purchasing/pricePolicyManage/toop/schemaInformation'
import brand from '@comp/BasicQuery/brand'
import getStatus from '@comp/statusAll/getStatus'
const plainOptions = ['特价机', '追加政策', '提货规模', '常规机政策价', '销售奖励机型', '样机政策', '高端出样', '提货台阶']
export default {
    name: 'WholesaleChannelist',
    components: {
        NewTable,
        SeachBox,
        SpecialMachine,
        policy,
        scale,
        RegularPolicy,
        salesIncentive,
        HalfOff,
        HighEndOutSample,
        pickUpTheGoods,
        schemaInformation,
        BtModal,
        brand,
        Preview
    },
    data () {
        return {
            storeStatus: {
                include: {}
            },
            maxTagCount: 1, // 生效分店展示数量
            tableCode: '',
            tableApiPath: '',
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code'
                },
                {
                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'wholesale_strategy_define_status' }
                    title: '单据状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'createBy',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
                {
                    title: '制单开始时间',
                    type: 'date',
                    key: 'auditTimeA'
                },
                {
                    title: '制单结束时间',
                    type: 'date',
                    key: 'auditTimeB'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            rightMenu: [
                {
                    name: '编辑',
                    action: 'wholesaleChannelist.edit',
                    fc: this.editHandler
                },
                {
                    name: '审核',
                    action: 'wholesaleChannelist.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'wholesaleChannelist.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'wholesaleChannelist.get',
                    fc: this.previewFun
                }
            ], // 右键菜单
            disContextMenu: [], // 右键菜单的name
            addEditModel: false,
            submitLoading: false,
            form: this.$form.createForm(this),
            typeArr: [], // 品类
            brandArr: [], // 品牌
            fenDianArr: [], // 生效分店
            SpecialShow: true,
            PolicyShow: false,
            scaleShow: false,
            RegularPolicyShow: false,
            HalfOff: false,
            HighEndOutSampleShow: false,
            PickUpTheGoodsShow: false,
            // 多选框
            checkedList: ['特价机'],
            indeterminate: true,
            checkAll: false,
            plainOptions,
            detailsObj: {
                startTime: moment(),
                finishTime: moment().add({ months: 1 })
            },
            BaseMessageObj: {},
            addEdit: '', // 控制新增编辑
            keyId: '',
            tempObjArr: [],
            BrandObjArr: [],
            storeQuery: false,
            disabledDateString: moment(),
            endTimeData: moment(),
            soleArr: ['特价机'],
            orderId: '',
            tags: [],
            brandQuery: false,
            // 预览
            previewVisbel: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '4ed303df390f40368ac85cc7c670c15a:wholesaleChannelist'
            this.tableApiPath = 'ChannelDefineQuery'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('wholesale_strategy_define_status', this.conditions[1])
        this.seachValue = {
            status: 'wholesale_strategy_define_status:1',
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment()
        }
        this.queryType()
        this.queryBrand()
        this.queryFenDian()
    },
    computed: {
        // setStartTime () {
        //     return moment()
        // },
        // setEndTime () {
        //     return moment().add({ days: 7 })
        // },
        // setmakeTime () {
        //     return moment()
        // }
    },
    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        disabledDate (curent) {
            return moment(curent).isBefore(moment(this.disabledDateString).startOf())
        },
        changeDataEndTime (endtimeVal, endtimeValString) {
            console.log(endtimeVal, endtimeValString)
            this.endTimeData = endtimeValString
            this.detailsObj.finishTime = endtimeVal
        },
        disabledDateStar (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        changeData (data, dataString) {
            console.log(data, dataString)
            this.disabledDateString = dataString
            this.detailsObj.startTime = data
            return dataString
        },
        // setTime(){

        // },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            const newarr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...newarr, ...map(arr, 'code')])]
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectBrand (arr) {
            const newarr = [...this.BrandObjArr]
            this.BrandObjArr = [...new Set([...newarr, ...map(arr, 'code')])]
            console.log(this.BrandObjArr)
            this.detailsObj.brandCodeId = this.BrandObjArr[0]
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
         * @name: 品牌弹框
         * @msg:
         * @param {type}
         * @return:
         */
        BrandFocus () {
            this.brandQuery = true
            this.$refs.BrandRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (row) {
            this.queryType()
            this.queryBrand()
            this.queryFenDian()
            this.addEdit = 'edit'
            this.addEditModel = true
            this.keyId = row.id
            this.orderId = row.code
            this.tags = ['uncheck']
            this.checkedList = []
            this.detailsObj = {
                startTime: moment(row.beginTime),
                finishTime: moment(row.endTime),
                classCodeId: row.classCode.split(','),
                brandCodeId: row.brandCode
            }
            console.log(this.detailsObj, '------------')
            Object.assign(this, {
                indeterminate: false
            })
            axios({
                path: 'ChannelDefineQueryByCode',
                method: 'post',
                body: {
                    code: row.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const itemData = res.data
                    this.BaseMessageObj = {
                        name: row.name,
                        classCode: row.classCode.split(','),
                        beginTime: moment(row.beginTime),
                        endTime: moment(row.endTime),
                        createTime: row.createTime,
                        note: row.note,
                        createBy: `${row.createBy}-${row.createName}`
                    }
                    this.checkedList = []
                    if (itemData.particPrice.length !== 0) {
                        this.checkedList.push(plainOptions[0])
                        this.$nextTick(() => {
                            this.$refs.SpecialMachineRef.editSetBody(itemData.particPrice)
                        })
                    }
                    if (itemData.appendPrice.length !== 0) {
                        this.checkedList.push(plainOptions[1])
                        this.$nextTick(() => {
                            this.$refs.PolicyRef.editSetBody(itemData.appendPrice)
                        })
                    }
                    if (itemData.deliveryScale.length !== 0) {
                        this.checkedList.push(plainOptions[2])
                        this.$nextTick(() => {
                            this.$refs.scaleRef.editSetBody(itemData.deliveryScale)
                        })
                    }
                    if (itemData.routinePrice.length !== 0) {
                        this.checkedList.push(plainOptions[3])
                        this.$nextTick(() => {
                            this.$refs.RegularPolicyRef.editSetBody(itemData.routinePrice)
                        })
                    }
                    if (itemData.salesAward.length !== 0) {
                        this.checkedList.push(plainOptions[4])
                        this.$nextTick(() => {
                            this.$refs.salesIncentiveRef.editSetBody(itemData.salesAward)
                        })
                    }
                    if (itemData.halfOffSample.length !== 0) {
                        this.checkedList.push(plainOptions[5])
                        this.$nextTick(() => {
                            this.$refs.HalfOffRef.editSetBody(itemData.halfOffSample)
                        })
                    }
                    if (itemData.highSample.length !== 0) {
                        this.checkedList.push(plainOptions[6])
                        this.$nextTick(() => {
                            this.$refs.HighEndOutSampleRef.editSetBody(itemData.highSample)
                        })
                    }
                    if (itemData.extractSteps.length !== 0) {
                        this.checkedList.push(plainOptions[7])
                        console.log(itemData.extractSteps)
                        itemData.extractSteps.forEach(i => {
                            const arr = i.stepsDetaile
                            for (const item of arr) {
                                if (item.strategySteps === 'strategyStepsA') {
                                    i.strategyNumA = item.strategyNum
                                    i.strategyPriceA = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsB') {
                                    i.strategyNumB = item.strategyNum
                                    i.strategyPriceB = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsC') {
                                    i.strategyNumC = item.strategyNum
                                    i.strategyPriceC = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsD') {
                                    i.strategyNumD = item.strategyNum
                                    i.strategyPriceD = item.strategyPrice
                                }
                            }
                        })
                        this.$nextTick(() => {
                            this.$refs.PickUpTheGoodsRef.editSetBody(itemData.extractSteps)
                        })
                    }
                    this.tempObjArr = row.effectStoreCode ? row.effectStoreCode.split(',') : []
                    this.BrandObjArr = row.brandCode ? [row.brandCode] : []
                }
            })
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            if (this.tempObjArr.length === 0) {
                return this.$message.error('请选择生效机构！')
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                let arr = []
                let arr1 = []
                let arr2 = []
                let arr3 = []
                let arr4 = []
                let arr5 = []
                let arr6 = []
                let arr7 = []
                if (!err) {
                    if (this.checkedList.includes(plainOptions[0])) {
                        arr = this.$refs.SpecialMachineRef.categoryinfoDataFun()
                        if (arr.length === 0) {
                            this.$message.error('您没有添加特价机政策，请添加！')
                            return
                        }
                        console.log('特价机', arr)
                        for (const item of arr) {
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,特价为空，请输入特价！')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[1])) {
                        arr1 = clonedeep(this.$refs.PolicyRef.categoryinfoDataFun())
                        if (arr1.length === 0) {
                            this.$message.error('您没有添加额外追加政策，请添加！')
                            return
                        }
                        console.log('额外追加政策', arr1)
                        for (const item of arr1) {
                            if (!item.startTime) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,开始时间为空，请输入开始时间！')
                                return
                            }
                            if (item.startTime.isBefore(this.form.getFieldValue('beginTime'))) {
                                return this.$message.error('商品名为“' + item.skuName + '”的商品,开始时间小于表头开始时间，请修改商品开始时间！')
                            }
                            item.startTime = moment(item.startTime).format('YYYY-MM-DD')
                            if (!item.finishTime) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,结束时间为空，请输入结束时间！')
                                return
                            }
                            console.log(item.finishTime.isAfter(this.form.getFieldValue('endTime')))
                            if (item.finishTime.isAfter(this.form.getFieldValue('endTime'))) {
                                return this.$message.error('商品名为“' + item.skuName + '”的商品,结束时间大于表头结束时间，请修改商品结束时间！')
                            }
                            item.finishTime = moment(item.finishTime).format('YYYY-MM-DD')
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,抢购价为空，请输入限时抢购价！')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[2])) {
                        const { add } = this.$math
                        arr2 = this.$refs.scaleRef.categoryinfoDataFun()
                        if (arr2.length === 0) {
                            this.$message.error('您没有添加提货规模政策，请添加！')
                            return
                        }
                        console.log('提货规模', arr2)
                        for (let i = 0; i < arr2.length; i++) {
                            if (!arr2[i].scopeMin) {
                                this.$message.error('提货规模中,提货额起为空，请输入提货额起！')
                                return
                            } else if (!arr2[i].spriceRate) {
                                this.$message.error('提货规模中,特价机比例为空，请输入特价机比例！')
                                return
                            } else if (!arr2[i].rewards) {
                                this.$message.error('提货规模中,提货奖励为空，请输入提货奖励！')
                                return
                            }
                        }
                        for (let i = 0; i < arr2.length - 1; i++) {
                            if (arr2[i].scopeMin >= arr2[i].scopeMax) {
                                return this.$message.warning(`提货规模中第${add(i, 1, 0)}条,提货额止应大于提货额起，请修改！`)
                            }
                        }
                        console.log(arr2[arr2.length - 1].scopeMax, '-----------------')
                        if (arr2[arr2.length - 1].scopeMax) {
                            if (arr2[arr2.length - 1].scopeMin >= arr2[arr2.length - 1].scopeMax) {
                                return this.$message.warning(`提货规模中第${arr2.length}条,提货额止应大于提货额起，请修改！`)
                            }
                        }
                        if (arr2.length > 1) {
                            for (let i = 0; i < arr2.length - 1; i++) {
                                if (arr2.length > 1) {
                                    if (arr2[i + 1].scopeMin < arr2[i].scopeMax) {
                                        return this.$message.warning(`提货规模中第${add(i, 2, 0)}条,提货额起不能小于上一条的提货额止，请修改！`)
                                    }
                                }
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[3])) {
                        arr3 = this.$refs.RegularPolicyRef.categoryinfoDataFun()
                        if (arr3.length === 0) {
                            this.$message.error('您没有添加常规机政策，请添加！')
                            return
                        }
                        console.log('常规政策价', arr3)
                        for (const item of arr3) {
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,政策价为空，请输入政策价')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[4])) {
                        arr4 = this.$refs.salesIncentiveRef.categoryinfoDataFun()
                        if (arr4.length === 0) {
                            this.$message.error('您没有添加销售奖励政策，请添加！')
                            return
                        }
                        console.log('销售奖励机型', arr4)
                        for (const item of arr4) {
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,奖励金额为空，请输入奖励金额')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[5])) {
                        arr5 = this.$refs.HalfOffRef.categoryinfoDataFun()
                        if (arr5.length === 0) {
                            this.$message.error('您没有添加样机政策，请添加！')
                            return
                        }
                        console.log('五折出样', arr5)
                        for (const item of arr5) {
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,样机价为空，请输入样机价')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[6])) {
                        arr6 = this.$refs.HighEndOutSampleRef.categoryinfoDataFun()
                        if (arr6.length === 0) {
                            this.$message.error('您没有添加高端出样政策，请添加！')
                            return
                        }
                        console.log('高端出样', arr6)
                        for (const item of arr6) {
                            if (!item.strategyPrice) {
                                this.$message.error('商品名为“' + item.skuName + '”的商品,会议价为空，请输入会议价')
                                return
                            }
                        }
                    }
                    if (this.checkedList.includes(plainOptions[7])) {
                        arr7 = this.$refs.PickUpTheGoodsRef.categoryinfoDataFun()
                        if (arr7.length === 0) {
                            this.$message.error('您没有添加提货台阶政策，请添加！')
                            return
                        }
                        for (const i of arr7) {
                            if (!i.priceA) {
                                this.$message.error('商品名为“' + i.skuName + '”的商品,分销价为空，请输入分销价')
                                return
                            }
                            i.stepsDetaile = []
                            i.stepsDetaile.push(
                                {
                                    strategySteps: 'strategyStepsA',
                                    strategyNum: i.strategyNumA,
                                    strategyPrice: i.strategyPriceA
                                },
                                {
                                    strategySteps: 'strategyStepsB',
                                    strategyNum: i.strategyNumB,
                                    strategyPrice: i.strategyPriceB
                                },
                                {
                                    strategySteps: 'strategyStepsC',
                                    strategyNum: i.strategyNumC,
                                    strategyPrice: i.strategyPriceC
                                },
                                {
                                    strategySteps: 'strategyStepsD',
                                    strategyNum: i.strategyNumD,
                                    strategyPrice: i.strategyPriceD
                                }
                            )
                            delete i.strategyNumA
                            delete i.strategyPriceA
                            delete i.strategyNumB
                            delete i.strategyPriceB
                            delete i.strategyNumC
                            delete i.strategyPriceC
                            delete i.strategyNumD
                            delete i.strategyPriceD
                        }
                        console.log('提货台阶', arr7)
                    }
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        console.log(this.BrandObjArr[0], '11111111111111111111111111111111111111111111111')
                        axios({
                            path: 'ChannelDefineAdd',
                            method: 'post',
                            body: {
                                createStore: this.$store.getters.storeInfo.code,
                                particPrice: arr,
                                appendPrice: arr1,
                                deliveryScale: arr2,
                                routinePrice: arr3,
                                salesAward: arr4,
                                halfOffSample: arr5,
                                highSample: arr6,
                                extractSteps: arr7,
                                name: values.name,
                                classCode: values.classCode.join(','),
                                brandCode: this.BrandObjArr[0],
                                beginTime: moment(values.beginTime).format('YYYY-MM-DD'),
                                endTime: moment(values.endTime).format('YYYY-MM-DD'),
                                effectStoreCode: this.tempObjArr.join(','),
                                note: values.note
                            },
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        axios({
                            path: 'ChannelDefineUpdate',
                            method: 'post',
                            body: {
                                id: this.keyId,
                                particPrice: arr,
                                appendPrice: arr1,
                                deliveryScale: arr2,
                                routinePrice: arr3,
                                salesAward: arr4,
                                halfOffSample: arr5,
                                highSample: arr6,
                                extractSteps: arr7,
                                name: values.name,
                                classCode: values.classCode.join(','),
                                brandCode: this.BrandObjArr[0],
                                beginTime: moment(values.beginTime).format('YYYY-MM-DD'),
                                endTime: moment(values.endTime).format('YYYY-MM-DD'),
                                effectStoreCode: this.tempObjArr.join(','),
                                note: values.note,
                                createStore: this.$store.getters.storeInfo.code
                            },
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    }
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },

        /**
         * @name: 品类监听事件
         * @msg:
         * @param {type}
         * @return:
         */
        onChangeClassCode (idH) {
            console.log(idH)
            this.detailsObj.classCodeId = idH
        },
        /**
         * @name: 单选返回
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (checkedList) {
            this.indeterminate = !!checkedList.length && (checkedList.length < plainOptions.length)
            this.checkAll = checkedList.length === plainOptions.length
        },
        /**
         * @name: 全选
         * @msg:
         * @param {type}
         * @return:
         */
        onCheckAllChange (e) {
            Object.assign(this, {
                checkedList: e.target.checked ? plainOptions : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
            if (this.checkedList.length === 0) {
                this.checkedList = ['特价机']
                this.onChange(this.checkedList)
            }
        },
        /**
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        queryType () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                console.log('品类', res)
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(d => {
                        d.key = d.code
                        d.title = `${d.code}-${d.name}`
                        d.value = d.code
                    })
                    this.typeArr = data
                }
            })
        },
        // initTree (data) {
        //     const arr = []
        //     data.forEach(d => {
        //         d.key = d.code
        //         d.title = `${d.code}-${d.name}`
        //         d.value = d.code
        //         if ('children' in d) {
        //             d.children = this.initTree(d.children)
        //         } else {
        //             d.isLeaf = true
        //         }
        //         arr.push(d)
        //     })
        //     return arr
        // },
        /**
         * @name: 获取品牌
         * @msg:
         * @param {type}
         * @return:
         */
        queryBrand () {
            axios({
                path: 'GoodsBrandFind',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = [...data]
                }
            })
        },
        /**
         * @name: 获取生效机构
         * @msg:
         * @param {type}
         * @return:
         */
        queryFenDian () {
            axios({
                path: 'OrganizationStoreQueryStoreByOrganize',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data)
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
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'wholesale_strategy_define_status:1') {
                this.disContextMenu = []
            } else if (status === 'wholesale_strategy_define_status:2' || status === 'wholesale_strategy_define_status:3' || status === 'wholesale_strategy_define_status:4') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
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
            if (e === 'add') {
                this.addEdit = 'add'
                this.orderId = ''
                this.tags = []
                this.detailsObj = {
                    classCodeId: [],
                    startTime: moment(),
                    finishTime: moment().add({ months: 1 })
                }
                this.checkedList = ['特价机']
                this.BaseMessageObj = {
                    name: '',
                    classCode: [],
                    brandCode: '',
                    beginTime: moment(),
                    endTime: moment().add({ months: 1 }),
                    effectStoreCode: '',
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.tempObjArr = []
                this.BrandObjArr = []
                this.addEditModel = true
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ChannelDefineQuery', this.seachValue)
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
            e.path = 'ChannelDefineQuery'
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
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const arr = []
            arr.push(e.id)
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'ChannelDefineAudit',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
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
        onDel (e) {
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    if (statusArr[item] === 'wholesale_strategy_define_status:2') {
                        this.$message.warning('选中数据存在已审核数据，不可删除')
                        return
                    } else if (statusArr[item] === 'wholesale_strategy_define_status:3') {
                        this.$message.warning('选中数据存在已生效数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'ChannelDefineDelete',
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
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'wholesaleChannelist') {
                this.queryType()
                this.queryBrand()
                this.queryFenDian()
            }
        },
        checkedList: {
            handler (val, oldval) {
                if (val.length === 1) {
                    this.soleArr = val
                }
                if (val.length === 0) {
                    this.checkedList = this.soleArr
                    this.onChange(this.checkedList)
                }
                if (val.includes(plainOptions[0])) {
                    this.SpecialShow = true
                } else {
                    this.SpecialShow = false
                }
                if (val.includes(plainOptions[1])) {
                    this.PolicyShow = true
                } else {
                    this.PolicyShow = false
                }
                if (val.includes(plainOptions[2])) {
                    this.scaleShow = true
                } else {
                    this.scaleShow = false
                }
                if (val.includes(plainOptions[3])) {
                    this.RegularPolicyShow = true
                } else {
                    this.RegularPolicyShow = false
                }
                if (val.includes(plainOptions[4])) {
                    this.salesIncentiveShow = true
                } else {
                    this.salesIncentiveShow = false
                }
                if (val.includes(plainOptions[5])) {
                    this.HalfOffShow = true
                } else {
                    this.HalfOffShow = false
                }
                if (val.includes(plainOptions[6])) {
                    this.HighEndOutSampleShow = true
                } else {
                    this.HighEndOutSampleShow = false
                }
                if (val.includes(plainOptions[7])) {
                    this.PickUpTheGoodsShow = true
                } else {
                    this.PickUpTheGoodsShow = false
                }
            },
            immediate: true
        }
        // disabledDateString (val, oldval) {
        //     if (val) {
        //         if ((moment(val).add({ months: 1 })).isAfter(this.endTimeData)) {
        //             this.form.setFieldsValue({
        //                 endTime: moment(val).add({ months: 1 })
        //             })

        //         }
        //     }
        // }
    }

}
</script>
