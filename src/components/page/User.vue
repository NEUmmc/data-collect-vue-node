<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <br />
    <el-button type="danger" plain icon="el-icon-plus" @click="dialogVisible = true">新增员工</el-button>
    <el-button type="danger" icon="el-icon-refresh" @click="clear"></el-button>
    <br />
    <br />
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      height="650"
    >
      <el-table-column prop="id" sortable label="员工ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="password" label="密码"></el-table-column>
      <el-table-column prop="name" label="员工类型"></el-table-column>
      <el-table-column prop="fin" sortable label="已完成测评订单数"></el-table-column>
      <el-table-column prop="unfin" sortable label="未完成订单数"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改用户名，密码，员工类型可以使用，精力有限只做预留 -->
          <!-- <el-button size="mini" type="danger" @click="change(scope.$index, scope.row)">修改</el-button> -->
          <el-button type="danger" size="mini" @click="look(scope.$index, scope.row)">测评详情</el-button>
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
    <el-dialog title="新增员工" :visible.sync="dialogVisible" width="30%">
      <span>员工类型：</span>
      <el-select v-model="user_type" placeholder="请选择">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <br />
      <br />
      <span>用户名：</span>
      <el-input v-model="username" style="width:400px" placeholder="请输入用户名"></el-input>
      <br />
      <br />
      <span>密&nbsp;&nbsp;&nbsp;码：</span>
      <el-input v-model="password" style="width:400px" placeholder="请输入密码"></el-input>

      <br />
      <br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="add">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="测评详情" :visible.sync="dialogVisible1" width="70%">
      <div class="top">
        <span>员工类型：{{row_usertype}}</span>
        <span>用户名：{{row_username}}</span>
      </div>
      <br />
      <br />
      <el-link :underline="false" type="danger">未测评的客户：{{unfin.length}}</el-link>
      <!-- <el-divider></el-divider> -->
      <br />
      <br />
      <el-table size="mini" :data="unfin" style="width: 100%;" height="200">
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="clientname" label="客户名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="idcard" label="身份证号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="source" label="客户来源"></el-table-column>
      </el-table>
      <br />
      <br />
      <el-link :underline="false" type="warning">测评中的客户：{{half.length}}</el-link>
      <br />
      <br />
      <el-table size="mini" :data="half" style="width: 100%;" height="200">
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="clientname" label="客户名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="idcard" label="身份证号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="source" label="客户来源"></el-table-column>
      </el-table>
      <br />
      <br />
      <el-link :underline="false" type="success">已完成的客户：{{fin.length}}</el-link>
      <br />
      <br />
      <el-table size="mini" :data="fin" style="width: 100%;" height="200">
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="clientname" label="客户名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="idcard" label="身份证号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="source" label="客户来源"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible1 = false">取 消</el-button> -->
        <el-button type="danger" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  data() {
    return {
      currentPage: 1, //默认页码为1
      pagesize: 10, //默认一页显示11条
      row_username: "",
      row_usertype: "",
      user_type: "",
      username: "",
      password: "",
      dialogVisible: false,
      dialogVisible1: false,
      tableData: [],
      typeList: [],
      fin: [],
      unfin: [],
      half: []
    };
  },
  mounted() {
    this.$post("/api/user/getUser").then(res1 => {
      console.log(res1);
      res1.forEach(r => {
        this.$post("/api/client/getFinClient", {
          user: r.id,
          user_type: r.user_type
        }).then(res2 => {
          console.log(res2);
          let temp = r;
          temp.fin = res2.fin.length;
          temp.unfin = res2.clients - temp.fin;
          this.$post("/api/user/getUserTypeName").then(res3 => {
            this.typeList = res3;
            res3.forEach(r3 => {
              if (temp.user_type == r3.value) {
                temp.name = r3.name;
              }
            });
            this.tableData.push(temp);
          });
        });
      });
    });
  },
  methods: {
    handleSizeChange(size) {
      //一页显示多少条
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {
      //页码更改方法
      this.currentPage = currentPage;
    },
    clear() {
      this.reload();
    },
    // change(index, row) {
    //   console.log(row.id);
    // },预留
    look(index, row) {
      this.dialogVisible1 = true;
      this.row_username = row.username;
      this.row_usertype = row.user_type;
      this.$post("/api/client/getFinClient", {
        user: row.id,
        user_type: row.user_type
      }).then(res => {
        this.fin = res.fin;
        this.half = res.half;
      });
      this.$post("/api/client/getUnfinClient", {
        user: row.id
      }).then(res => {
        this.unfin = res;
      });
    },
    add() {
      if (this.username == "" || this.password == "" || this.user_type == "") {
        this.$message.warning("员工类型，用户名，密码不得为空");
      } else {
        this.$post("/api/user/addUser", {
          username: this.username,
          password: this.password,
          user_type: this.user_type
        }).then(res => {
          if (res == "新增成功") {
            this.$message.success("新增成功");
            this.dialogVisible = false;
            this.reload();
          }
        });
      }
    }
  }
};
</script>

<style>
.top {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 15px;
  font-weight: bold;
  justify-content: space-between;
}
</style>