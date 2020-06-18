<template>
  <div class="flex">
    <ul class="slideshow">
      <li>
        <span>1</span>
      </li>
      <li>
        <span>2</span>
      </li>
      <li>
        <span>3</span>
      </li>
      <li>
        <span>4</span>
      </li>
    </ul>
    <div class="box">
      <span class="title">冻龄数据采集平台</span>
      <el-input
        style="width:20rem"
        v-model="username"
        placeholder="请输入内容"
        prefix-icon="el-icon-user-solid"
      ></el-input>
      <el-input
        style="width:20rem"
        v-model="password"
        placeholder="请输入密码"
        prefix-icon="el-icon-lock"
        show-password
      ></el-input>
      <el-button style="width:20rem" type="danger" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      if (this.username == "") {
        this.$message.error("请输入用户名~");
      } else if (this.password == "") {
        this.$message.error("请输入密码～");
      } else {
        //请求
        this.$post("/api/admin/login", {
          username: this.username,
          password: this.password
        }).then(res => {
          //处理response
          if (res == "用户名错误") {
            this.$message.warning("用户名错误");
          } else if (res == "密码错误") {
            this.$message.warning("密码错误");
          } else {
            this.$message.success("登录成功");
            this.$router.push("/main");
          }
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  font-size: 18px;
}
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  opacity: 0.95;
  width: 35rem;
  height: 25rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
}
.slideshow {
  list-style: none;
  z-index: -1;
}

.slideshow li span {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  color: transparent;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: none;
  opacity: 0;
  z-index: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-animation: imageAnimation 24s linear infinite 0s;
  -moz-animation: imageAnimation 24s linear infinite 0s;
  animation: imageAnimation 24s linear infinite 0s;
}

.slideshow li:nth-child(1) span {
  background-image: url(https://i.loli.net/2020/06/18/egTBktHbG7pyls4.jpg);
}

.slideshow li:nth-child(2) span {
  background-image: url(https://i.loli.net/2020/06/18/X1DPeKS4stTqOV9.jpg);
  -webkit-animation-delay: 6s;
  -moz-animation-delay: 6s;
  animation-delay: 6s;
}

.slideshow li:nth-child(3) span {
  background-image: url(https://i.loli.net/2020/06/18/sIrKgoM4i2EGUpT.jpg);
  -webkit-animation-delay: 12s;
  -moz-animation-delay: 12s;
  animation-delay: 12s;
}

.slideshow li:nth-child(4) span {
  background-image: url(https://i.loli.net/2020/06/18/7LgVARo2YK9OWeD.jpg);
  -webkit-animation-delay: 18s;
  -moz-animation-delay: 18s;
  animation-delay: 18s;
}

@-webkit-keyframes imageAnimation {
  0% {
    opacity: 0;
    -webkit-animation-timing-function: ease-in;
  }

  12.5% {
    opacity: 1;
    -webkit-animation-timing-function: ease-out;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-moz-keyframes imageAnimation {
  0% {
    opacity: 0;
    -moz-animation-timing-function: ease-in;
  }

  12.5% {
    opacity: 1;
    -moz-animation-timing-function: ease-out;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes imageAnimation {
  0% {
    opacity: 0;
    -webkit-animation-timing-function: ease-in;
    -moz-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  12.5% {
    opacity: 1;
    -webkit-animation-timing-function: ease-out;
    -moz-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-webkit-keyframes titleAnimation {
  0% {
    opacity: 0;
  }

  12.5% {
    opacity: 1;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@-moz-keyframes titleAnimation {
  0% {
    opacity: 0;
  }

  12.5% {
    opacity: 1;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

@keyframes titleAnimation {
  0% {
    opacity: 0;
  }

  12.5% {
    opacity: 1;
  }

  25% {
    opacity: 1;
  }

  37.5% {
    opacity: 0;
  }

  100% {
    opacity: 0;
  }
}

.no-cssanimations .slideshow li span {
  opacity: 1;
}
</style>
