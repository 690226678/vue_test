<template>
  <div class="main">
    <el-divider content-position="center">员工信息</el-divider>
    <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules" class="demo-form-inline" label-width="160px">
      <el-form-item label="供应商名称" class="form_line" prop="name">
        <el-input v-model="ruleForm.name" placeholder="供应商名称" />
      </el-form-item>
      <el-form-item label="联络人" class="form_line" prop="ename">
        <el-input v-model="ruleForm.ename" placeholder="联络人" />
      </el-form-item>
      <el-form-item label="推荐公司" class="form_line" prop="companyId">
        <el-select v-model="ruleForm.companyId" filterable clearable placeholder="请选择推荐公司">
          <el-option
            v-for="item in companyArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算比例" class="form_line" prop="settlementratio">
        <el-input v-model="ruleForm.settlementratio" placeholder="结算比例" />
      </el-form-item>
      <el-form-item label="经办人" class="form_line" prop="contactor">
        <el-input v-model="ruleForm.contactor" placeholder="经办人" />
      </el-form-item>
      <el-form-item label="联系电话" class="form_line" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="联系电话" />
      </el-form-item>
    </el-form>
    <el-divider content-position="center">销售区域</el-divider>
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" border style="min-width: 15%; margin: 5px;" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="item in regionArr" :key="item.id" :label="item" border style="min-width: 15%; margin: 5px;" class="checkboxAll">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-divider content-position="center">创建供应商</el-divider>
    <div class="flex_button">
      <el-button v-if="!$route.query.id" type="primary" @click="submitForm('ruleForm')">创建</el-button>
      <el-button v-if="$route.query.id" type="primary" @click="update('ruleForm')">保存</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        salearea: [],
        companyArr: [],
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        regionArr: [],
        ruleForm: {
          name: '',
          ename: '',
          contactor: '',
          companyId: '',
          settlementratio: '',
          phone: ''
        },
        fileList: [],
        action: 'http://192.168.3.12:8086/file/uploadFile',
        rules: {
          name: [{
            required: true,
            message: '请输入供应商名称',
            trigger: 'blur'
          }],
          companyId: [{
            required: true,
            message: '请选择推荐公司',
            trigger: 'change'
          }],
          contactor: [{
            required: true,
            message: '请输入经办人',
            trigger: 'blur'
          }],
          ename: [{
            required: true,
            message: '请输入联络人',
            trigger: 'blur'
          }],
          settlementratio: [{
            required: true,
            message: '请输入结算比例',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      this.company_list()
      this.region_list()
      this.get_data()
    },
    methods: {
      company_list() {
        this.$post('http://192.168.3.12:9084/company/recommendedcompanylist')
          .then(res => {
            this.companyArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      region_list() {
        this.$post('http://192.168.3.12:9084/company/companyList')
          .then(res => {
            this.regionArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      get_data() {
        if (this.$route.query.id) {
          var that = this
          setTimeout(function() {
           that.$post('http://192.168.3.12:9084/supplier/view', {
               id: that.$route.query.id
             })
             .then(res => {
               that.ruleForm = res.data
               var sear = that.ruleForm.salearea == null ? [] : that.ruleForm.salearea.split(',')
               that.regionArr.forEach(function(value) {
                 sear.forEach(function(val) {
                   if (value.id === Number(val)) {
                     that.checkedCities.push(value)
                   }
                 })
               })
             })
             .catch((err) => {
               console.log(err)
             })
           }, 1000)
        }
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? this.regionArr : []
        this.isIndeterminate = false
      },
      handleCheckedCitiesChange(value) {
        const checkedCount = value.length
        this.checkAll = checkedCount === this.regionArr.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.regionArr.length
      },
      echose() {
        const AllidArr = []
        this.checkedCities.forEach(function(value, index, array) {
          AllidArr.push(value.id)
        })
        this.salearea = AllidArr
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.echose()
            this.$post('http://192.168.3.12:9084/supplier/save', {
                'name': this.ruleForm.name,
                'phone': this.ruleForm.phone,
                'contactor': this.ruleForm.contactor,
                'ename': this.ruleForm.ename,
                'companyId': this.ruleForm.companyId,
                'settlementratio': this.ruleForm.settlementratio,
                'createuser': '陈琛',
                'salearea': this.salearea
              })
              .then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.resetForm(formName)
                  this.checkedCities = []
                  this.checkAll = false
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      update(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.echose()
            this.$post('http://192.168.3.12:9084/supplier/updatesupplier', {
                'id': this.ruleForm.id,
                'name': this.ruleForm.name,
                'phone': this.ruleForm.phone,
                'contactor': this.ruleForm.contactor,
                'ename': this.ruleForm.ename,
                'companyId': this.ruleForm.companyId,
                'settlementratio': this.ruleForm.settlementratio,
                'createuser': '陈琛',
                'salearea': this.salearea
              })
              .then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.get_data()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.message
                  })
                }
              })
              .catch((err) => {
                console.log(err)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>
  .form_line {
    width: 30%;
  }
</style>
