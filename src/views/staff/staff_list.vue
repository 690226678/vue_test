<template>
  <div class="main">
    <div class="search">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item label="编号">
          <el-input v-model="bh" placeholder="请输入员工编号" clearable />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="name" placeholder="请输入员工名称" clearable />
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="companyId" placeholder="请选择所属公司" @change="getposition" clearable filterable >
            <el-option v-for="item in companyArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="stafftypeId" placeholder="请先选择所属公司" clearable filterable >
            <el-option v-for="item in positionArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query" style="margin-left: 60px;">搜索</el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="编号" prop="bh" align="center" />
      <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip />
      <el-table-column label="公司" prop="companyname" align="center">
        <template slot-scope="{row}">
          <span>{{ row.company.name }}</span>
        </template>
      </el-table-column>
     <el-table-column label="登录账号" prop="companyname" align="center">
        <template slot-scope="{row}">
          <span>{{ row.user.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" prop="companyname" align="center">
        <template slot-scope="{row}">
          <span>{{ row.stafftype.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.status == 0 ? '正常' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="stop(row)">{{ row.status == 0 ? '停用' : '启用' }}</el-button>
          <router-link :to="{name:'staff_details', query: {id:row.id}}">
            <el-button type="text">详情</el-button>
          </router-link>
          <router-link :to="{name:'staff_add', query: {id:row.id}}">
            <el-button type="text">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex_right">
      <el-pagination
        :current-page="nowpage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <el-dialog title="修改文件信息" :visible.sync="dialogFormVisible" :show-close="show">
      <el-form :model="form">
        <el-form-item label="文件名称" :label-width="formLabelWidth">
          <el-input v-model="form.attachname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文件类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择活动区域">
            <el-option label="学习文档" value="学习文档" />
            <el-option label="操作视频" value="操作视频" />
            <el-option label="通知公告" value="通知公告" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件描述" :label-width="formLabelWidth">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="modify()">保 存</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        show: false,
        list: [],
        listLoading: false,
        dialogFormVisible: false,
        form: {
          description: '',
          type: '',
          attachname: ''
        },
        formLabelWidth: '120px',
        total: 0,
        nowpage: 1,
        perPage: 20,
        status: 0,
        sy: '0',
        options: [{
          value: 0,
          label: '正常'
        }, {
          value: 10,
          label: '停用'
        }],
        bh: '',
        name: '',
        companyId: null,
        companyArr: [],
        stafftypeId: null,
        positionArr: ''
      }
    },
    mounted() {
      this.list_page()
      this.company_list()
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
        if(this.companyId){
          this.$post('http://192.168.3.237:9084/staff/listStafftype',{
            'companyId': this.companyId
          })
            .then(res => {
              this.positionArr = res.data
            })
            .catch((err) => {
              console.log(err)
            })
        }
      },
      list_page() {
        this.listLoading = true
        this.$post('http://192.168.3.237:9084/staff/query', {
            'userId': 19,
            'page': this.nowpage.toString(),
            'limit': this.perPage.toString(),
            'name': this.name,
            'bh': this.bh,
            'status': this.status,
            'companyId': this.companyId,
            'stafftypeId': this.stafftypeId
          })
          .then(res => {
            if (res.code === 10000) {
              this.list = res.data.records
              this.total = res.data.total
              this.nowpage = res.data.current
              this.listLoading = false
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              this.listLoading = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      query() {
        this.nowpage = 1
        this.list_page()
      },
      handleSizeChange(val) {
        this.nowpage = 1
        this.perPage = val
        this.list_page()
      },
      handleCurrentChange(val) {
        this.nowpage = val
        this.list_page()
      },
      stop(x) {
        var expression = x.status === 0 ? '停止使用' : '启用'
        this.$confirm('此操作将该员工' + expression + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('http://192.168.3.237:9084/staff/delete', {
                'staffId': x.id,
                'status': x.status
              })
              .then(res => {
                if (res.code === 10000) {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.list_page()
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      },
      details(data) {
        // this.dialogFormVisible = true
        // this.form = data
        this.$post('http://192.168.3.12:9084/supplier/view', {
          id: data.id
        })
          .then(res => {
            // if (res.data.code === 10000) {
            //   this.$message({
            //     type: 'success',
            //     message: res.data.message
            //   })
            //   this.dialogFormVisible = false
            //   this.list_page()
            // } else {
            //   this.$message({
            //     type: 'error',
            //     message: res.data.message
            //   })
            // }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      modify() {
        this.$post('http://192.168.3.12:8086/file/update', this.form)
          .then(res => {
            if (res.data.code === 10000) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.dialogFormVisible = false
              this.list_page()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      cancel() {
        this.dialogFormVisible = false
        this.list_page()
      }
    }
  }
</script>

<style>
</style>
