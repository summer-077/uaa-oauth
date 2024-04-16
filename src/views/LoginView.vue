<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="https://img.ensida.cn/202403121316193e2f71884.jpg" alt />
      </div>
      <!-- 登录表单区 -->
      <el-form ref="LoginFormRef" label-width="0" :model="form" class="login_form" :rules="rules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-s-custom" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-view" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置
    resetLoginForm: function() {
      // console.log(this)
      this.$refs.LoginFormRef.resetFields()
    },
    // 表单预验证
    login: function() {
      this.$refs.LoginFormRef.validate(
        async valid => {
          if (!valid) return
          try {
            const { data: res } = await this.$axios.post('login', this.form)
            if (res.meta.status !== 200) return this.$message.success('登录失败')
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', res.data.token)
            this.$router.push('home')
          } catch (error) {
            this.$message.error(error.message||'请求失败');
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
body {
  background: #2b4b6b;
}
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
}
</style>
