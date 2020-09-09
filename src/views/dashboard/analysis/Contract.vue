<template>
  <a-col
    :sm="24"
    :md="24"
    :xl="17"
    style="margin-bottom: 12px;padding-left:0;height:394px "
  >
    <Card title="合同统计" style="height:394px">
      <a-row :gutter="24">
        <a-col :span="16">
          <div style="margin-bottom:40px">
            <div class="numbox">自营合同({{ propCount }})</div>
            <div class="numbox" style="margin-left:380px">
              联营({{ poolCount }})
            </div>
          </div>
          <v-chart
            :forceFit="true"
            :height="height"
            :data="data"
            padding="auto" >
            <v-tooltip />
            <v-axis dataKey="title" :label="label" />
            <v-interval
              position="title*value"
              :color="['type', color]"
              :opcaity="0.1"
            />
          </v-chart>
        </a-col>
        <a-col :span="1">
          <a-divider type="vertical" />
        </a-col>
        <a-col :span="7">
          <a-date-picker @change="dateChange" style="margin-bottom:12px" />
          <div><a-radio-group :options="['日', '月']" defaultValue="日" /></div>
          <div class="num-count-box">
            <span class="num-count-label">合同总量</span>
            <span class="num-count">
              {{ propCount+poolCount }}
              <span class="unit">单</span>
            </span>
          </div>
          <div class="contract-self">自营合同</div>
          <div class="contract-together">联营合同</div>
        </a-col>
      </a-row>
    </Card>
  </a-col>
</template>

<script>
import Card from '../component/Card'
import { axios } from '@/utils/request'

const label = {
    textStyle: {
        fill: '#aaaaaa'
    }
}

const title = {
    offset: 70
}

const lineStyle = {
    stroke: 'red',
    lineDash: [0, 0]
}

const style = {
    fill: '#c0c0c0',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center'
}
export default {
    components: {
        Card
    },
    created () {
        this.getData({ dateType: 1, dateTime: '2019-08-16' })
    },
    methods: {
        transfrom (obj, type) {
            const push = (obj, key, title) => {
                title = type === '自营合同' ? title + '(自营)' : title + '(联营)'
                this.data.push({ title, type, value: obj[key] })
            }
            Object.keys(obj).map(k => {
                switch (k) {
                case 'audit': push(obj, k, '已审核'); break
                case 'willExpire': push(obj, k, '将过期'); break
                case 'unaffirm': push(obj, k, '未确认'); break
                case 'unaudit': push(obj, k, '未审核'); break
                case 'uneffect': push(obj, k, '未生效'); break
                case 'effect': push(obj, k, '已生效'); break
                case 'finish': push(obj, k, '已终止'); break
                }
            })
        },
        getData (body) {
            axios({ path: 'contractStatistics', body })
                .then(({ data, pool, prop }) => {
                    const { propDetail, poolDetail } = data
                    this.transfrom(propDetail, '自营合同')
                    this.transfrom(poolDetail, '联营合同')
                    this.poolCount = data.pool
                    this.propCount = data.prop
                })
        },
        dateChange (e) {

        }
    },
    data () {
        return {
            data: [],
            poolCount: 0,
            propCount: 0,
            height: 260,
            style,
            label,
            title,
            lineStyle,
            /* 图形相关 https://www.yuque.com/antv/g2-docs/api-graphic */
            color: ['l(270) 0:#A5DDFF 1:#4BA1FF', 'l(270) 0:#FAD2A2 1:#FA906E']
        }
    }
}
</script>
<style lang="less" scoped>
.numbox {
  width: 101px;
  height: 20px;
  font-size: 14px;
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
  line-height: 20px;
}
.num-count-box {
  margin: 57px 0;
  height: 40px;
  display: flex;
  align-items: baseline;
}
.num-count {
  display: inline-block;
  font-size: 40px;
  height: 40px;
  line-height: 40px;
  font-family: HiraMaruPro-W4;
  font-weight: normal;
  color: rgba(24, 144, 255, 1);
  .unit {
    font-size: 12px;
  }
}
.num-count-label {
  position: relative;
  top: -2px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  margin-right: 24px;
  color: rgba(48, 49, 51, 1);
}
.contract-self {
  height: 20px;
  margin-bottom: 30px;
  &::after {
    position: relative;
    top: 2px;
    margin-left: 20px;
    content: "";
    display: inline-block;
    width: 140px;
    height: 15px;
    background: linear-gradient(to right, #a5ddff, #4ba1ff);
  }
}
.contract-together {
  &::after {
    position: relative;
    top: 2px;
    margin-left: 20px;
    content: "";
    display: inline-block;
    width: 140px;
    height: 15px;
    background: linear-gradient(to right, #ffc988, #f6635a);
  }
}
/deep/ .ant-divider-vertical {
  height: 270px;
  top: 8px;
}
</style>
