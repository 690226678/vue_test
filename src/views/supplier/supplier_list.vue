<template>
  <div class="main">
    <div class="search">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="编码">
          <el-input v-model="bh" placeholder="请输入编码" clearable />
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="name" placeholder="请输入供应商名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="实业供应商">
          <el-select v-model="sy" placeholder="请选择是否实业">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column label="序号" type="index" width="50" align="center" /> -->
      <el-table-column label="编号" prop="bh" align="center" />
      <el-table-column label="供应商名称" align="center" prop="name" show-overflow-tooltip />
      <el-table-column label="推荐公司" prop="companyname" align="center" />
      <el-table-column label="联络人" prop="ename" align="center" width="140" />
      <el-table-column label="经办人" prop="contactor" align="center" width="140" />
      <el-table-column label="联系电话" prop="phone" align="center" />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.status == 0 ? '正常' : '停用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="stop(row)">{{ row.status == 0 ? '停用' : '启用' }}</el-button>
          <router-link :to="{name:'supplier_details', query: {id:row.id}}">
            <el-button type="text">详情</el-button>
          </router-link>
          <router-link :to="{name:'supplier_add', query: {id:row.id}}">
            <el-button type="text">修改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex_right">
      <el-pagination
        :current-page="nowpage"
        :page-sizes="[10, 20, 50, 100]"
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
        perPage: 10,
        status: '0',
        sy: '0',
        options: [{
          value: '0',
          label: '正常'
        }, {
          value: '10',
          label: '停用'
        }],
        options2: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        bh: '',
        name: ''
      }
    },
    mounted() {
      this.list_page()
    },
    methods: {
      list_page() {
        this.listLoading = true
        this.$post('http://192.168.3.12:9084/supplier/querypagelist', {
            'id': 19,
            'page': this.nowpage.toString(),
            'limit': this.perPage.toString(),
            'name': this.name,
            'bh': this.bh,
            'status': this.status,
            'sy': this.sy
          })
          .then(res => {
            if (res.code === 10000) {
              this.list = res.data.list
              this.total = res.data.totalCount
              this.nowpage = res.data.currPage
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
        this.$confirm('此操作将该供应商' + expression + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('http://192.168.3.12:9084/supplier/disableRecovery', {
                'id': x.id,
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
