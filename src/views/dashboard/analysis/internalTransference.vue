<template>
  <a-row style="margin-bottom: 12px;">
    <a-col :span="4" class="interior reset left">
      <ITItle text="内部调拨系统" color="#fff" style="padding:30px 24px 21px" />
      <div style="padding:0 20px">
        <a-date-picker style="margin-bottom:12px;width:100%" />
        <a-radio-group
          style="display:block;"
          :options="['日', '月']"
          defaultValue="日"
        />
      </div>
    </a-col>
    <a-col :span="20">
      <a-row type="flex" justify="center" class="right">
        <a-col :span="4">
          <div class="num">13</div>
          <span class="text">单据(个)</span>
        </a-col>
        <a-col :span="4">
          <div class="num">20</div>
          <span class="text">品类(种)</span>
        </a-col>
        <a-col :span="4">
          <div class="num">130</div>
          <span class="text">品牌(个)</span>
        </a-col>
        <a-col :span="4">
          <div class="num">56</div>
          <span class="text">商品种类(种)</span>
        </a-col>
        <a-col :span="4">
          <div class="num">45009</div>
          <span class="text">商品数量(个)</span>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<script>
import { axios } from '@/utils/request'
import ITItle from '../component/Title'
export default {
    components: {
        ITItle
    },
    data () {
        return {

        }
    },
    created () {
        axios({
            path: 'internalTransference',
            body: {
                'dateType': 2,
                'dateTime': '2019-07-09 11:25:37',
                'storeCodes': [
                    '0001', '0003', '00021'
                ]
            }
        })
    }
}
</script>

<style lang="less" scoped>
@import url("./mixin");
.right {
  height: 190px;
  background: rgba(255, 255, 255, 1);
  position: relative;
  top: 10px;
  text-align: center;
}
.num {
  font-size: 60px;
  font-family: HiraMaruPro;
  font-weight: normal;
  color: rgba(96, 98, 102, 1);
  line-height: 60px;
  margin: 40px 0 33px;
}
.text {
  font-size: 12px;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(144, 147, 153, 1);
}
.left {
  height: 210px;
}
</style>
