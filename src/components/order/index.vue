<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-12 18:35:04
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-23 10:42:20
 -->
<template>
  <div class="table-box">
    <a-skeleton :loading="tableLoading" active :paragraph="{rows: 5}">
      <el-table
        :data="tableData"
        :height="height"
        style="width: 100%"
        size="mini"
        sum-text="合计"
        empty-tex="暂无数据"
        header-cell-class-name="header-cell"
        @cell-click="onCellClick"
        :show-summary="showSum"
        border>
        <table-header
          @onDel="onDelTableData"
          @onCopy="onCopyTableData"
          @onEditCell="onEditCell"
          @onCellBtnClick="onCellBtnClick"
          @onGetSelectOption="getSelectOption"
          v-model="editCell"
          :canEditList="canEditList"
          :rowData="rowData"
          :headerData="tableHeaderData"/>
      </el-table>
    </a-skeleton>
    <store-modal v-model="chooseStoreModal" @on-choose="onChoose"></store-modal>
    <class-modal v-model="chooseClassModal" @on-choose="onChoose"></class-modal>
    <brand-modal v-model="chooseBrandModal" @on-choose="onChoose"></brand-modal>
    <goods-modal v-model="chooseGoodsModal" :showHeader="showGoodsHeader" @on-choose="onChoose"></goods-modal>
    <sku-modal v-model="chooseSkuModal" :showHeader="showSkuHeader" @on-choose="onChoose"></sku-modal>
    <upload-modal v-model="chooseFileModal" @on-choose="onChoose" :fixedNumber="fixedNumber" :img="img"></upload-modal>
  </div>
</template>

<script>
import TableHeader from './TableHeader'
import StoreModal from './c-store'
import ClassModal from './c-class'
import BrandModal from './c-brand'
import GoodsModal from './c-goods'
import SkuModal from './c-sku'
import UploadModal from './c-upload'
import { uuid } from 'vue-uuid'

export default {
    name: 'Order',
    components: { TableHeader, StoreModal, ClassModal, BrandModal, GoodsModal, UploadModal, SkuModal },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        height: {
            type: Number,
            default: 550
        },
        headerData: {
            type: Array,
            default: () => []
        },
        canEditCell: {
            type: Array,
            default: () => []
        },
        showSum: {
            type: Boolean,
            default: false
        },
        showGoodsHeader: {
            type: Array,
            default: () => []
        },
        showSkuHeader: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            tableLoading: false,
            editCell: {},
            rowData: {},
            canEditList: [],
            chooseStoreModal: false,
            chooseClassModal: false,
            chooseBrandModal: false,
            chooseGoodsModal: false,
            chooseSkuModal: false,
            chooseFileModal: false,
            tableHeaderData: [],
            tableData: [],
            editCache: {},
            fixedNumber: [1, 1],
            img: ''
        }
    },
    created () {
        while (this.tableData.length < 3) {
            this.tableData.push({})
        }
        this.tableData.map(o => {
            if (!o.__id) {
                o.__id = uuid.v1().replace(/-/g, '')
            }
        })
    },
    methods: {
        getSelectOption (e) {
            this.$emit('getSelectOption', e)
        },
        getTableData () {
            return [...this.tableData]
        },
        // 选择结束
        onChoose (chooseData) {
            const { rowId, header, row } = this.editCache
            // if (header.modalType === 'store') {

            // }
            const index = this.tableData.findIndex(o => o.__id === rowId)
            if (index >= 0) {
                Object.keys(header.chooseIndex).map(o => {
                    this.$set(this.tableData[index], header.chooseIndex[o], chooseData[o])
                })
            }
            this.editCell = {
                __id: this.tableData[index].__id,
                __property: header.dataIndex,
                __fileProportion: header.fileProportion
            }
            this.rowData = { ...this.tableData[index] }
        },
        onEditCell (val, index, dataIndex) {
            // console.log(this.tableData[index])
            this.$set(this.tableData[index], dataIndex, val)
        },
        // 删除行
        onDelTableData (row) {
            if (this.tableData.length < 4) {
                this.tableData.push({ __id: uuid.v1().replace(/-/g, '') })
            }
            const index = this.tableData.findIndex(o => o.__id === row.__id)
            this.tableData.splice(index, 1)
        },
        // 复制行
        onCopyTableData (row) {
            const index = this.tableData.findIndex(o => o.__id === row.__id)
            const newRow = {
                ...this.tableData[index],
                __id: uuid.v1().replace(/-/g, '')
            }
            if (newRow.id) {
                delete newRow.id
            }
            this.tableData.splice(index + 1, 0, newRow)
        },
        // 单元格单击
        onCellClick (row, column, cell, event) {
            this.editCell = {
                __id: row.__id,
                __property: column.property,
                __fileProportion: column.fileProportion
            }
            this.rowData = { ...row }
        },
        onCellBtnClick (e) {
            const { rowId, header, row } = e
            console.log(e)
            this.editCache = { ...e }
            if (header.modalType) {
                this.editCell = {
                    __id: row.__id,
                    __property: header.dataIndex,
                    __type: header.modalType,
                    __fileProportion: header.fileProportion
                }
                switch (header.modalType) {
                case 'store': this.chooseStoreModal = true; break
                case 'class': this.chooseClassModal = true; break
                case 'brand': this.chooseBrandModal = true; break
                case 'goods': this.chooseGoodsModal = true; break
                case 'sku': this.chooseSkuModal = true; break
                case 'file':
                    this.chooseFileModal = true
                    this.img = row[header.dataIndex] || ''
                    if (header.fileProportion.fixedCustom) {
                        const obj = header.fileProportion.fixedCustom
                        if (row[obj.key] === obj.value) {
                            this.fixedNumber = obj.fixedNumber
                        } else {
                            this.fixedNumber = header.fileProportion.fixedNumber || [1, 1]
                        }
                    } else {
                        this.fixedNumber = header.fileProportion.fixedNumber || [1, 1]
                    }
                    break
                default: break
                }
            }
        }

    },
    watch: {
        editCell: {
            handler (val, oldval) {
                if (typeof val.__index === 'number') {
                    if (val.__index >= this.tableData.length - 1) {
                        this.tableData.push({
                            __id: uuid.v1().replace(/-/g, '')
                        })
                    }
                    this.editCell.__id = this.tableData[val.__index].__id
                    switch (val.__type) {
                    case 'store': this.chooseStoreModal = true; break
                    case 'class': this.chooseClassModal = true; break
                    case 'brand': this.chooseBrandModal = true; break
                    case 'goods': this.chooseGoodsModal = true; break
                    case 'sku': this.chooseSkuModal = true; break
                    case 'file':
                        this.chooseFileModal = true
                        this.img = ''
                        this.fixedNumber = val.__fileProportion.fixedNumber || [1, 1]
                        // this.autoCropWidth = val.__fileProportion.width
                        // this.autoCropHeight = val.__fileProportion.height
                        break
                    default: break
                    }
                }
            },
            deep: true
        },
        headerData: {
            handler (val, oldval) {
                this.tableHeaderData = [...val]
            },
            deep: true,
            immediate: true
        },
        canEditCell: {
            handler (val, oldval) {
                this.canEditList = val
            },
            deep: true,
            immediate: true
        },
        data: {
            handler (val, oldval) {
                const data = [...val]
                while (data.length < 3) {
                    data.push({})
                }
                data.map(o => {
                    if (!o.__id) {
                        o.__id = uuid.v1().replace(/-/g, '')
                    }
                })
                this.tableData = [...data]
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style lang="less">
.table-box{
    padding:10px;
    .el-table--mini td{
        padding: 0;
    }
    .header-cell{
        padding: 4px 6px;
    }
    .el-table th>.cell{
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
    }
    .el-table .cell{
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
        padding-left: 0px;
        padding-right: 0px;
    }
    .cell .ant-input{
        padding:4px 2px;
        height: 100%;
        font-size: 12px;
        border-radius: 0px;
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
    }
}
</style>
