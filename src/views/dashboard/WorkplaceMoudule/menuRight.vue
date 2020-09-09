<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-12 11:30:49
 -->
<template>
  <div>
    <div class="title">
      <h3>菜单导航</h3>
      <a-button icon="plus" size="small" style="float: right;" @click="setFun">设置</a-button>
    </div>
    <a-modal
      title="菜单导航设置"
      :visible="authorizationVisible"
      @ok="authorizationOk"
      :confirmLoading="confirmLoading"
      @cancel="authorizationCancel"
    >
      <a-card hoverable class="action-card">
        <a-tree
          v-if="treeshow"
          checkable
          v-model="checkedKeys"
          @check="onCheck"
          :loading="treeLoading"
          :treeData="treeData"/>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import is from 'is_js'
import { axios } from '@/utils/request'
export default {
    name: 'Workplace',
    components: {
    },
    data () {
        return {
            // 弹框
            authorizationVisible: false,
            confirmLoading: false,
            treeData: [],
            treeshow: false,
            checkedKeys: [],
            treeLoading: false

        }
    },
    created () {

    },
    mounted () {

    },
    methods: {
        /**
         * @name: 复选框改变时，对数据做对应调整
         * @msg:
         * @param {type}
         * @return:
         */
        onCheck (selectedKeys) {
            this.chooseCheck(this.treeData, selectedKeys)
        },
        /**
         * @name: 根据复选框，处理数据的ischoose
         * @msg:
         * @param {type}
         * @return:
         */
        chooseCheck (treeData, keys) {
            treeData.forEach(t => {
                if (is.inArray(t.key, keys)) {
                    t.isChoose = 1
                } else {
                    t.isChoose = 0
                }
                if ('children' in t) {
                    this.chooseCheck(t.children, keys)
                }
            })
        },
        setFun () {
            // this.treeData.length = 0
            // this.checkedKeys.length = 0
            // this.treeLoading = true
            // const system = this.$store.getters.lastSystemName
            // axios({
            //     path: 'PermissionsRoleMenuQueryPermissionMenu',
            //     method: 'post',
            //     body: { sysType: system }
            // }).then(res => {
            //     if (res.flag === 1) {
            //         const data = res.data
            //         data.name = data.name.web
            //         console.log(data)
            //         this.treeData = this.initTreeData(data)
            //         this.authorizationVisible = true
            //         this.treeshow = true
            //         this.treeLoading = false
            //     }
            // })
            // this.treeData.length = 0
            // this.checkedKeys.length = 0
            // this.treeLoading = true
            // axios({
            //     path: 'PermissionsRoleMenuQueryAuthorization',
            //     method: 'post',
            //     body: { roleId: 'c368dc6ee0e44c0594b0e17be5b47186' }
            // }).then(res => {
            //     if (res.flag === 1) {
            //         this.treeData = this.initTreeData(res.data)
            //         this.authorizationVisible = true
            //         this.treeshow = true
            //         this.treeLoading = false
            //     }
            // })
        },
        /**
         * @name: 初始化树数据，遍历， 赋予层级关系key
         * @msg:
         * @param {type}
         * @return:
         */
        // initTreeData (data, y = 0) {
        //     const arr = []
        //     for (let i = 0; i < data.length; i++) {
        //         const x = {}
        //         x.key = `${y}-${i}`
        //         x.id = data[i].id
        //         x.isChoose = data[i].isChoose
        //         if (data[i].isLeaf) {
        //             x.isLeaf = data[i].isLeaf
        //             x.title = this.$t(`action.${data[i].name}`)
        //         } else {
        //             x.title = this.$t(`menu.${data[i].name}`)
        //         }
        //         if ('children' in data[i]) {
        //             x.children = this.initTreeData(data[i].children, x.key)
        //         }
        //         arr.push(x)
        //     }
        //     return arr
        // },
        authorizationOk () {
            console.log(this.treeData)
            console.log(this.checkedKeys)
        },
        authorizationCancel () {
            this.authorizationVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.title{
    font-family:PingFangSC-Regular;
    h3{
        display: inline-block;
        color: #ffffff;
    }
    button{
        display: inline-block;
    }
}
</style>
