<template>
  <div class="main">
    <div class="search">
      <el-form :inline="true" class="demo-form-inline" label-width="120px">
        <el-form-item label="实业供应商">
          <el-select v-model="sy" @change="syselect">
            <el-option v-for="item in syArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商">
          <el-select v-model="supplierId" clearable filterable>
            <el-option v-for="item in supplierArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select v-model="brandId" clearable filterable>
            <el-option v-for="item in brandArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="stafftypeId" clearable filterable>
            <el-option v-for="item in stafftypeArr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="bh" placeholder="请输入商品编码" clearable />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="pattern" placeholder="请输入商品型号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status">
            <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query" style="margin-left: 60px;">搜索</el-button>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" row-key="id" border fit highlight-current-row style="width: 100%">
      <!-- <el-table-column label="序号" type="index" width="50" align="center" /> -->
      <el-table-column label="编号" prop="bh" align="center" />
      <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip width="280"/>
      <el-table-column label="价格" prop="saleprice" align="center" />
      <el-table-column label="品牌" prop="brand" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.brand.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="型号" prop="pattern" align="center" show-overflow-tooltip/>
      <el-table-column label="虚拟总量" prop="total" align="center" />
      <el-table-column label="最低采购数" prop="minadd" align="center" />
      <el-table-column label="佣金(元)/件" prop="ymoney" align="center" />
      <el-table-column label="状态" prop="status" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.status == 0 ? '正常' : '删除' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="name" align="center">
        <template slot-scope="{row}">
          <!-- <el-button type="text" @click="stop(row)">{{ row.status == 0 ? '删除' : '启用' }}</el-button> -->
          <el-button type="text" @click="stop(row)" v-if="row.status == 0">删除</el-button>
          <router-link :to="{name:'staff_details', query: {id:row.id}}">
            <el-button type="text">详情</el-button>
          </router-link>
         <!-- <router-link :to="{name:'staff_add', query: {id:row.id}}">
            <el-button type="text">修改</el-button>
          </router-link> -->
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
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        brandArr: [],
        brandId: null,
        supplierArr: [],
        list: [],
        listLoading: false,
        total: 0,
        nowpage: 1,
        perPage: 20,
        status: 0,
        syArr: [{
          value: 1,
          label: '是'
          },{
          value: 0,
          label: '否'
        }],
        statusArr: [{
          value: 0,
          label: '正常'
          },{
          value: 10,
          label: '删除'
        }],
        sy: 1,
        supplierId: null,
        name: '',
        pattern: '',
        bh: '',
        companyId: null,
        companyArr: [],
        stafftypeArr: [],
        stafftypeId: null
      }
    },
    mounted() {
      this.list_page()
      this.syselect()
      this.brand_list()
      this.stafftype_list()
    },
    methods: {
      list_page() {
        this.listLoading = true
        this.$post('http://192.168.3.237:9084/product/query', {
            'userId': 19,
            'page': this.nowpage.toString(),
            'limit': this.perPage.toString(),
            'name': this.name,
            'sy': this.sy,
            'status': this.status,
            'bh': this.bh,
            'pattern': this.pattern,
            'brandId': this.brandId ? Number(this.brandId) : null,
            'stafftypeId': this.stafftypeId ? Number(this.stafftypeId) : null,
            'supplierId': this.supplierId ? Number(this.supplierId) : null
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
        var expression = x.status === 0 ? '删除' : '恢复正常'
        this.$confirm('此操作将该商品' + expression + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$get('http://192.168.3.237:9084/product/delete', {
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
      },
      syselect(){
        this.$get('http://192.168.3.237:9084/product/listSupplier', {
          sy: this.sy
        })
          .then(res => {
            this.supplierArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      brand_list(){
        this.$get('http://192.168.3.237:9084/product/listBrand')
          .then(res => {
            this.brandArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      },
      stafftype_list(){
        this.$get('http://192.168.3.237:9084/product/listProducttype')
          .then(res => {
            this.stafftypeArr = res.data
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
</script>

<style>
</style>
