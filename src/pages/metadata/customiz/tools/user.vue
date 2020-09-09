<!--
 * @Description: 用户选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-26 17:49:56
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择成员"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-col :span="24">
                <a-col :span="4" class="rowTitle">所属机构</a-col>
                <a-col :span="20">
                  <a-select
                    placeholder="请选择所属机构"
                    style="width: 100%;"
                    v-model="orgCode"
                    :options="OrganizationArr"
                    @select="selectOrgniza"
                    :filterOption="filterOption"
                    showSearch/>
                </a-col>
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:300, y:460}"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
                  :columns="columns"
                  :pagination="false"
                  :dataSource="dataSource"
                  size="small"
                  bordered>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <div class="rowTitle">指定成员：</div>
            <a-card hoverable class="card-box table-nowrap" style="min-height:100px; margin-top:10px;">
              <div v-for="(item, index) in userList" :key="`b + ${index}`" style="margin-top: 5px;">
                <div style="display: flex;">
                  <div style="width: 90%;">{{ `${item.storeCode}机构  :  ${item.code}-${item.name}` }}</div>
                  <div @click="deleteUser(item)"><a-icon type="close"></a-icon></div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" :disabled="isNotMulSelect">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    .ant-modal-wrap{
        z-index: 4000;
    }
    .card-box{
        max-height:540px;
        overflow:auto;
        .title{
            font-weight: bold;
        }
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
    .rowTitle{
        line-height: 36px;
    }
</style>

<script>
import { axios } from '@/utils/request'
import map from 'lodash.map'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        defaultSelect: {
            type: Array,
            default: () => []
        },
        userType: {
            type: Number,
            default: 2
        }
    },
    data () {
        return {
            spinning: false,
            selectedRowKeys: [],
            columns: [
                { title: '用户编码', dataIndex: 'code', width: 100 },
                { title: '用户名称', dataIndex: 'name' }
            ],
            dataSource: [],
            orgCode: '',
            OrganizationArr: [],
            userList: [],
            store: ''
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            if (this.userList.length > 0) {
                this.$emit('onSelect', this.userList)
            }
            this.selectedRowKeys.length = 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
            selectedRowKeys.forEach(o => {
                const has = this.userList.filter(i => i.code === o)
                if (has.length === 0) {
                    const user = this.dataSource.find(k => k.code === o)
                    this.userList.push({
                        type: this.$props.userType,
                        code: user.code,
                        name: user.name,
                        storeCode: this.store.split('-')[0]
                    })
                }
            })
        },
        deleteUser (item) {
            this.selectedRowKeys = this.selectedRowKeys.filter(o => o !== item.code)
            this.userList = this.userList.filter(o => o.code !== item.code)
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (val) {
            this.dataSource = []
            this.spinning = true
            axios({
                path: 'PermissionsUserQuery',
                method: 'POST',
                body: {
                    storeId: val
                }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                }
            })
        },
        /**
         * @name:新增/编辑模态框获取组织机构
         */
        getOrganization () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item) => {
                        item.key = item.id
                        item.title = `${item.code}-${item.name}`
                        item.value = item.id
                    })
                    this.OrganizationArr = [...data]
                }
            })
        },
        selectOrgniza (val, node) {
            if (val) {
                this.store = node.componentOptions.propsData.title
                this.getData(val)
            } else {
                this.dataSource = []
            }
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.getOrganization()
                if (this.$props.defaultSelect.length > 0) {
                    this.selectedRowKeys = map(this.$props.defaultSelect, 'code')
                    this.userList = [ ...this.$props.defaultSelect ]
                } else {
                    this.selectedRowKeys.length = 0
                    this.userList.length = 0
                }
            }
        }
    }
}
</script>
