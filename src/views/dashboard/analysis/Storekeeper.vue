<script>
const DataSet = require('@antv/data-set')

const sourceData = [
    { 'user': '张三', '品牌': 25635, '品类': 1890, 'SKU种类': 9314, '商品种数': 2021 },
    { 'user': '李四', '品牌': 30352, '品类': 20439, 'SKU种类': 10225, '商品种数': 2021 },
    { 'user': '王二', '品牌': 38253, '品类': 42538, 'SKU种类': 15757, '商品种数': 2021 }
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
    type: 'fold',
    fields: ['品牌', '品类', 'SKU种类', '商品种数'],
    key: '类型',
    value: '数量',
    retains: ['user']
})

export default {
    data () {
        return {
            data: dv.rows
        }
    },
    methods: {
        renderChart (text) {
            return (
                <v-chart forceFit={true} height={120} data={this.data} padding={[10, 'auto']}>
                    <v-coord type="rect" direction="LB" />
                    <v-tooltip />
                    <v-axis
                        title={{ text, textStyle: { fill: '#000' }, offset: 80 }}
                        dataKey="user"
                        label={{ offset: 12 }} />
                    <v-axis dataKey="数量" label={null} />
                    <v-stack-bar position="user*数量" color="类型" />
                </v-chart>
            )
        }
    },
    render () {
        return (
            <div>
                {this.renderChart('物流出库')}
                {this.renderChart('物流入库')}
                {this.renderChart('采购出库')}
                {this.renderChart('采购入库')}
            </div>
        )
    }
}
</script>
