<template>
  <div class="main">
    <el-divider content-position="center">供应商信息</el-divider>
    <el-form ref="ruleForm" :inline="true" :model="ruleForm" class="demo-form-inline" label-width="160px">
      <el-form-item label="编码" class="form_line">
        <el-input v-model="ruleForm.bh" readonly />
      </el-form-item>
      <el-form-item label="供应商名称" class="form_line">
        <el-input v-model="ruleForm.name" readonly />
      </el-form-item>
      <el-form-item label="推荐公司" class="form_line">
        <el-select v-model="ruleForm.companyId" filterable clearable placeholder="请选择推荐公司" disabled>
          <el-option
            v-for="item in companyArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联络人" class="form_line">
        <el-input v-model="ruleForm.ename" readonly />
      </el-form-item>
      <el-form-item label="经办人" class="form_line">
        <el-input v-model="ruleForm.contactor" readonly />
      </el-form-item>
      <el-form-item label="联系电话" class="form_line">
        <el-input v-model="ruleForm.phone" readonly />
      </el-form-item>
      <el-form-item label="添加管理员" class="form_line">
        <el-input v-model="ruleForm.createuser" readonly />
      </el-form-item>
      <el-form-item label="创建时间" class="form_line">
        <el-input v-model="ruleForm.createdate" readonly />
      </el-form-item>
      <el-form-item label="结算比例" class="form_line">
        <el-input v-model="ruleForm.settlementratio" readonly />
      </el-form-item>
      <el-form-item label="删除管理员" class="form_line">
        <el-input v-model="ruleForm.createuser" readonly />
      </el-form-item>
      <el-form-item label="删除时间" class="form_line">
        <el-input v-model="ruleForm.createuser" readonly />
      </el-form-item>
    </el-form>
    <el-divider content-position="center">供应产品列表</el-divider>
    <div class="search_div">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="产品">
          <el-select v-model="productId" filterable placeholder="请选择">
              <el-option
                v-for="item in warseArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search">查询</el-button> -->
          <el-button type="primary" icon="el-icon-plus" @click='addWarse'>添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="编号" prop="bh" align="center" width="100" />
      <el-table-column label="名称" prop="name" align="center" width="400" show-overflow-tooltip/>
      <el-table-column label="品牌" prop="branname" align="center" />
      <el-table-column label="型号" prop="pattern" align="center" />
      <el-table-column label="颜色" prop="color" align="center" />
      <el-table-column label="版本" prop="version" align="center" />
      <el-table-column label="操作" prop="bh" align="center">
        <template slot-scope="{row}">
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="flex_right">
      <el-pagination
        :current-page="nowpage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        warseArr: [],
        companyArr: [],
        regionArr: [],
        ruleForm: {},
        keyword: '',
        list: [],
        listLoading: false,
        total: 0,
        nowpage: 1,
        perPage: 10,
        productId: ''
      }
    },
    mounted() {
      this.company_list()
      this.region_list()
      this.get_data()
      this.list_page()
      this.warse_list()
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
          that.$post('http://192.168.3.12:9084/supplier/view', {
             id: that.$route.query.id
           })
           .then(res => {
             that.ruleForm = res.data
           })
           .catch((err) => {
             console.log(err)
           })
        }
      },
      warse_list(){
        this.$get('http://192.168.3.237:9084/product/listProducts', {
          supplierId: this.$route.query.id
        })
          .then(res => {
            this.warseArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      list_page() {
        this.listLoading = true
        this.$post('http://192.168.3.12:9084/supplier/supplierproductlist', {
            id: this.$route.query.id
          })
          .then(res => {
            if (res.code === 10000) {
              this.list = res.data
              // this.total = res.data.totalCount
              // this.nowpage = res.data.currPage
              this.listLoading = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
              this.listLoading = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
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
      addWarse(){
        this.$post('http://192.168.3.12:9084/supplier/addsupplierproduct', {
            'id': this.$route.query.id,
            'productId': this.productId
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
      },
      remove(x){
        this.$confirm('此操作将该商品删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$post('http://192.168.3.12:9084/supplier/deletsupplierproduct', {
                'id': this.$route.query.id,
                'productId': x.id
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
      }
    }
  }
</script>

<style>
  .flex_button {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex_button button {
    margin: 10px 0;
  }

  .form_line {
    width: 30%;
  }
  .search_div{
    padding: 5px 10px;
  }
</style>
