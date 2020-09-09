<!--
 * @Description: 门店切换器
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-04-17 15:51:47
 * @LastEditTime: 2019-07-13 09:11:22
 -->
<template>
  <a-modal
    v-model="value"
    @ok="selectStore"
    @cancel="selectStore(-1)"
    :footer="null"
    :maskClosable="false"
    :keyboard="false"
    closable
    centered
  >
    <a-card title="选择登录机构" class="action-card" :loading="cardLoading">
      <template v-if="storeArr.length>0">
        <a-spin :spinning="spinLoading" tip="请稍后...">
          <a-card-grid class="store-action" style="width:50%;textAlign:'center'" v-for="(item, index) in storeArr" :key="index" @click="selectStore(item)">
            <a-row><span class="noselect">{{ `编号：${item.code}` }}</span></a-row>
            <a-row>
              <a-tooltip
                placement="top"
                :title="item.name"
                :mouseEnterDelay="0.3"
                arrowPointAtCenter>
                <span class="noselect text">{{ `机构：${item.name}` }}</span>
              </a-tooltip>
            </a-row>
          </a-card-grid>
        </a-spin>
      </template>
      <template v-else>
        <a-row><span style="margin-left:120px;">您还没有可以授权登录的机构</span></a-row>
        <!-- <a-row>
          <a-button style="margin-left:182px;margin-top:30px;" type="danger" @click="selectStore(-1)">关闭</a-button>
        </a-row> -->
      </template>
    </a-card>
  </a-modal>
</template>
<style lang="less" scoped>
.action-card{
    margin-top:15px;
    max-height:520px;
    overflow:auto;
    .store-action:active{
        background-color: #b6b6b6;
    }
}
.noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.text{
    display : inline-block;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
    width : 100%;
}
</style>

<script>
import { getStore } from '@/api/login'
import { mapActions } from 'vuex'
import { axios } from '@/utils/request'

export default {
    name: 'ChooseStore',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            cardLoading: false,
            spinLoading: false,
            storeArr: []
        }
    },
    methods: {
        ...mapActions(['Logout', 'setStore']),
        getStoreArr () {
            this.cardLoading = true
            getStore({ userId: this.$props.code }).then(res => {
                if (res.flag === 1) {
                    this.storeArr = res.data
                    this.cardLoading = false
                    if (this.storeArr.length === 1) {
                        this.selectStore(this.storeArr[0])
                    }
                    return true
                }
                return false
            })
        },
        selectStore (store) {
            this.spinLoading = true
            if (this.$store.getters.storeInfo && store.code === this.$store.getters.storeInfo.code) {
                this.$message.info('您当前就登录在此店！')
                this.$emit('onChange', false)
                return
            }
            if (store === -1) {
                this.$emit('onChange', false)
            } else {
                axios({
                    path: 'PermissionsRoleMenuQueryStoreInfo',
                    method: 'post',
                    body: { loginStoreId: store.id }
                }).then(res => {
                    if (res.flag === 1) {
                        this.setStore(store)
                        this.$emit('onChange', store)
                    } else {
                        this.spinLoading = false
                    }
                })
            }
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.spinLoading = false
                this.getStoreArr()
            }
        }
    }
}
</script>
