<template>
  <a-row style="margin-bottom: 12px;">
    <Card title="物流配送数据统计">
      <a-col :sm="24" :md="24" :xl="12">
        <div class="title">今日签到司机</div>
        <a-table
          :customRow="customRow"
          :columns="columns"
          :pagination="false"
          :dataSource="dataSource"
          size="middle"
        />
        <div class="title">调度工作统计</div>
        <a-table
          :customRow="customRow"
          :columns="columns"
          :pagination="false"
          :showHeader="false"
          :dataSource="dataSource"
          size="middle"
        />
      </a-col>
      <a-col :span="1" style="text-align: center">
        <a-divider type="vertical" class="divider" />
      </a-col>
      <a-col :sm="24" :md="24" :xl="10">
        <div class="title">库管工作统计</div>
        <Storekeeper />
      </a-col>
    </Card>
  </a-row>
</template>

<script>
import Card from '../component/Card'
import ITItle from '../component/Title'
import Storekeeper from './Storekeeper'

export default {
    components: {
        Card,
        Storekeeper,
        ITItle
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
    },
    data () {
        return {
            columns: [
                {
                    title: '序号',
                    customRender: (v, row, n) => (
                        <div style='padding-left:10px'>
                            <a-tag color={n < 3 ? '#f50' : '#1890FF'} >
                                {n + 1}
                            </a-tag>
                        </div>
                    )
                },
                { title: 'SKU编码', dataIndex: 'code' },
                { title: 'SKU名称', dataIndex: 'name' },
                { title: '规格型号', dataIndex: 'type' },
                { title: '调入位置', dataIndex: 'inot' },
                { title: '调出位置', dataIndex: 'out' },
                { title: '数量', dataIndex: 'num' }
            ],
            dataSource: [
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' }
            ]
        }
    }
}
</script>

<style lang="less" scoped>
@import url("./mixin");
/deep/.ant-table-wrapper {
  border-radius: 4px;
  border: 1px solid rgba(225, 228, 235, 1);
}
.col {
  margin-bottom: 12px;
  display: flex;
}
.divider {
  height: 500px;
  margin-top: 60px;
}
.storage {
  flex-shrink: 0;
  height: 300px;
  width: 270px;
  background: linear-gradient(141deg, #af52ff 0%, #87b7ff 100%);
  box-shadow: 0px 0px 14px 0px rgba(50, 88, 241, 0.4);
  border-radius: 4px;
}

.storage-table /deep/ .ant-table-wrapper {
  height: 280px;
  margin-top: 10px;
  flex: 1 1;
  background: #fff;
  overflow: auto;
  td {
    white-space: nowrap;
    padding: 6px 16px;
  }
}
.title {
  margin: 20px 0;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 500;
  color: rgba(96, 98, 102, 1);
  line-height: 20px;
}
</style>
