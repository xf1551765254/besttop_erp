<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-09 14:04:24
 -->
<template>
  <div class="page-header-index-wide" style="padding:20px">
    <a-row :gutter="12" v-if="systemType===2" >
      <!-- 合同统计 -->
      <Contract/>
      <!-- 打款统计 -->
      <Remit/>
    </a-row>

    <!-- 内部调拨查询 -->
    <internalTransference v-if="systemType===2" />

    <!-- 订单统计 / 退货统计  -->
    <OrderAndReturns v-if="systemType===2" />
    <!-- --------------------- 仓储物流 ----------------------------- -->
    <!-- 物流配送数据统计 -->
    <Logistics v-if="systemType" />

    <!-- 今日签到司机 -->
    <DriverSingin v-if="systemType===1" />

    <!-- 采购 进/退 库  -->
    <!-- <BuyAndStorage v-if="!systemType===1" /> -->

    <!-- 仓库数据统计 -->
    <DataSrtoage v-if="systemType===1" />
    <!-- --------------------- 仓储物流 ----------------------------- -->

  </div>
</template>

<script>
// 盘点历史人数仪表盘
import Contract from './Contract'
import Remit from './Remit'
import ITItle from '../component/Title'
import OrderAndReturns from './OrderAndReturns'
import Returns from './Returns'
import Logistics from './Logistics'
import DriverSingin from './DriverSingin'
import DataSrtoage from './DataSrtoage'
import BuyAndStorage from './BuyAndStorage'
import internalTransference from './internalTransference'

export default {
    name: 'Analysis',
    components: {
        Contract,
        Remit,
        ITItle,
        Logistics,
        OrderAndReturns,
        Returns,
        DriverSingin,
        DataSrtoage,
        BuyAndStorage,
        internalTransference
    },
    data () {
        return {
            systemType: 1
        }
    }
}
</script>
