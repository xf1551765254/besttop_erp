<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2019-08-8 15:42:39
 * @LastEditTime: 2019-08-9 15:42:39
 -->
<template>
  <div v-if="isCompanyEnv">
    <a-button style="margin-bottom:8px;" type="primary" @click="open">
      新增菜单
    </a-button>
    <a-modal
      title="新增菜单"
      v-model="showModal"
      :confirmLoading="loading"
      :width="500"
      @ok="submit"
      :destroyOnClose="true"
      :maskClosable="false"
      center
    >
      <a-form :form="form">
        <a-form-item
          hasFeedback
          label="所属系统"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-select
            @change="getPrevModule"
            placeholder="请选择所属系统"
            :options="systemList"
            v-decorator="['sysType', {rules: [{ required: true, message: '请选择所属系统!' }]}]"
          />
        </a-form-item>
        <a-form-item
          label="上级模块"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-select
            v-decorator="['parentCode']"
            placeholder="请选择上级模块"
            :options="moduleList"
          />
        </a-form-item>
        <a-form-item
          hasFeedback
          label="模块地址"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input v-decorator="['menuUrl',{rules: [{ required: true, message: '请输入模块地址!' }]}]" placeholder="请输入模块地址" />
        </a-form-item>
        <a-form-item
          hasFeedback
          label="模块名称"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-input v-decorator="['menuName',{rules: [{ required: true, message: '请输入模块名称!' }]}]" placeholder="请输入模块名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import { isCompanyEnv } from '@/config/api.config'

export default {
    data () {
        return {
            isCompanyEnv,
            formLayout: 'horizontal',
            form: this.$form.createForm(this),
            showModal: false,
            loading: false,
            systemList: [],
            moduleList: []
        }
    },
    methods: {
        open () {
            this.showModal = true
            this.getSystem()
        },
        getPrevModule (sysType) {
            this.form.setFieldsValue({ parentCode: undefined })
            axios({
                path: 'ActionMenuFunctionFindMenuList',
                body: { type: 'menu', sysType }
            }).then(({ flag, data }) => {
                if (flag) {
                    this.moduleList = data.map(v => {
                        v.value = v.code
                        v.label = v.menuName
                        return v
                    })
                }
            })
        },
        getSystem () {
            axios({ path: 'ActionMenuFunctionFindSysList' }).then(res => {
                if (res.flag === 1) {
                    this.systemList = res.data.map(v => {
                        v.value = v.code
                        v.label = v.sysName
                        return v
                    })
                }
            })
        },
        submit () {
            this.form.validateFields((err, body) => {
                body = { type: 'menu', ...body }
                Object.keys(body).forEach(key => { !body[key] && delete body[key] })
                if (!err) {
                    this.loading = true
                    axios({ path: 'ActionMenuFunctionAddButton', body })
                        .finally(() => { this.loading = false })
                        .then(({ flag }) => {
                            if (flag) {
                                this.showModal = false
                                this.$emit('succ')
                            }
                        })
                }
            })
        }
    },
    watch: {
        showModal (value) {
            if (!value) {
                this.loading = false
                this.moduleList = []
                this.systemList = []
            }
        }
    }
}
</script>
