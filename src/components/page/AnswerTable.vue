<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/client' }">用户</el-breadcrumb-item>
      <el-breadcrumb-item>用户报表</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <br />
    <el-table
      id="out-table"
      :data="tableData"
      border
      style="width: 100%;"
      :span-method="objectSpanMethod"
      height="650"
    >
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="category_name" label="问题类别"></el-table-column>
      <el-table-column prop="question" label="问题细节"></el-table-column>
      <!-- <el-table-column prop="weight2" label="二级权重"></el-table-column>
      <el-table-column prop="weight1" label="一级权重"></el-table-column> -->
      <el-table-column
        v-for="item in answers"
        :key="item.username"
        :prop="item.colname"
        :label="item.username"
      ></el-table-column>
    </el-table>
    <br />
    <br />
    <el-button type="danger" @click="getExcel">导出</el-button>
    
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";

export default {
  data() {
    return {
      tableData: [],
      answers: []
    };
  },
  mounted() {
    //得到问题项目
    this.$post("/api/table/getTable").then(res => {
      this.tableData = res;
    });
    //得到分数
    this.$post("/api/table/getAnswer",{
      client_id:this.$route.query.client_id
    }).then(res => {
      this.answers = res;
      this.answers.forEach(user => {
        this.tableData.forEach(element => {
          user.answer.forEach((item, index) => {
            if (item.id == element.question_id) {
              console.log(item.answer)
              eval("element." + user.colname + "=item.answer");
            }
          });
        });
      });
      
    });
  },
  methods: {
    
    //定义导出Excel表格事件
    getExcel() {
      /* generate workbook object from table */
      let wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* get binary string as output */
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        //Blob 对象表示一个不可变、原始数据的类文件对象。
        //Blob 表示的不一定是JavaScript原生格式的数据。
        //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
        //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "考核人员表格.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.flitterData(this.tableData).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 1) {
        const _row = this.flitterData(this.tableData).two[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      // if (columnIndex === 4) {
      //   const _row = this.flitterData(this.tableData).three[rowIndex];
      //   const _col = _row > 0 ? 1 : 0;
      //   return {
      //     rowspan: _row,
      //     colspan: _col
      //   };
      // }
    },
    //合并表格算法
    flitterData(arr) {
      let spanOneArr = [],
        spanTwoArr = [],
        // spanThreeArr = [],
        concatOne = 0,
        concatTwo = 0;
        // concatThree = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
          // spanThreeArr.push(1);
        } else {
          if (item.id === arr[index - 1].id) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
          if (
            item.category_name === arr[index - 1].category_name &&
            item.id === arr[index - 1].id
          ) {
            //第二列需合并相同内容的判断条件
            spanTwoArr[concatTwo] += 1;
            spanTwoArr.push(0);
          } else {
            spanTwoArr.push(1);
            concatTwo = index;
          }
          // if (
          //   item.id === arr[index - 1].id &&
          //   item.weight1 === arr[index - 1].weight1
          // ) {
          //   //第三列需合并相同内容的判断条件
          //   spanThreeArr[concatThree] += 1;
          //   spanThreeArr.push(0);
          // } else {
          //   spanThreeArr.push(1);
          //   concatThree = index;
          // }
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr,
        // three: spanThreeArr
      };
    }
  }
};
</script>

<style>
</style>