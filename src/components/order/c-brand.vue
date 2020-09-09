<template>
  <a-modal
    v-model="chooseBrand"
    v-if="chooseBrand"
    :footer="null"
    :width="960"
    :closable="false">
    <div
      class="store-box"
      @keydown.enter="enterKeyDown"
      @keydown.up="upKeyDown"
      @keydown.down="downKeyDown">
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
          tableCode="234247c637af484797270e041bcee69b:commodityBrand"
          @row-click="rowClick"
          @row-db-click="rowDbClick"
          @row-current-change="rowCurrentChange"
          :data="brandData"
          :height="490"/>
        </mini-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { axios } from '@/utils/request'
import MiniTable from './MiniTable'

export default {
    name: 'BrandModal',
    components: { MiniTable },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            chooseBrand: false,
            brandData: [],
            codeName: '',
            organize: '',
            timeIndex: null,
            rowData: {}
        }
    },
    async created () {
        await this.getBrandData()
    },
    methods: {
        cancel () {
            this.chooseBrand = false
        },
        rowClick (row) {
            this.$refs.codeNameRef.focus()
        },
        rowDbClick (row) {
            this.rowData = row
            this.$emit('on-choose', this.rowData)
            this.chooseBrand = false
        },
        enterKeyDown () {
            this.$refs.codeNameRef.blur()
            this.$emit('on-choose', this.rowData)
            this.chooseBrand = false
        },
        upKeyDown () {
            const oldIndex = this.brandData.findIndex(o => o.code === this.rowData.code)
            if (oldIndex > 0) {
                this.rowData = this.brandData[oldIndex - 1]
                this.$refs.tableRef.setCurrentRow(this.rowData)
            }
        },
        downKeyDown () {
            const oldIndex = this.brandData.findIndex(o => o.code === this.rowData.code)
            if (oldIndex < this.brandData.length - 1) {
                this.rowData = this.brandData[oldIndex + 1]
                this.$refs.tableRef.setCurrentRow(this.rowData)
            }
        },
        rowCurrentChange (e) {
            const { val, oldval } = e
            this.rowData = val
        },
        async getBrandData () {
            const { flag, data } = await axios({
                path: 'GoodsBrandFindBySelected',
                body: { rows: 50, page: 1 }
            })
            if (flag === 1) {
                this.brandData = data.list || []
                if (this.brandData.length > 0) {
                    this.rowData = this.brandData[0]
                }
            }
        }
    },
    watch: {
        value (val, oldval) {
            this.chooseBrand = val
            if (val) {
                setTimeout(() => {
                    this.$refs.codeNameRef.focus()
                }, 500)
            }
        },
        chooseBrand (val, oldval) {
            this.$emit('input', val)
        },
        codeName (val, oldval) {
            if (this.timeIndex) {
                clearTimeout(this.timeIndex)
            }
            this.timeIndex = setTimeout(async () => {
                if (val) {
                    const { flag, data } = await axios({
                        path: 'GoodsBrandFindBySelected',
                        body: { condition: val, rows: 50, page: 1 }
                    })
                    if (flag === 1) {
                        this.brandData = data.list || []
                        if (this.brandData.length > 0) {
                            this.rowData = this.brandData[0]
                        }
                    }
                } else {
                    const { flag, data } = await axios({
                        path: 'GoodsBrandFindBySelected',
                        body: { rows: 50, page: 1 }
                    })
                    if (flag === 1) {
                        this.brandData = data.list || []
                        if (this.brandData.length > 0) {
                            this.rowData = this.brandData[0]
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
