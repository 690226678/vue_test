<template>
  <div class="main">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="文件名称" prop="attachname">
        <el-input v-model="ruleForm.attachname" placeholder="请输入文件名称" />
      </el-form-item>
      <el-form-item label="文件选择" prop="attachpath">
        <el-upload
          class="upload-demo"
          :action="action"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="filesuccess"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择文件类型">
          <el-option label="学习文档" value="学习文档" />
          <el-option label="操作视频" value="操作视频" />
          <el-option label="通知公告" value="通知公告" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" />
      </el-form-item>
      <div class="flex_button">
        <el-button type="primary" @click="submitForm('ruleForm')">上传</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fileList: [],
        action: 'http://192.168.3.12:8086/file/uploadFile',
        ruleForm: {
          attachname: '',
          type: '',
          description: '',
          attachpath: ''
        },
        rules: {
          attachname: [
            { required: true, message: '请输入文件名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择文件类型', trigger: 'change' }
          ],
          attachpath: [
            { required: true, message: '请选择上传文件', trigger: 'change' }
          ],
          description: [
            { required: true, message: '请填写该文件描述', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('http://192.168.3.12:8086/file/save', {
                'attachname': this.ruleForm.attachname,
                'attachpath': this.ruleForm.attachpath,
                'creator': '陈琛',
                'type': this.ruleForm.type,
                'description': this.ruleForm.description
              })
              .then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
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
      },
      handleRemove(file, fileList) {
        this.ruleForm.attachpath = ''
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      filesuccess(response, file, fileList) {
        this.ruleForm.attachpath = response.data.attachpath
      }
    }
  }
</script>

<style>
</style>
