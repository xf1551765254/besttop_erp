<template>
  <a-row style="margin:0 0 12px;height:485px;padding:0">
    <Card title="物流配送数据统计">
      <a-col :span="14">
        <v-chart :forceFit="true" :height="200" :data="data" padding="auto">
          <v-tooltip :htmlContent="htmlContent" />
          <v-axis
            :show="false"
            dataKey="city"
            :tickLine="tickLine"
            :line="line"
          />
          <v-axis :show="false" dataKey="value" :title="title" :grid="grid" />
          <v-coord direction="LB" type="rect" />
          <v-stack-bar
            position="city*value"
            :opacity="1"
            :label="stackLabel"
            :color="color"
            :size="30"
          />
        </v-chart>
        <a-row
          type="flex"
          justify="space-between"
          :gutter="20"
          style="margin-top:30px"
        >
          <a-col :span="8">
            <div class="card-num">
              <div class="title">零售退货</div>
              <a-col :span="8">
                <div class="num-1">88<span class="span">待退货</span></div>
              </a-col>
              <a-col :span="8">
                <div class="num-2">
                  <div class="num-2-1">35</div>
                  <span class="span">待退货</span>
                </div>
              </a-col>
              <a-col :span="8">
                <a-progress
                  type="circle"
                  :percent="55"
                  :width="90"
                  :format="() => ''"
                />
              </a-col>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="card-num">
              <div class="title">零售换货</div>
              <a-col :span="8">
                <div class="num-1">70<span class="span">待换货</span></div>
              </a-col>
              <a-col :span="8">
                <div class="num-2">
                  <div class="num-2-1">15</div>
                  <span class="span">已换货</span>
                </div>
              </a-col>
              <a-col :span="8">
                <a-progress
                  type="circle"
                  :percent="55"
                  :width="90"
                  strokeColor="#1842FF"
                  :format="() => ''"
                />
              </a-col>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="card-num">
              <div class="title">分销退货</div>
              <a-col :span="8">
                <div class="num-1">60<span class="span">待退货</span></div>
              </a-col>
              <a-col :span="8">
                <div class="num-2">
                  <div class="num-2-1">5</div>
                  <span class="span">已退货</span>
                </div>
              </a-col>
              <a-col :span="8">
                <a-progress
                  type="circle"
                  :percent="55"
                  :width="90"
                  strokeColor="#08CEAF"
                  :format="() => ''"
                />
              </a-col>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="1" style=" text-align: center;">
        <a-divider type="vertical" style="height:345px;margin-top:30px" />
      </a-col>
      <a-col :span="9">
        <Cicle />
      </a-col>
    </Card>
  </a-row>
</template>
<script>
import Cicle from './cicle'
import Card from '../component/Card'

const data = [{
    city: '俄罗斯（莫斯科）',
    type: '1',
    info: '待确认',
    value: 50
}, {
    city: '俄罗斯（莫斯科）',
    info: '确认',
    type: '2',
    value: 21
}, {
    city: '俄罗斯（莫斯科）',
    info: '取消派工',
    type: '3',
    value: 33
}, {
    city: '法国（巴黎）',
    type: '1',
    info: '配送在途',
    value: 33
}, {
    city: '法国（巴黎）',
    info: '已签收',
    type: '2',
    value: 22
}, {
    city: '法国（巴黎）',
    info: '取消出库',
    type: '3',
    value: 11
}, {
    city: '韩国（首尔）',
    type: '1',
    info: '待出库',
    value: 41
}, {
    city: '韩国（首尔）',
    info: '确认',
    type: '2',
    value: 21
}, {
    city: '韩国（首尔）',
    info: '取消确认',
    type: '3',
    value: 11
}, {
    city: '丹麦（哥本哈根）',
    info: '待派工',
    type: '1',
    value: 33
}, {
    city: '丹麦（哥本哈根）',
    info: '派工',
    type: '2',
    value: 12
}, {
    city: '丹麦（哥本哈根）',
    info: '取消分拣',
    type: '3',
    value: 11
}, {
    city: '冰岛（雷克雅未克）',
    type: '1',
    info: '待分拣',
    value: 44
}, {
    city: '冰岛（雷克雅未克）',
    info: '分拣',
    type: '2',
    value: 33
}, {
    city: '冰岛（雷克雅未克）',
    info: '取消分拣',
    type: '3',
    value: 22
}]

const tickLine = {
    alignWithLabel: false,
    length: 0
}

const title = {
    offset: 30,
    textStyle: {
        fontSize: 14,
        fontWeight: 300
    }
}

const line = {
    lineWidth: 0
}

const grid = {
    lineStyle: {
        lineWidth: 0
    }
}

const stackLabel = ['value*type', (val, t) => {
    var color = t === '1' ? 'white' : '#47494b'
    return {
        formatter: (v, o) => `${o.point.info}:${v}`,
        position: 'middle',
        offset: 0,
        textStyle: {
            fontSize: 15,
            fill: color,
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
        }
    }
}]

const color = ['type*city', (type, city) => {
    var color = void 0
    if (type === '1') color = '#1890ff'
    if (type === '2') color = '#B9E3FF'
    if (type === '3') color = '#E6F7FF'
    return color
}]

export default {
    components: {
        Card,
        Cicle
    },
    data () {
        return {
            data,
            // scale,
            tickLine,
            title,
            color,
            stackLabel,
            grid,
            line,
            htmlContent: (v, item) => {
                let html = ''
                let count = 0
                const style = `'left:${item.x};top:${item.y};'`

                item.forEach(v => { count += Number(v.value) })
                item.push({ value: count, color: 'red', info: '合计' })
                item.forEach(v => {
                    html += (
                        `<div  style="margin-bottom: 10px;">
                           <span class='dot' style='background-color:${v.color}'></span> 
                           <span style='margin-right:20px'>${v.info || v.point._origin.info}</span> 
                           <span class='value'>${v.value} </span>
                        </div>`
                    )
                })
                return `<div class="g2-tooltip" style=${style}>
                            <ul class="g2-tooltip-list">
                               ${html}
                            </ul>
                        </div>`
            }
        }
    }
}
</script>

<style lang="less" >
.card-num {
  overflow: hidden;
  height: 140px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 14px 0px rgba(24, 144, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(230, 247, 255, 1);
  padding: 12px 20px;
  text-align: center;
  .span {
    display: block;
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    line-height: 17px;
  }
  .title {
    text-align: left;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);
    line-height: 20px;
  }
  .num-1 {
    height: 44px;
    font-size: 44px;
    font-family: HiraMaruPro-W4;
    font-weight: normal;
    color: rgba(48, 49, 51, 1);
    line-height: 66px;
  }
  .num-2 {
    margin-top: 15px;
    margin-bottom: 20px;
    font-size: 24px;
    font-family: HiraMaruPro-W4;
    font-weight: normal;
    color: rgba(144, 147, 153, 1);
    .num-2-1 {
      margin-bottom: 15px;
    }
  }
}
.g2-tooltip {
  position: absolute;
  visibility: hidden;
  z-index: 8;
  transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s,
    top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  border-radius: 3px;
  color: rgb(87, 87, 87);
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", SimSun, sans-serif;
  line-height: 20px;
  padding: 10px;
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    display: inline-block;
    margin-left: -20px;
    margin-right: 8px;
  }
  .value {
    float: right;
    margin-left: 30px;
  }
}
</style>
