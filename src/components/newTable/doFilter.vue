<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-28 14:12:32
 * @LastEditTime: 2019-04-28 18:45:56
 -->
<template>
  <a-modal
    title="筛选"
    v-model="modelvisbel"
    :closable="false"
    :keyboard="false"
    :mask="false"
    :width="450"
    @cancel="cancel"
    centered>
    <template slot="footer">
      <a-button key="back" @click="subCancel">关闭</a-button>
      <a-button key="del" @click="subDel">清空</a-button>
      <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
    </template>
    <div class="box">
      <a-row v-for="(item, index) in condition" :key="index" style="margin-bottom:5px;">
        <a-col :span="8"><a-select v-model="item['key']" style="width: 100%" :options="keylist" showSearch allowClear/></a-col>
        <a-col :span="5"><a-select v-model="item['condition']" style="width: 100%" :options="conditionList"/></a-col>
        <a-col :span="8"><a-input type="text" v-model="item['value']" style="width: 100%"/></a-col>
        <a-col :span="3"><a-button icon="delete" block @click="delCondition(index)"/></a-col>
      </a-row>
    </div>
    <a-button icon="plus" block @click="plusCondition"/>
  </a-modal>
</template>
<style lang="less" scoped>
    .box{
        width:400px;
        height:300px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 10px;
    }
</style>

<script>
export default {
    name: 'DoFilter',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        cols: {
            type: Array,
            default: () => []
        }
    },
    data: function () {
        return {
            modelvisbel: false,
            conditionList: [
                { title: '小于', value: '<' },
                { title: '等于', value: '=' },
                { title: '大于', value: '>' },
                { title: '小于等于', value: '<=' },
                { title: '大于等于', value: '>=' }
            ],
            condition: [{
                key: '',
                condition: '',
                value: ''
            }],
            keylist: []
        }
    },
    methods: {
        delCondition (e) {
            const condition = [...this.condition]
            condition.splice(e, 1)
            this.condition = condition
        },
        plusCondition () {
            this.condition = [
                {
                    key: '',
                    condition: '',
                    value: ''
                },
                ...this.condition
            ]
        },
        subCancel () {
            this.$emit('input', false)
        },
        subDel () {
            this.condition = [{
                key: '',
                condition: '',
                value: ''
            }]
            this.$emit('onFilter', [])
            this.$emit('input', false)
        },
        cancel () {
            this.$emit('input', false)
        },
        handleSubmit () {
            const condition = this.condition.filter(o => o.key !== '' && o.condition !== '' && o.value !== '')
            this.$emit('onFilter', condition)
            this.$emit('input', false)
        }
    },
    watch: {
        value (val) {
            this.modelvisbel = val
        },
        'cols.length': {
            handler (val) {
                if (val > 0) {
                    this.$props.cols.map(o => {
                        this.keylist.push({
                            title: o.name,
                            value: o.key
                        })
                    })
                }
            },
            immediate: true
        }
    }
}
</script>
