<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <br />
    <span>
      查询：
      <el-input style="width:200px" placeholder="请输入客户名" @input="search" v-model="search_clientname"></el-input>
      <el-input style="width:200px" placeholder="请输入手机号" @input="search" v-model="search_phone"></el-input>
      <el-date-picker
      v-model="value"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :default-time="['00:00:00', '23:59:59']"
      @change="search">
    </el-date-picker>
    </span>
    <el-button type="danger" icon="el-icon-refresh" @click="clear"></el-button>
    <br />
    <br />
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%;"
    >
      <el-table-column prop="id" sortable label="订单编号"></el-table-column>
      <el-table-column prop="clientname" label="客户名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="idcard" label="身份证号"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column
        prop="source"
        :filters="filterList"
        :filter-method="filterHandler"
        label="客户来源"
      ></el-table-column>
      <el-table-column prop="money" label="客户成单价格"></el-table-column>
      <el-table-column prop="time" sortable label="时间"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="look(scope.$index, scope.row)">查看报表</el-button>
          <!-- <el-button size="mini"  @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <br />
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10,12,14,tableData.length]"
      :page-size="pagesize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="tableData.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      value:'',
      search_clientname:'',
      search_phone:'',
      filterList: [],
      tableData: [],
      orginTableData: [],
      currentPage: 1, //默认页码为1
      pagesize: 10 //默认一页显示12条
    };
  },
  mounted() {
    this.$post("/api/client/getClient").then(res => {
      this.tableData = res;
      this.orginTableData = res;
    });
    this.$post("/api/user/getSource").then(res => {
      this.filterList = res.map(e => {
        return { value: e, text: e };
      });
    });
  },
  methods: {
    clear() {
      this.reload();
    },
    search() {
      let timelist = []
      if(!this.value){
        timelist = ['1900-01-01','2200-01-01']
      }else{
        timelist = this.value
      }
      this.tableData = this.orginTableData.filter(e =>
        e.clientname.match(this.search_clientname) && e.phone.match(this.search_phone) && timelist[0] <= e.time.slice(0,10) && e.time.slice(0,10) <= timelist[1]
      );
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(size) {
      //一页显示多少条
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      //页码更改方法
      this.currentPage = currentPage;
    },
    look(index, row) {
      this.$router.push({ path: "/table", query: { client_id: row.id } });
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style>
</style>