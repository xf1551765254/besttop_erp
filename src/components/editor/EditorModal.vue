<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-04-19 11:18:10
 * @LastEditTime: 2019-08-19 17:09:32
 -->
<template>
  <div>
    <bt-modal
      v-model="valuea"
      :title="`${title}文案编辑`"
      :submitClick="editSub"
      @onClose="editClose"
    >
      <template slot="footer" v-if="type=='goods'">
        <a-button type="primary" @click="previewEditor" style="margin-left:10px;">预览</a-button>
      </template>
      <editor v-model="text"></editor>
    </bt-modal>
    <bt-modal
      v-model="previewGoods"
      title="商品预览"
      :subBtn="false">
      <div class="goods" type="flex" justify="center">
        <div class="details" v-if="type=='goods'">
          <!-- <img v-if="goods.goodsPic&&goods.goodsPic[0]" :src="goods.goodsPic[0]||''" alt="" class="goods-img">
          <img v-else src="@assets/goods.png" alt="" class="goods-img"> -->
          <div class="left">
            <div style="width: 400px; height: 400px;border: 1px solid #F5F5F5;" >
              <img style="width: 100%; height: 100%;" :src="bigImg" />
            </div>
            <div class="spec-list">
              <span class="el-icon-arrow-left spec-icon" @click="clickPrev()"></span>
              <div class="spec-items">
                <ul ref="specUl">
                  <li v-for="(i,index) in goods.goodsPic" :key="index">
                    <img :src="i" @click="clickImg(i)"/>
                  </li>
                </ul>
              </div>
              <span class="el-icon-arrow-right spec-icon" @click="clickNext(goods.goodsPic)"></span>
            </div>
          </div>
          <div class="operation">
            <h1>{{ goods.code }}  {{ goods.name }}  {{ goods.model }} </h1>
            <div class="specifications">
              <div v-for="item in skuList" :key="item.skuCode" class="sku-item">
                <div class="item-title">
                  <span>{{ item.code }} {{ item.name }}</span>
                </div>
                <div class="item-price">零售价：
                  <span style="color: red;">
                    ¥ {{ item.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="introdution ql-editor" v-html="text"></div>
      </div>
    </bt-modal>
  </div>
</template>
<style lang="less" scoped>
    .goods{
        width: calc(100% * 0.8);
        margin: 0 auto;
        // overflow: hidden;
        .details{
            overflow: hidden;
            margin-bottom: 10px;
            .left{
                float: left;
                width: 400px;
                .spec-list{
                    margin-bottom: 18px;
                    height: 100px;
                    .spec-icon{
                        font-size: 21px;
                        // display: block;
                        width: 30px;
                        height: 80px;
                        float: left;
                        line-height: 80px;
                        font-weight: 800;
                        cursor: pointer;
                    }
                    .spec-items {
                        float: left;
                        width: 340px;
                        height: 80px;
                        position: relative;
                        overflow: hidden;
                        margin: 0 auto;
                        ul{
                            list-style: none;
                            width: 100%;
                            padding: 0;
                            position: absolute;
                            height: 100%;
                            left: 0;
                            display: flex;
                            flex-wrap: nowrap;
                            li{
                                margin: 0 3px;
                            }
                            img{
                                border: 2px solid #fff;
                                vertical-align: middle;
                                width: 75px;
                                height: 75px;
                            }
                        }
                    }
                }
            }
            .operation{
                float: left;
                width: calc(100% - 430px);
                margin-left: 20px;
                >h1{
                    color: #333333;
                    font-size: 20px;
                }
                >h3{
                    color: #333333;
                    span{
                        color: #D35C57;
                    }

                }
                .sku-item{
                    border-bottom: 1px solid #989898;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    .item-title{
                        width: 60%;
                        line-height: 40px;
                    }
                    .item-price{
                        width: 40%;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        line-height: 40px;
                        text-align: right;
                    }
                }
            }

        }
        .introdution{
            width: 100%;
            padding-top: 10px;
            border-top: 1px solid #989898;
        }
    }
</style>
<script>
import { axios } from '@/utils/request'
import editor from './editor'
import BtModal from '@comp/Modal'
export default {
    name: 'EditorModal',
    components: { editor, BtModal },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        pams: {
            type: Object,
            default: () => {}
        },
        goods: {
            type: Object,
            default: () => {}
        }
    },
    data: function () {
        return {
            text: '',
            title: '',
            valuea: false,
            previewGoods: false,
            skuList: [],
            imgLeftNum: 4,
            bigImg: ''
        }
    },
    mounted () {

    },
    methods: {
        previewEditor () {
            this.getSkuList()
            console.log('goods', this.$props.goods)
            this.bigImg = this.$props.goods.goodsPic[0]
            this.previewGoods = true
        },
        editClose () {
            this.text = ''
            this.$emit('input', false)
        },
        editSub () {
            if (!this.$props.type) {
                this.$logger.error('未配置TYPE')
                return
            }
            axios({
                path: 'IntroductionSaveIntroduction',
                method: 'post',
                body: {
                    ...this.$props.pams,
                    type: this.$props.type,
                    introduction: this.text
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.text = ''
                    this.$emit('input', false)
                }
            })
        },
        getEdit () {
            if (this.$props.type) {
                axios({
                    path: 'IntroductionFindIntroduction',
                    method: 'post',
                    body: {
                        ...this.$props.pams,
                        type: this.$props.type
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data && res.data[0] && res.data[0].introduction) {
                            this.text = res.data[0].introduction
                        }
                    }
                })
            }
        },
        getSkuList () {
            this.skuList = []
            const goodsCode = this.$props.goods.code
            axios({
                path: 'GoodsSkuCopywriterPriview',
                method: 'POST',
                body: {
                    goodsCode: goodsCode,
                    page: 1,
                    rows: 100
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.skuList = [...res.data.list]
                }
            })
        },
        clickPrev () {
            if (this.imgLeftNum > 4) {
                this.imgLeftNum -= 4
                const specDiv = this.$refs.specUl
                specDiv.style.left = `${(4 - this.imgLeftNum) * 85}px`
            }
        },
        clickNext (imgList) {
            if (imgList.length > 4 && imgList.length > this.imgLeftNum) {
                this.imgLeftNum += 4
                const specDiv = this.$refs.specUl
                specDiv.style.left = `${(4 - this.imgLeftNum) * 85}px`
            }
        },
        clickImg (img) {
            this.bigImg = img
        }
    },
    watch: {
        value: {
            handler (val) {
                this.valuea = val
                if (val) {
                    if (this.$props.pams.id) {
                        this.getEdit()
                    }
                    switch (this.$props.type) {
                    case 'goods':
                        this.title = '商品'
                        break
                    case 'supplier':
                        this.title = '供应商'
                        break
                    case 'channel':
                        this.title = '渠道客户'
                        break
                    default:
                        break
                    }
                }
            }
        },
        valuea (val) {
            this.$emit('input', val)
        }
    }
}
</script>
