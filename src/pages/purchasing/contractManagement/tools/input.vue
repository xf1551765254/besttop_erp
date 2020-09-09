<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-20 13:13:17
 * @LastEditTime: 2019-05-08 16:25:02
 -->
<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper" >
      <a-input :value="value" @change="handleChange" @pressEnter="check" style="width:95%;margin-right:5px"/>
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper" >
      {{ value || ' ' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
export default {
    name: 'EditTableInput',
    props: {
        text: String
    },
    data () {
        return {
            value: this.text,
            editable: false
        }
    },
    methods: {
        handleChange (e) {
            const value = e.target.value
            this.value = value
        },
        check () {
            if (this.value.length > 200) {
                return this.$message.warning('输入内容不能超过200字')
            }
            this.editable = false
            this.$emit('change', this.value)
        },
        edit () {
            this.editable = true
        }
    }
}
</script>
