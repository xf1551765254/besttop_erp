<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-08 15:50:18
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-22 09:15:20
 -->
<template>
  <a-modal
    v-model="chooseGoods"
    v-if="chooseGoods"
    @cancel="cancel"
    :footer="null"
    :width="960"
    :closable="false">
    <div
      class="store-box"
      @keydown.enter="enterKeyDown"
      @keydown.up="upKeyDown"
      @keydown.down="downKeyDown">
      <div class="store-box-left">
        <el-tree
          :data="treeData"
          :props="treeProps"
          :default-expanded-keys="['000']"
          node-key="key"
          @node-click="handleNodeClick"
          highlight-current
          accordion>
        </el-tree>
      </div>
      <div class="store-box-right">
        <div class="store-box-right-seach">
          <a-row>
            <a-col span="2"><div class="title">检索：</div></a-col>
            <a-col span="6">
              <el-input ref="codeNameRef" v-model="codeName" placeholder="请输入编码/名称" size="mini" onfocus="this.select()"></el-input>
            </a-col>
            <a-col span="8">

            </a-col>
            <a-col span="8">

            </a-col>
          </a-row>
        </div>
        <mini-table
          ref="tableRef"
          tableCode="b738cbce2d3241f0abf0d2ecbf59fedc:commodityInfo"
          @row-click="rowClick"
          @row-db-click="rowDbClick"
          @row-current-change="rowCurrentChange"
          :data="goodsData"
          :showHeader="showHeader"
          :height="490"></mini-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import MiniTable from './MiniTable'

export default {
  name: 'GoodsModal',
  components: { MiniTable },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      chooseGoods: false,
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'title'
      },
      goodsData: [],
      codeName: '',
      classCode: '',
      timeIndex: null,
      rowData: {}
    }
  },
  async created () {
    await this.getOrganization()
    await this.getGoodsData('')
  },
  methods: {
    cancel () {
      this.chooseGoods = false
    },
    rowClick (row) {
      this.$refs.codeNameRef.focus()
    },
    rowDbClick (row) {
      this.rowData = row
      this.$emit('on-choose', this.rowData)
      this.chooseGoods = false
    },
    enterKeyDown () {
      this.$refs.codeNameRef.blur()
      this.$emit('on-choose', this.rowData)
      this.chooseGoods = false
    },
    upKeyDown () {
      const oldIndex = this.goodsData.findIndex(o => o.code === this.rowData.code)
      if (oldIndex > 0) {
        this.rowData = this.goodsData[oldIndex - 1]
        this.$refs.tableRef.setCurrentRow(this.rowData)
      }
    },
    downKeyDown () {
      const oldIndex = this.goodsData.findIndex(o => o.code === this.rowData.code)
      if (oldIndex < this.goodsData.length - 1) {
        this.rowData = this.goodsData[oldIndex + 1]
        this.$refs.tableRef.setCurrentRow(this.rowData)
      }
    },
    rowCurrentChange (e) {
      const { val, oldval } = e
      this.rowData = val
    },
    async getOrganization () {
      const { flag, data } = await axios({
        path: 'GoodsCategoryFindClassTree',
        body: {}
      })
      if (flag === 1) {
        this.treeData = [data.tree]
      }
    },
    // 点击/展开树节点，查询对应架构下的机构，如果点的是全部数据，无论展开合起，都查全部。
    async handleNodeClick (obj, node, el) {
      const { expanded, isLeaf, data } = node
      if (data.key === '000') {
        await this.getGoodsData('')
        return
      }
      if (expanded || isLeaf) {
        await this.getGoodsData(data.key.split('-')[0])
      }
    },
    async getGoodsData (classCode) {
      this.classCode = classCode
      const { flag, data } = await axios({
        path: 'GoodsInformationFindGoodsList',
        body: { classCode, rows: 50, page: 1 }
      })
      if (flag === 1) {
        this.goodsData = data.list || []
        if (this.goodsData.length > 0) {
          this.rowData = this.goodsData[0]
        }
      }
    }
  },
  watch: {
    value (val, oldval) {
      this.chooseGoods = val
      if (val) {
        setTimeout(() => {
          this.$refs.codeNameRef.focus()
        }, 500)
      }
    },
    chooseGoods (val, oldval) {
      this.$emit('input', val)
    },
    codeName (val, oldval) {
      if (this.timeIndex) {
        clearTimeout(this.timeIndex)
      }
      this.timeIndex = setTimeout(async () => {
        if (val) {
          const { flag, data } = await axios({
            path: 'GoodsInformationFindGoodsList',
            body: { name: val, rows: 50, page: 1 }
          })
          if (flag === 1) {
            this.goodsData = data.list || []
            if (this.goodsData.length > 0) {
              this.rowData = this.goodsData[0]
            }
          }
        } else {
          const { flag, data } = await axios({
            path: 'GoodsInformationFindGoodsList',
            body: { classCode: this.classCode, rows: 50, page: 1 }
          })
          if (flag === 1) {
            this.goodsData = data.list || []
            if (this.goodsData.length > 0) {
              this.rowData = this.goodsData[0]
            }
          }
        }
      }, 500)
    }
  }
}
</script>
<style lang="less">
.store-box{
    width: 100%;
    height: 100%;
    max-height: 550px;
    min-height: 400px;
    display: flex;
    display: -webkit-flex;

    &-left {
        order: -1;
        flex-basis: 220px;
        max-width: 220px;
        max-height: 550px;
        border: 1px solid #e8e8e8;
        overflow: auto;
    }
    &-right{
        flex-grow:1;
        max-height: 550px;
        width: 0;
        &-seach{
            height: 52px;
            padding: 10px;
            .title{
                width: 100%;
                line-height: 24px;
                font-weight: bold;
                font-size: 12px;
                white-space: nowrap;
                text-overflow:ellipsis;
                overflow:hidden;
                text-align: right;
                font-weight: bold;
            }
        }
    }
}
</style>
