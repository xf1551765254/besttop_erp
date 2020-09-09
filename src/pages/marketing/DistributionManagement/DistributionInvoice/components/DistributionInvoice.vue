<!--
 * @Description: 分销订单
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-04-17 10:46:14
 * @LastEditTime: 2019-08-22 09:31:11
 -->
<template>
  <div class="distributionInvoice">
    <!-- 搜索栏 -->
    <a-row :gutter="10" type="flex" justify="center" class="search">
      <a-col :xxl="8" :xl="8" :md="16">
        <a-input-search v-model="searchParam" placeholder="请输入您要搜索的商品名称/商品编号/规格型号" @search="onSearch" enterButton size="large"/>
      </a-col>
      <a-col :xxl="8" :xl="12" :md="16" class="operation">
        <a-col>
          <a-button-group size="large">
            <a-button size="large" class="customer-name" v-if="customerCode" @click="showDrawer('2')">{{ customerCode+'-'+customer||'请选择渠道客户' }}</a-button>
            <a-button size="large" class="customer-name" v-else @click="showDrawer('2')">{{ '请选择渠道客户' }}</a-button>
            <a-button icon="plus-circle" size="large" @click="showDrawer('1')"></a-button>
          </a-button-group>
        </a-col>
        <a-col>
          <a-button size="large" @click="onOPenCustomer" style="width:102px">待确认({{ customerCode?billSelectSkuCount:0 }})</a-button>
        </a-col>
        <a-col>
          <a-button type="primary" size="large" @click="isChange(2)">开票主页({{ selectBillCount }})</a-button>
        </a-col>
      </a-col>
    </a-row>
    <!-- 筛选栏 -->
    <a-row type="flex" justify="center" >
      <a-col :xxl="16" :xl="20" :md="16" class="screening">
        <a-row type="flex" justify="space-around">

          <a-col :span="24">
            <a-row type="flex" justify="start">
              <a-form
                layout="inline"
              >
                <a-form-item>
                  <a-radio-group :defaultValue="salesApproach" buttonStyle="solid" @change="SalesChange">
                    <a-radio-button value="0">经销</a-radio-button>
                    <a-radio-button value="1">代销</a-radio-button>
                  </a-radio-group>
                </a-form-item>
                <a-form-item
                  label="提货类型"
                >
                  <a-select :value="packupCode" style="width: 160px" @change="packupChange">
                    <a-select-option :value="item.value" v-for="(item,index) in pickupType" :key="index">{{ item.key }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="提货位置"
                >
                  <a-select :value="warehouse.code" style="width: 200px" @change="handleChange">
                    <a-select-option :value="item.code" v-for="item in WarehouseList" :key="item.code">{{ item.code }} - {{ item.name }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-row>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 商品列表 -->
    <a-row type="flex" justify="center">
      <a-col span="18">
        <ul class="dist-goods">
          <li v-for="(item,index) in goods" :key="index" @click="goodsDetails(item)">
            <img v-if="item.mainGoodsPic[0]" :src="item.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="item.mainGoodsName">
            <img v-else src="@assets/goods.png" :alt="item.mainGoodsName">
            <h6>{{ item.mainGoodsName }} {{ item.mainGoodsModel }}</h6>
            <h6>{{ item.mainGoodsCode }}</h6>
            <p>分销价：<span>{{ item.minPrice.toFixed(2) }}～{{ item.maxPrice.toFixed(2) }}</span> </p>
          </li>
        </ul>
        <a-pagination showQuickJumper :defaultCurrent="page.current" :total="page.total" :pageSize.sync="this.page.pageSize" @change="pageChange" />
      </a-col>
    </a-row>
    <!-- 抽屉 -->
    <a-drawer
      width="520"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <a-tabs :activeKey="defaultActiveTabs" @change="callback">
        <!-- 添加渠道客户 -->
        <a-tab-pane tab="添加渠道客户" key="1">
          <a-auto-complete
            class="certain-category-search"
            :dataSource="dataSource"
            dropdownClassName="certain-category-search-dropdown"
            :dropdownMatchSelectWidth="false"
            :dropdownStyle="{width: '300px'}"
            @search="queryChannelCustomerList"
            size="large"
            style="width: 100%"
            placeholder="请搜索渠道客户"
            @select="handleCUstomerSelect"
          >
            <a-input>
              <a-icon slot="suffix" type="search" class="certain-category-icon" />
            </a-input>
          </a-auto-complete>
        </a-tab-pane>
        <!-- 选择渠道客户 -->
        <a-tab-pane tab="选择渠道客户" key="2">
          <a-list
            class="demo-loadmore-list"
            itemLayout="horizontal"
            :dataSource="data"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a slot="actions"><a-icon type="shopping-cart" @click="showChildrenDrawer(item.customerCode)" />{{ item.skuCount }}</a>
              <a-list-item-meta
              >
                <a slot="title" @click="upCustomer(item)">{{ item.customerCode }}-{{ item.customerName }}</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>

        </a-tab-pane>
      </a-tabs>
      <!-- 二级购物车抽屉 -->
      <a-drawer
        title=""
        width="420"
        :closable="false"
        @close="onChildrenDrawerClose"
        :visible="childrenDrawer"
        wrapClassName="goods-list"
      >
        <h6 v-if="customerGoods.length<=0">暂无确认开票</h6>
        <div v-else>
          <div :key="index" v-for="(item,index) in customerGoods" class="customer-goods">
            <a-checkbox
              class=""
              @change="onCheckAllChange(item, $event)"
              :indeterminate="item.indeterminate"
              :checked="item.checkAll">
              <h4 style="display:inline">{{ item.code }}</h4>
            </a-checkbox>
            <a-checkbox-group @change="onChange(item)" class="checkbox-cart" v-model="checkedObj[item.code]" >
              <a-checkbox :value="rep" class="cart-item" :key="rep.skuCode" v-for="rep in item.wholesaleBillDetailList">
                <img v-if="rep.goodPic[0]" :src="rep.goodPic[0]" alt="" @error.once="moveErrorImg($event)">
                <img v-else src="@assets/goods.png" alt="">
                <div class="carts">
                  <h6>{{ rep.goodName }} {{ rep.skuCode }}</h6>
                  <p class="msg">{{ rep.skuModel }}</p>
                  <p class="price">分销价：<span>{{ rep.billPrice.toFixed(2)||rep.price.toFixed(2)||0.00 }}</span> </p>
                </div>
                <div class="number">
                  x {{ rep.billQuantity }}
                </div>
              </a-checkbox>
            </a-checkbox-group>
          </div>
          <div class="collection">
            合计：¥{{ totalPrice.toFixed(2) }} （{{ totalNUm }}个）
          </div>
          <a-button type="primary" size="large" style="float:right;margin-top:14px;" @click="updateCommitOrde">确认开票</a-button>
        </div>

      </a-drawer>
    </a-drawer>
    <!-- 当前客户购物车抽屉 -->
    <a-drawer
      title=""
      placement="right"
      width="420"
      @close="onCloseCustomer"
      :visible="customerVisible"
      wrapClassName="goods-list"
    >
      <h6 v-if="customerGoods.length<=0">暂无确认开票</h6>

      <div v-else>
        <div :key="index" v-for="(item,index) in customerGoods" class="customer-goods">
          <a-checkbox
            class=""
            @change="onCheckAllChange(item, $event)"
            :indeterminate="item.indeterminate"
            :checked="item.checkAll">
            <h4 style="display:inline">{{ item.code }}</h4>
          </a-checkbox>
          <a-checkbox-group @change="onChange(item)" class="checkbox-cart" v-model="checkedObj[item.code]" >
            <a-checkbox :value="rep" class="cart-item" :key="rep.skuCode" v-for="rep in item.wholesaleBillDetailList">
              <img v-if="rep.goodPic[0]" :src="rep.goodPic[0]" @error.once="moveErrorImg($event)" alt="">
              <img v-else src="@assets/goods.png" alt="">
              <div class="carts">
                <h6>{{ rep.goodName }} {{ rep.skuCode }}</h6>
                <p class="msg">{{ rep.skuModel }}</p>
                <p class="price">分销价：<span>{{ rep.billPrice.toFixed(2)||rep.price.toFixed(2)||0.00 }}</span> </p>
              </div>
              <div class="number">
                x {{ rep.billQuantity }}
              </div>
            </a-checkbox>
          </a-checkbox-group>
        </div>

        <div class="collection">
          合计：¥{{ totalPrice.toFixed(2) }} （{{ totalNUm }}个）
        </div>
        <a-button type="primary" size="large" style="float:right;margin-top:14px;" @click="updateCommitOrde">确认开票</a-button>
      </div>

    </a-drawer>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import userPhoto from '@assets/goods.png'
export default {
  name: 'DistributionInvoice',
  props: {
    customer: {
      type: String,
      default: ''
    },
    customerCode: {
      type: String,
      default: ''
    },
    goodsId: {
      type: Object,
      default: function () {
        return {}
      }
    },
    salesApproach: {
      type: String,
      default: ''
    },
    warehouse: {
      type: Object,
      default: function () {
        return {}
      }
    },
    packupCode: {
      type: String,
      default: ''
    },
    selectBillCount: {
      type: Number,
      default: 0
    },
    billSelectSkuCount: {
      type: Number,
      default: 0
    },
    isAdd: {
      type: Boolean,
      default: true
    }

  },
  data: function () {
    return {
      searchParam: '',
      // 一级抽屉
      visible: false,
      // 二级抽屉
      childrenDrawer: false,
      // 分页器
      page: {
        defaultCurrent: 1,
        pageSize: 15,
        total: 0
      },
      // // 销售途径
      // SalesApproach: '经销',
      // 提货类型默认值
      // defaultPickupValue: '1',
      // 提货类型
      pickupType: [
        {
          value: '2',
          key: '集中配送'
        },
        {
          value: '1',
          key: '客户自提'
        }
      ],
      WarehouseList: [],
      // 商品列表
      goods: [],
      // 是否全新啊
      checkAll: [],
      indeterminate: [],
      checkedObj: {},
      // 抽屉tabs默认
      defaultActiveTabs: '1',
      // 选择渠道客户list
      data: [],
      // 二级抽屉 商品列表
      customerGoods: [],
      // 当前客户购物车抽屉
      customerVisible: false,
      dataSource: [],
      // 总价格
      totalPrice: 0.00,
      // 总个数
      totalNUm: 0
    }
  },
  computed: {
    ...mapGetters(['storeInfo', 'userInfo'])
  },
  mounted () {
    console.log(this.warehouse)
    // this.$emit('updates', 'aget')
  },
  async created () {
    // new promises((resolve,reject)).
    if (Object.keys(this.$props.warehouse).length <= 0) {
      await this.queryStoreWarehouseList()
    } else {
      await this.queryStoreWarehouseList()

      await this.getDoodsLsit(this.warehouse.code)
    }
  },
  methods: {
    moveErrorImg: function (event) {
      event.currentTarget.src = userPhoto
    },

    /**
         * @name: 搜索框监听
         * @msg:
         * @param {type}
         * @return:
         */
    onSearch (value) {
      console.log(value)
      this.getDoodsLsit()
    },

    /**
         * @name:选中提货类型
         * @msg: 提货类型code
         * @param {String}
         * @return:
         */
    packupChange (data) {
      console.log(data)

      this.$emit('updates', 'packupCode', data)

      // this.upNotification()
    },
    /**
         * @name:提货位置选中
         * @msg: 提货位置选中code
         * @param {String}
         * @return:
         */
    async handleChange (data) {
      const warehouse = {
        code: data
      }
      this.WarehouseList.forEach(el => {
        if (data === el.code) {
          warehouse.name = el.name
        }
      })
      await this.$emit('updates', 'warehouse', warehouse)
      await this.getDoodsLsit()
      // await this.upNotification()

      this.$emit('updates', 'agetCounts')
    },
    /**
         * @name:打开一级抽屉
         * @msg: 打开一级抽屉
         * @param {}
         * @return:
         */
    showDrawer (type) {
      this.visible = true
      this.defaultActiveTabs = type
      if (type === '2') {
        this.QueryNotSubmitCustomerList()
      }
    },
    /**
         * @name:关闭一级抽屉
         * @msg: 关闭一级抽屉
         * @param {}
         * @return:
         */
    onClose () {
      this.visible = false
    },
    /**
         * @name:打开二级抽屉
         * @msg: 打开二级抽屉
         * @param {}
         * @return:
         */
    showChildrenDrawer (code) {
      this.childrenDrawer = true
      this.queryOrderCollectionByparam(code)
      this.totalPrice = 0
      this.totalNUm = 0
    },
    /**
         * @name:关闭二级抽屉
         * @msg:
         * @param {}
         * @return:
         */
    onChildrenDrawerClose () {
      this.childrenDrawer = false
      this.totalPrice = 0
      this.totalNUm = 0
    },
    /**
         * @name:二级抽屉复选框 选中
         * @msg:
         * @param {}
         * @return:
         */
    onChange (item) {
      console.log(item)
      console.log(this.checkedObj)
      // this.checkedObj = JSON.parse(JSON.stringify(this.checkedObj))
      this.checkedObj = Object.assign({}, this.checkedObj)
      const checkedList = this.checkedObj[item.code]
      item.indeterminate = !!checkedList.length && (checkedList.length < item.wholesaleBillDetailList.length)
      item.checkAll = checkedList.length === item.wholesaleBillDetailList.length
      // console.log(checkedList)
      this.calculate()
    },

    /**
         * @name: tabs
         * @msg:
         * @param {}
         * @return:
         */
    callback (key) {
      this.defaultActiveTabs = key
      console.log(key)
      if (key === '2') {
        this.QueryNotSubmitCustomerList()
      }
    },
    /**
         * @name: 当前客户抽屉
         * @msg:
         * @param {}
         * @return:
         */
    onCloseCustomer () {
      this.customerVisible = false
    },
    /**
         * @name: 待确认
         * @msg:
         * @param {}
         * @return:
         */
    onOPenCustomer () {
      if (this.customerCode) {
        this.totalPrice = 0.00
        this.totalNUm = 0
        this.customerVisible = true
        this.queryOrderCollectionByparam()
      } else {
        let secondsToGo = 3
        const modal = this.$success({
          title: '提示',
          content: '请选择渠道客户！'
        })
        const interval = setInterval(() => {
          secondsToGo -= 1
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          modal.destroy()
        }, secondsToGo * 1000)
      }
    },
    /**
         * @name: 分页发生变化
         * @msg:
         * @param {}
         * @return:
         */
    async pageChange (data) {
      console.log(data)
      new Promise((resolve, reject) => {
        this.page.defaultCurrent = data
        resolve('')
      }).then(res => {
        this.getDoodsLsit()
      })
    },
    /**
         * @name: 分页查询店铺仓库内商品
         * @msg:
         * @param {}
         * @return:
         */
    async getDoodsLsit (code) {
      console.log(code)
      const data = {
        page: this.page.defaultCurrent,
        rows: this.page.pageSize,
        repositoryCode: this.storeInfo.code,
        searchParam: this.searchParam
      }
      // POST DistPurchaseFindOrderPageList
      await axios({
        path: 'DistPurchaseFindOrderPageList',
        method: 'post',
        body: data
      }).then(res => {
        if (res.flag === 1) {
          console.log(res)
          if (res.data) {
            if (res.data.list && Array.isArray(res.data.list)) {
              this.goods = res.data.list
              this.goods.forEach(el => {
                const pic = el.mainGoodsPic ? el.mainGoodsPic.split(',') : ['']
                // console.log(pic)
                el.mainGoodsPic = pic
              })
              this.page.total = res.data.total
              this.page.defaultCurrent = res.data.pageNum
            }
          } else {
            this.goods = []
            this.page.total = 0
            this.page.defaultCurrent = 1
          }

          // this.addEditModal = false
          // this.getUsers()
        }
        // this.loading = false
      })
    },
    /**
         * @name: 获取当前店铺提货位置
         * @msg:
         * @param {type}
         * @return:
         */
    async queryStoreWarehouseList () {
      const data = {
        code: this.storeInfo.code
      }
      axios({
        path: 'DistOriginDataQueryStoreWarehouseList',
        method: 'post',
        body: data
      }).then(async res => {
        if (res.flag === 1 && res.data && res.data.length > 0) {
          this.WarehouseList = res.data

          if (Object.keys(this.$props.warehouse).length <= 0) {
            new Promise((resolve, reject) => {
              this.$emit('updates', 'warehouse', res.data[0])
              resolve('')
            }).then(res => {
              // this.getDoodsLsit()
              this.getDoodsLsit(this.WarehouseList[0].code)
            })
            if (this.customerCode) {
              this.$emit('updates', 'agetCounts')

              // this.selectOrderCount()
              // this.selectSkuCount()
            }
          }
        } else {
          this.WarehouseList = []
        }
      })
    },
    /**
         * @name: 获取渠道客户
         * @msg:
         * @param {type}
         * @return:
         */
    queryChannelCustomerList (data) {
      if (data) {
        const code = {
          code: data
        }
        axios({
          path: 'DistOriginDataQueryChannelCustomerList',
          method: 'post',
          body: code
        }).then(res => {
          console.log(res)
          if (res.flag === 1) {
            if (res && Array.isArray(res.data)) {
              const dataSource = []
              res.data.forEach(element => {
                dataSource.push(element.code + ' - ' + element.name)
              })
              this.dataSource = dataSource
              console.log(dataSource)
            }
          }
        })
      }
    },
    /**
         * @name: 返回当前客户
         * @msg:
         * @param {type}
         * @return:
         */
    async handleCUstomerSelect (data) {
      // console.log(data)
      const customer = {
      }
      // console.log(data.split(' - '))

      customer.code = data.split(' - ')[0]
      customer.name = data.split(' - ')[1]
      console.log(customer)
      await this.$emit('updates', 'customer', customer.name)
      await this.$emit('updates', 'customerCode', customer.code)
      await this.$emit('updates', 'agetCounts')

      this.visible = false
    },
    /**
         * @name: 修改渠道客户
         * @msg:
         * @param {Object}
         * @return:
         */
    async upCustomer (data) {
      console.log(data)
      // POST DistPurchaseQuerySpecialPriceListByCustomerCode
      axios({
        path: 'DistPurchaseQuerySpecialPriceListByCustomerCode',
        method: 'post',
        body: {
          takeStoreCode: this.warehouse.code,
          searchParam: data.customerCode
        }
      }).then(res => {
        console.log(res)
        if (res.flag === 1) {
          // console.log();
          if (res.data) {
            this.$confirm({
              title: '提示信息',
              content: '是否查看该客户的审批单商品',
              okText: '是',
              cancelText: '否',
              onOk: () => {
                return new Promise((resolve, reject) => {
                  this.isChange(3)
                  // console.log(this)
                  resolve()
                }).catch((err) => console.log(err))
              },
              onCancel: () => {
                return new Promise((resolve, reject) => {
                  this.visible = false
                  resolve()
                }).catch(err => console.log(err))
              }

            })
            // modal.onOk = function () {
            //     debugger
            //     return new Promise((resolve, reject) => {
            //         // this.isChange(3)
            //         resolve(console.log(this))
            //     }).catch((err) => console.log(err))
            // }
          }
        }
      })

      const customer = {
        name: data.customerName,
        code: data.customerCode
      }
      await this.$emit('updates', 'customer', customer.name)
      await this.$emit('updates', 'customerCode', customer.code)
      await this.$emit('updates', 'agetCounts')

      this.visible = false
    },
    /**
         * @name: 修改分销类型，提货类型，提货地址提示框
         * @msg:
         * @param {type}
         * @return:
         */
    upNotification () {
      if (this.billSelectSkuCount > 0) {
        let secondsToGo = 3
        const modal = this.$success({
          title: '提示',
          content: '当前仓库下有未提交订单，可在未提交订单列表删除！'
        })
        const interval = setInterval(() => {
          secondsToGo -= 1
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          modal.destroy()
        }, secondsToGo * 1000)
      }
    },
    /**
         * @name: 修改代销和分销
         * @msg:
         * @param {type}
         * @return:
         */
    async SalesChange (data) {
      await this.$emit('updates', 'salesApproach', data.target.value)

      // this.upNotification()
    },
    /**
         * @name: 组件切换
         * @msg:
         * @param {Number} 0:主页；1:详情；2：订单
         * @return:
         */
    isChange (com) {
      this.$emit('activeComponent', com)

      // if (this.customerCode) {
      // } else {
      //     let secondsToGo = 3
      //     const modal = this.$success({
      //         title: '提示',
      //         content: '请选择渠道客户！'
      //     })
      //     const interval = setInterval(() => {
      //         secondsToGo -= 1
      //     }, 1000)
      //     setTimeout(() => {
      //         clearInterval(interval)
      //         modal.destroy()
      //     }, secondsToGo * 1000)
      // }
    },
    /**
         * @name: vuex 中保存 商品详情
         * @msg:
         * @param {type}
         * @return:
         */
    async goodsDetails (item) {
      if (this.customerCode) {
        await this.$emit('updates', 'goodsId', item)
        await this.$emit('updates', 'isAdd', true)
        this.isChange(1)
      } else {
        let secondsToGo = 3
        const modal = this.$success({
          title: '提示',
          content: '请选择渠道客户！'
        })
        const interval = setInterval(() => {
          secondsToGo -= 1
        }, 1000)
        setTimeout(() => {
          clearInterval(interval)
          modal.destroy()
        }, secondsToGo * 1000)
      }
    },
    /**
         * @name: 查询购物车
         * @msg:
         * @param {type}
         * @return:
         */
    queryOrderCollectionByparam (id) {
      const code = { status: 1, saleStoreCode: this.storeInfo.code, customerCode: id || this.customerCode, createBy: this.userInfo.code }
      axios({
        path: 'DistWholesaleBillQueryBillCollectionByparam',
        method: 'post',
        body: code
      }).then(res => {
        if (res.flag === 1) {
          console.log(res)
          if (res.data && Array.isArray(res.data)) {
            const data = res.data

            data.forEach(el => {
              this.checkedObj[el.code] = []
              const wholesaleBillDetailList = []

              // this.checkAll[el.code] = false
              // this.indeterminate[el.code] = false
              el.checkAll = false
              el.indeterminate = false
              el.wholesaleGoodList.forEach(item => {
                if (item.wholesaleBillDetailList) {
                  item.wholesaleBillDetailList.forEach(sku => {
                    console.log(sku.goodPic)

                    sku.goodPic = sku.goodPic ? sku.goodPic.split(',') : ['']
                    console.log(sku.goodPic)
                  })
                }
                wholesaleBillDetailList.push(...item.wholesaleBillDetailList)
              })
              el.wholesaleBillDetailList = wholesaleBillDetailList
            })
            this.customerGoods = data
            console.log(this.customerGoods)
          } else {
            this.customerGoods = []
          }
        }

        // this.skuCount = res.data.orderCount
      })
    },
    /**
         * @name: 查询渠道客户
         * @msg:
         * @param {type}
         * @return:
         */
    QueryNotSubmitCustomerList () {
      const code = { status: 1, takeStoreCode: this.warehouse.code, customerCode: this.customerCode, createBy: this.userInfo.code }
      axios({
        path: 'DistWholesaleBillQueryNotSubmitCustomerList',
        method: 'post',
        body: code
      }).then(res => {
        if (res.flag === 1) {
          console.log(res)
          if (res.data) {
            this.data = res.data
          }
        }
        // this.skuCount = res.data.orderCount
      })
    },
    /**
         * @name: 购物车多选
         * @msg:
         * @param {type}
         * @return:
         */
    onCheckAllChange (item, e) {
      // console.log(e.target.checked)
      const codelist = []
      if (item && Array.isArray(item.wholesaleBillDetailList)) {
        item.wholesaleBillDetailList.forEach(el => {
          codelist.push(el)
        })
      }
      this.checkedObj[item.code] = e.target.checked ? codelist : []
      item.indeterminate = false
      item.checkAll = e.target.checked
      this.calculate()
    },
    /**
         * @name: 计算价格
         * @msg:
         * @param {type}
         * @return:
         */
    calculate () {
      const codeLsit = []
      Object.values(this.checkedObj).forEach(element => {
        codeLsit.push(...element)
      })
      this.totalPrice = 0
      this.totalNUm = 0
      codeLsit.forEach(el => {
        const billPrice = el.billPrice || el.price || 0
        this.totalPrice += el.billQuantity * billPrice
        this.totalNUm += el.billQuantity
      })
      console.log(this.totalPrice)
    },
    /**
         * @name: 提价订单
         * @msg:
         * @param {type}
         * @return:
         */
    updateCommitOrde () {
      if (this.totalNUm > 0) {
        const list = []
        const keys = Object.keys(this.checkedObj)
        const data = JSON.parse(JSON.stringify(this.customerGoods))
        data.forEach(el => {
          console.log(el)
          if (keys.includes(el.code) && this.checkedObj[el.code].length > 0) {
            el.saleStoreCode = el.saleStoreCode || this.storeInfo.code//*  店code
            el.makeStoreCode = el.makeStoreCode || this.storeInfo.code // *    店code
            el.saleAmount = this.totalPrice// *价格总数
            el.auditBy = this.userInfo.code
            el.wholesaleBillDetailList = this.checkedObj[el.code]
            delete el.wholesaleGoodList
            list.push(el)
          }
        })
        list.forEach(el => {
          // console.log(el)
          el.wholesaleBillDetailList.forEach(i => {
            // console.log(i)
            if (i.goodPic) {
              delete i.goodPic
            }
          })
        })
        console.log(list)
        axios({
          path: 'DistWholesaleBillUpdateCommitBill',
          method: 'post',
          body: {
            wholesaleBillVoList: list
          }
        }).then(res => {
          if (res.flag === 1) {
            this.queryOrderCollectionByparam()
            this.visible = false
            this.childrenDrawer = false
            this.totalPrice = 0.00
            this.totalNUm = 0

            this.$emit('updates', 'agetCounts')
          } else {
            this.queryOrderCollectionByparam()
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.distributionInvoice{
    background-color: #ffffff;
    padding-top: 20px;
    height: 100%;
    .ant-pagination{
        margin: 15px auto;
        text-align: center;
    }
    .search{
        >div{
            margin-bottom: 16px;
        }
    }
    .screening{
        background-color: rgb(240, 242, 245);
        padding: 8px 0px 3px 15px;
    }
    .operation{
        >div{
            display: inline-block;
        }
        .customer-name{
            display: inline-block;
            // width: 144px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: center;
        }

    }

    .dist-goods{
        display: flex;
        flex-wrap:  wrap ;
        // justify-content:space-around;
        justify-content:flex-start;

        margin: 0;
        margin-top:20px;
        padding: 0;
        >li{
            list-style:none;
            flex-basis: 225px;
            padding: 10px 20px;
            width: 225px;
            box-sizing: content-box;
            cursor: pointer;
            >img{
                width:100%;
                height: 140px;
                display: block
            }
            >h6{
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                margin:15px 0;
                height: 18px;
            }
            >p{
                color: red;
                >span{
                    font-size: 16px;
                }
            }
        }
        >li:hover{
            box-shadow: #ccc 1px 1px 3px;
        }
    }

}

.checkbox-cart{
    width: 100%;
    .cart-item{
        display: block;
        width: 100%;
        border-top:1px solid #ccc;
        padding-top: 14px;
        >span{
            display: inline-block;
        }
        /deep/ .ant-checkbox{
            position: relative;
            top: -41px;
        }
        /deep/ .ant-checkbox + span{
            display: inline-block;
            width: calc( 100% - 16px)
        }
        img{
            float: left;
            width:100px;
            height: 60px;
            margin-right: 10px;
        }
        h6{
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin: 0;
        }
        .msg{
            color: #666666;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin: 0;
        }
        .price{
            color: #666666;
            width: 100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin: 0;
            >span{
                color: #1890ff;
            }
        }

        .carts{
            float: left;
            width: calc( 100% - 160px);
        }
        .number{
            width: 50px;
            float: left;
            text-align: center;
            line-height: 76px;
        }
    }
    .cart-item:first-child{
        border: none;
    }

}
.ant-drawer-body{
    background: red;
    padding: 0;
}
.collection{
    color: #1890ff;
    text-align: right;
    padding:14px 0;
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
}
 .doods-lsit /deep/ .ant-drawer-body{
        padding: 0;
    }
/deep/ .ant-drawer {
     background: #1890ff
 }

.customer-goods{
    border-bottom: 1px solid #1890ff;
    margin-top: 15px;
}
.customer-goods:first-child{
    margin-top: 0;
}
.ant-checkbox-wrapper + .ant-checkbox-wrapper{
    margin: 0;
}
</style>
