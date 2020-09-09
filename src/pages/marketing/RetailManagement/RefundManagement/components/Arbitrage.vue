<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 16:21:06
 * @LastEditors: haile
 * @LastEditTime: 2019-08-14 17:24:49
 -->
<template>
  <div class="arbitrage-box">
    <div class="activity-header">
      <div></div>
      套购活动列表
    </div>
    <div class="activity-content">
      <div class="arbitrage-item">
        <div class="item-header">满二免一：小米四开门电冰箱</div>
        <div class="item-content">
          <div>
            <p>test0001-00000033</p>
            <p>test0001-00000033</p>
          </div>
          <div>
            当前免金额：2000
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Arbitrage'
}
</script>

<style lang="less" scoped>
.arbitrage-box {
    height: 30%;
    overflow-y: auto;
    background: #fff;
    border-radius: 6px;
    .activity-header {
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
    .activity-content {
        padding: 5px;
        .arbitrage-item {
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
              display: flex;
              justify-content: space-between;
              > div:last-of-type {
                  display: flex;
                  align-items: center;
              }
            }
        }
    }
}
</style>
