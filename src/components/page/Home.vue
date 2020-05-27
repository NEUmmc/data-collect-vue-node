<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <br />
    <el-card>
      <el-link type="danger" style="font-size:20px" :underline="false">数据概况：</el-link>

      <br />
      <br />
      <div class="box">
        <div class="box1">
          <img :src="imgclient" style="width:150px" />
          <div class="box2">
            <span>客户总数:</span>
            <span style="font-size:25px">{{clientSum}}</span>
          </div>
        </div>
        <div class="box1">
          <img :src="imgNew" style="width:150px" />
          <div class="box2">
            <span>新增客户数:</span>
            <span style="font-size:25px">{{newSum}}</span>
          </div>
        </div>
        <div class="box1">
          <img :src="imgExcel" style="width:150px" />
          <div class="box2">
            <span>待处理报表数:</span>
            <span style="font-size:25px">{{excelSum}}</span>
          </div>
        </div>
      </div>
      <br />
      <br />
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgclient: require("../../assets/clientNum.png"),
      imgExcel: require("../../assets/excel.png"),
      imgNew: require("../../assets/new.png"),
      clientSum: 0,
      newSum: 0,
      excelSum: 0
    };
  },
  mounted() {
    this.$post("/api/home/clientNum").then(res => {
      this.clientSum = res;
    });
  },
  methods: {}
};
</script>

<style scoped>
.box {
  display: flex;
  justify-content: space-around;
}
.box1 {
  display: flex;
  width: 300px;
  justify-content: space-between;
}
.box2 {
  width: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>