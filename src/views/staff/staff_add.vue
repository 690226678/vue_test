<template>
  <div class="main">
    <el-form ref="ruleForm" :inline="true" :model="ruleForm" :rules="rules" class="demo-form-inline" label-width="160px">
      <el-divider content-position="center">员工信息</el-divider>
      <el-form-item label="名称" class="form_line" prop="name">
        <el-input v-model="ruleForm.name" placeholder="名称" />
      </el-form-item>
      <el-form-item label="编号" class="form_line" prop="bh">
        <el-input v-model="ruleForm.bh" placeholder="编号" />
      </el-form-item>
      <el-form-item label="联系电话" class="form_line" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="联系电话" />
      </el-form-item>
      <el-form-item label="所属公司" class="form_line" prop="companyId">
        <el-select v-model="ruleForm.companyId" filterable clearable placeholder="请选择所属公司" @change="getposition">
          <el-option
            v-for="item in companyArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位" class="form_line" prop="stafftypeId">
        <el-select v-model="ruleForm.stafftypeId" filterable clearable placeholder="请选择职位">
          <el-option
            v-for="item in positionArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域" class="form_line" prop="districtId">
        <el-select v-model="ruleForm.districtId" filterable clearable placeholder="请选择区域">
          <el-option
            v-for="item in areaArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
     <!-- <el-form-item label="是否接收短信" class="form_line" prop="companyId">
        <el-select v-model="ruleForm.companyId" filterable clearable placeholder="请选择推荐公司">
          <el-option
            v-for="item in companyArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-divider content-position="center">登录账号</el-divider>
      <el-form-item label="账号" class="form_line" prop="username">
        <el-input v-model="ruleForm.username" placeholder="账号" />
      </el-form-item>
      <el-form-item label="密码" class="form_line" prop="password">
        <el-input v-model="ruleForm.password" placeholder="密码" />
      </el-form-item>
    </el-form>
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
        ruleForm: {},
        fileList: [],
        action: 'http://192.168.3.12:8086/file/uploadFile',
        rules: {
          name: [{
            required: true,
            message: '请输入员工名称',
            trigger: 'blur'
          }],
          companyId: [{
            required: true,
            message: '请选择所属公司',
            trigger: 'change'
          }],
          stafftypeId: [{
            required: true,
            message: '请选择职位',
            trigger: 'change'
          }],
          districtId: [{
            required: true,
            message: '请选择区域',
            trigger: 'change'
          }],
          bh: [{
            required: true,
            message: '请输入编码',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请输入员工名称',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          }]
        },
        companyId: null,
        companyArr: [],
        stafftypeId: null,
        positionArr: '',
        districtId: null,
        areaArr: []
      }
    },
    mounted() {
      this.company_list()
      this.getarea()
      this.get_data()
    },
    methods: {
      company_list() {
        this.$post('http://192.168.3.237:9084/staff/listCompany',{
          'userId': 19
        })
          .then(res => {
            this.companyArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getposition(){
        this.stafftypeId = ''
        if(this.ruleForm.companyId){
          this.$post('http://192.168.3.237:9084/staff/listStafftype',{
            'companyId': this.ruleForm.companyId
          })
            .then(res => {
              this.positionArr = res.data
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      getarea(){
        this.$post('http://192.168.3.237:9084/staff/listFdDistrict',{
          'userId': 19
        })
          .then(res => {
            this.areaArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      get_data() {
        if (this.$route.query.id) {
         this.$post('http://192.168.3.237:9084/staff/queryStaffDetailById', {
             staffId: Number(this.$route.query.id)
           })
           .then(res => {
             this.ruleForm = res.data
             this.ruleForm.username = res.data.user.name
             // this.ruleForm.password = res.data.user.password
             // this.ruleForm.companyId = res.data.company.id
             // this.ruleForm.stafftypeId = res.data.stafftype.id
             this.getposition()
           })
           .catch((err) => {
             console.log(err)
           })
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.echose()
            this.$post('http://192.168.3.12:9084/staff/save', this.ruleForm)
              .then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.resetForm(formName)
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
            this.$post('http://192.168.3.12:9084/staff/query', {
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
