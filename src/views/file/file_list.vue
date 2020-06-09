<template>
  <div class="main">
    <div class="search">
      <el-input v-model="attachname" placeholder="请输入文件名" clearable class="width_20" />
      <el-input v-model="creator" placeholder="请输入上传人" clearable class="width_20" />
      <el-select v-model="type" clearable placeholder="请选择类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="timedate"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      />
      <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
    </div>
    <!-- <el-table ref="dragTable" v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%"> -->
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="文件名称" align="center" prop="attachname" show-overflow-tooltip />
      <el-table-column label="上传人" prop="creator" align="center" />
      <el-table-column label="上传时间" prop="date" align="center" />
      <el-table-column label="文件描述" prop="description" align="center" />
      <el-table-column label="类型" prop="type" align="center" />
      <el-table-column label="操作" prop="name" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="download(row)">下载</el-button>
          <!-- <el-button type="text" @click='details(row)'>详情</el-button> -->
          <el-button type="text" @click="details(row)">修改</el-button>
          <el-button type="text" @click="remove(row)">删除</el-button>
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
    <el-dialog title="修改文件信息" :visible.sync="dialogFormVisible" :show-close="show">
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
    </el-dialog>
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
        type: '',
        options: [{
          value: '学习文档',
          label: '学习文档'
        }, {
          value: '操作视频',
          label: '操作视频'
        }, {
          value: '通知公告',
          label: '通知公告'
        }, {
          value: '其他',
          label: '其他'
        }],
        attachname: '',
        creator: '',
        timedate: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    mounted() {
      this.list_page()
    },
    methods: {
      list_page() {
        this.listLoading = true
        // this.$store.dispatch('file/file_list')
        // .then((res) => {
        //   this.list = res.data
        // })
        // .catch(() => {
        //   this.loading = false
        // })
        this.$post('http://192.168.3.12:8086/file/pagelist', {
            'page': this.nowpage.toString(),
            'limit': this.perPage.toString(),
            'attachname': this.attachname,
            'creator': this.creator,
            'type': this.type,
            'Before': this.timedate ? this.timedate[0] : '',
            'After': this.timedate ? this.timedate[1] : ''
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
      download(x) {
        axios({
            method: 'post',
            url: 'http://192.168.3.12:8086/file/downloadFile',
            data: {
              'id': x.id
            },
            responseType: 'blob'
          })
          .then(res => {
            const content = res.data
            const blob = new Blob([content], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }) // 构造一个blob对象来处理数据
            const fileName = x.attachname
            // 对于<a>标签,只有Firefox和Chrome（内核支持download属性
            // IE10以上支持blob
            if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
              const link = document.createElement('a') // 创建a标签
              link.download = fileName // a标签添加属性
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              document.body.appendChild(link)
              link.click() // 执行下载
              URL.revokeObjectURL(link.href) // 释放url
              document.body.removeChild(link) // 释放标签
              // 此写法兼容火狐
              const evt = document.createEvent('MouseEvents')
              evt.initEvent('click', false, false)
              let downloadElement
              downloadElement.dispatchEvent(evt)
              document.body.removeChild(downloadElement)
            } else {
              navigator.msSaveBlob(blob, fileName)
            }
          })
          .catch((err) => {
            console.log(err)
          })
        // this.axios.post('http://192.168.3.12:8086/file/downloadFile', {
        //    id: x.id,
        //  })
        //  .then(function (response) {
        //    console.log(response);
        //  })
        //  .catch(function (error) {
        //    console.log(error);
        //  });
        // this.$post('http://192.168.3.12:8086/file/downloadFile?id='+x.id, {
        // this.$post('http://192.168.3.12:8086/file/downloadFile', {
        //     'id': x.id,
        //   },{responseType:'blob'})
        //   .then(res => {
        //     console.log(res)
        //     if(res.data.code === 10000){
        //       this.$message({
        //         type: 'success',
        //         message: res.data.message
        //       })
        //     } else {
        //       this.$message({
        //         type: 'error',
        //         message: res.data.message
        //       })
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
      },
      remove(x) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('http://192.168.3.12:8086/file/delFile', {
                'id': x.id
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
              message: '已取消删除'
            })
          })
      },
      details(data) {
        this.dialogFormVisible = true
        this.form = data
      },
      modify() {
        this.$post('http://192.168.3.12:8086/file/update', this.form)
          .then(res => {
            if (res.code === 10000) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.dialogFormVisible = false
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
