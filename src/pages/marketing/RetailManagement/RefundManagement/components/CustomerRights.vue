<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 17:04:52
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 11:32:52
 -->
<template>
  <div class="rights-list">
    <div class="rights-header">
      <div></div>
      顾客权益列表
    </div>
    <div class="rights-content">
      <div class="rights-item" v-for="(order, i) in rightsList" :key="i" v-show="order.show">
        <div class="item-header">
          单号：{{ order.code }}
        </div>
        <div class="item-content">
          <div>
            <div class="activity-title">[捆绑]：</div>
            <div class="aitivity-content">
              <p v-for="(goods, bi) in order.bindingGoods" :key="bi">
                <span>00370037-美的电冰箱</span>
                <span>x1</span>
                <span style="background:#408BFF;color:#fff;height:18px;line-height:18px;padding: 0 6px;margin-left: 5px;" v-if="true">已退</span>
                <span style="background:#FF594C;color:#fff;height:18px;line-height:18px;padding: 0 6px;margin-left: 5px;" v-if="false">未退</span>
              </p>
            </div>
          </div>
          <div v-if="order.serviceCoupons && order.serviceCoupons.length > 0">
            <div class="activity-title">[服务]：</div>
            <div class="aitivity-content">
              <p v-for="(service, si) in order.serviceCoupons" :key="si">
                <span>{{ service.name }}</span>
                <span>x{{ service.quantity }}</span>
              </p>
            </div>
          </div>
          <div v-if="order.backDefine && JSON.stringify(order.backDefine) !== '{}'">
            <div class="activity-title">[满返]：</div>
            <div class="aitivity-content">
              <p>
                <span>满{{ order.backDefine.reachAmount }}返{{ order.backDefine.rateAmount }},实返{{ order.backDefine.actualAmount }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'CustomerRights',
    props: {
        rightsList: {
            type: Array,
            default: () => []
        }
    }
}
</script>

<style lang="less" scoped>
.rights-list {
    min-width: 250px;
    flex: 1;
    height: 100%;
    background: #fff;
    border-radius: 6px;
    .rights-header {
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-weight: 700;
        padding-left: 12px;
        > div {
            display: inline-block
        }
        > div:first-of-type {
            height: 14px;
            width: 4px;
            background: #408BFF;
            border-radius: 3px;
        }
    }
    .rights-content {
        padding: 5px;
        .rights-item {
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid #E6E6E6;
            .item-header {
                height: 40px;
                background: #F8F8F8;
                line-height: 40px;
                padding-left: 10px;
            }
            .item-content {
              padding: 0 10px;
              > div {
                  display: flex;
                  .activity-title {
                      display: inline-block;
                      height: 18px;
                      line-height: 18px;
                  }
                  .aitivity-content {
                      flex: 1;
                      padding-left: 5px;
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space: nowrap;
                      > p {
                        margin-bottom: 5px;
                        height: 18px;
                        line-height: 18px;
                        display: flex;
                        span {
                            display: inline-block;
                        }
                        span:first-of-type {
                            display: inline-block;
                            // width: 112px;
                            flex: 1;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                      }
                  }
              }
            }
        }
    }
}
</style>
