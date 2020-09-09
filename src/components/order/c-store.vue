<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-08 15:50:18
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-22 09:52:35
 -->
<template>
  <a-modal
    v-model="chooseStore"
    v-if="chooseStore"
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
          tableCode="bddc171ec3954356aea7530d835a6de8:storefrontInformation"
          @row-click="rowClick"
          @row-db-click="rowDbClick"
          @row-current-change="rowCurrentChange"
          :data="storeData"
          :height="490"/>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import MiniTable from './MiniTable'

export default {
    name: 'StoreModal',
    components: { MiniTable },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            chooseStore: false,
            treeData: [],
            treeProps: {
                children: 'children',
                label: 'title'
            },
            storeData: [],
            codeName: '',
            organize: '',
            timeIndex: null,
            rowData: {}
        }
    },
    async created () {
        await this.getOrganization()
        await this.getStoreData('')
    },
    mounted () {

    },
    methods: {
        cancel () {
            this.chooseStore = false
        },
        rowClick (row) {
            this.$refs.codeNameRef.focus()
        },
        rowDbClick (row) {
            this.rowData = row
            this.$emit('on-choose', this.rowData)
            this.chooseStore = false
        },
        enterKeyDown () {
            this.$refs.codeNameRef.blur()
            this.$emit('on-choose', this.rowData)
            this.chooseStore = false
        },
        upKeyDown () {
            const oldIndex = this.storeData.findIndex(o => o.code === this.rowData.code)
            if (oldIndex > 0) {
                this.rowData = this.storeData[oldIndex - 1]
                this.$refs.tableRef.setCurrentRow(this.rowData)
            }
        },
        downKeyDown () {
            const oldIndex = this.storeData.findIndex(o => o.code === this.rowData.code)
            if (oldIndex < this.storeData.length - 1) {
                this.rowData = this.storeData[oldIndex + 1]
                this.$refs.tableRef.setCurrentRow(this.rowData)
            }
        },
        rowCurrentChange (e) {
            const { val, oldval } = e
            this.rowData = val
        },
        async getOrganization () {
            const { flag, data } = await axios({
                path: 'OrganizationGroupFrameworkQueryOrganizationTree',
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
                await this.getStoreData('')
                return
            }
            if (expanded || isLeaf) {
                await this.getStoreData(data.key.split('-')[0])
            }
        },
        async getStoreData (organize) {
            this.organize = organize
            const { flag, data } = await axios({
                path: 'OrganizationStoreFindBySelected',
                body: { organize, rows: 50, page: 1 }
            })
            if (flag === 1) {
                this.storeData = data.list || []
                if (this.storeData.length > 0) {
                    this.rowData = this.storeData[0]
                }
            }
        }
    },
    watch: {
        value (val, oldval) {
            this.chooseStore = val
            if (val) {
                setTimeout(() => {
                    this.$refs.codeNameRef.focus()
                }, 500)
            }
        },
        chooseStore (val, oldval) {
            this.$emit('input', val)
        },
        codeName (val, oldval) {
            if (this.timeIndex) {
                clearTimeout(this.timeIndex)
            }
            this.timeIndex = setTimeout(async () => {
                if (val) {
                    const { flag, data } = await axios({
                        path: 'OrganizationStoreFindBySelected',
                        body: { condition: val, rows: 50, page: 1 }
                    })
                    if (flag === 1) {
                        this.storeData = data.list || []
                        if (this.storeData.length > 0) {
                            this.rowData = this.storeData[0]
                        }
                    }
                } else {
                    const { flag, data } = await axios({
                        path: 'OrganizationStoreFindBySelected',
                        body: { organize: this.organize, rows: 50, page: 1 }
                    })
                    if (flag === 1) {
                        this.storeData = data.list || []
                        if (this.storeData.length > 0) {
                            this.rowData = this.storeData[0]
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
