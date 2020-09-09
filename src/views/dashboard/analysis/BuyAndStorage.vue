<template>
  <a-row :gutter="10">
    <a-col :sm="24" :md="24" :xl="12" class="col" >
      <div class="storage reset">
        <ITItle text="采购入库统计" color="#fff" style="padding:30px 24px 21px" />
      </div>
      <a-table
        :pagination="false"
        :dataSource="dataSource"
        :columns="columns"
        :showHeader="false"
        :customRow="customRow"
      />
    </a-col>
    <a-col :sm="24" :md="24" :xl="12" class="col" >
      <div class="return reset">
        <ITItle text="采购退库统计" color="#fff" style="padding:30px 24px 21px" />
      </div>
      <a-table
        :pagination="false"
        :dataSource="dataSource"
        :columns="columns"
        :showHeader="false"
        :customRow="customRow"
      />
    </a-col>
  </a-row>
</template>
<script>
import ITItle from '../component/Title'
export default {
    components: {
        ITItle
    },
    data () {
        return {
            columns: [
                { title: 'SKU编码', width: 100, dataIndex: 'code' },
                { title: 'SKU名称', width: 100, dataIndex: 'name' },
                { title: '规格型号', width: 100, dataIndex: 'type' },
                { title: '调入位置', width: 100, dataIndex: 'inot' },
                { title: '调出位置', width: 100, dataIndex: 'out' },
                { title: '数量', width: 100, dataIndex: 'num' }
            ],
            dataSource: [
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' }
            ]
        }
    },
    methods: {
        customRow (row, index) {
            return {
                style: {
                    height: '30px',
                    background: index % 2 === 1 && '#f5f5f58a'
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url('./mixin');
.col{
    margin-bottom: 12px;
    display: flex
}
.storage{
    flex-shrink:0;
    height:220px;
    width: 270px;
    background:linear-gradient(141deg,rgba(55,189,246,1) 0%,rgba(80,91,246,1) 100%);
    box-shadow:0px 0px 14px 0px rgba(50,88,241,0.4);
    border-radius:4px;
}
.return{
    flex-shrink:0;
    height:220px;
    width: 270px;
    background:linear-gradient(141deg,rgba(252,190,115,1) 0%,rgba(245,82,82,1) 100%);
    box-shadow:0px 0px 14px 0px rgba(50,88,241,0.4);
    border-radius:4px;
}
/deep/ .ant-table-wrapper{
    height: 200px;
    margin-top: 10px;
    flex: 1 1;
    background: #fff;
    // .ant-table-tbody{
    // }
    td{
        white-space: nowrap;
        padding:6px 16px
    }
}
</style>
