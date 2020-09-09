
<script>
// import { axios } from '@/utils/request'
import ITItle from '../component/Title'
const DataSet = require('@antv/data-set')

const sourceData = [
    { type: '出库', '数量': 131744 },
    { type: '入库', '数量': 104970 },
    { type: '库存', '数量': 29034 }
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
    type: 'sort',
    callback (a, b) {
        return a['数量'] - b['数量'] > 0
    }
})
const data = dv.rows

const label = { offset: 12 }
export default {
    data () {
        return {
            dateType: 1
        }
    },
    methods: {
        renderBar (text) {
            return (
                <a-col span={8}>
                    <v-chart forceFit={true} height={220} data={data} padding='auto'>
                        <v-coord type="rect" direction="LB" />
                        <v-tooltip />
                        <v-axis dataKey="type" label={label} />
                        <v-axis dataKey="数量" label={null} title={{ text, textStyle: { fill: '#000' } }} />
                        <v-bar position="type*数量" />
                    </v-chart>
                </a-col>
            )
        }
    },
    render () {
        return (
            <a-row style="margin-bottom: 12px;">
                <a-col span={4} class="interior reset left">
                    <ITItle text="仓库数据统计" color="#fff" style="padding:30px 24px 21px" />
                    <a-input-group compact class="date">
                        <a-select value={this.dateType} >
                            <a-select-option value={1}>日</a-select-option>
                            <a-select-option value={2}>月</a-select-option>
                        </a-select>
                        {
                            this.dateType === 1
                                ? <a-date-picker />
                                : <a-month-picker v-else placeholder="请选择月份" />
                        }

                    </a-input-group>
                </a-col>
                <a-col span={20} class="right">
                    <div style='margin-bottom:40px'> 单位(元) </div>
                    <a-row type="flex" gutter={16} justify="center">
                        {this.renderBar('仓库1')}
                        {this.renderBar('仓库2')}
                        {this.renderBar('仓库3')}
                    </a-row>
                </a-col>
            </a-row>
        )
    },
    created () {

    }
}
</script>

<style lang="less" scoped>
@import url("./mixin");
.right {
  height: 330px;
  padding:20px 48px;
  background: rgba(255, 255, 255, 1);
  position: relative;
  top: 10px;
}

.date{
    white-space: nowrap;
    padding:0 20px;
}
.left {
  height: 350px;
}
/deep/.ant-select-arrow-icon {
    color: #fff
}
</style>
