<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
  #app{
    background-color: rgb(245, 245, 245);
  }
  .main{
    margin: 10px;
    padding: 5px;
    min-height: 600px;
    background-color: white;
  }
  .flex_right{
    display: flex;
    flex-direction: row-reverse;
    margin: 5px 0;
  }
  .flex_button {
     display: flex;
     justify-content: center;
     align-items: center;
   }
   .flex_button button {
     margin: 0 20px;
   }
  .search{
    margin: 5px 0;
  }
  .width_20{
    width: 20%;
  }
  body .el-table th.gutter {
    display: table-cell !important;
  }
  body .el-table colgroup.gutter {
    display: table-cell !important;
  }
</style>
