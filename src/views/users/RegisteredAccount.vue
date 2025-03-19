<template>
  <div class="login">
    <el-card class="card">
      <div class="car_con">
        <div class="text">
          <div><h1>Sign In to Recharge Direct</h1></div>
          <div>
            <div>If you have an account</div>
            <div>you can <span @click="$router.push('/login')" class="Register">log in here!</span></div>
          </div>
          <!-- <div class="embellishment"></div> -->
        </div>
        <div class="bg">
          <img src="https://cdn.lzzsyx.cn/10001/20250314/eeb4b3e6d2408e1f6c0ff5cd535c6489.png" alt="">
        </div>
        <div class="form">
          <div class="form_con">
            <el-form :model="form" label-width="0" style="width: 260px">
              <el-form-item>
                <el-input v-model="form.username" placeholder="username" clearable :suffix-icon="User"/>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.password" type="password" placeholder="password" clearable :suffix-icon="Hide"/>
              </el-form-item>
              <el-form-item>
                <el-input v-model="form.password" type="password" placeholder="password" clearable :suffix-icon="Hide"/>
              </el-form-item>
              <el-form-item>
                <el-button @click="submit" type="primary" class="submit">Submit</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="line_con">
            <div class="line"></div>
            <div class="lint_text">to log in to the</div>
            <div class="line"></div>
          </div>
          <div class="login_method">
            <div class="item">
              <img src="https://cdn.lzzsyx.cn/10001/20250315/5c2a52bc80636628a78e02585835b741.png" alt="">
            </div>
            <div class="item">
              <img @click="$router.push('/login')" src="https://cdn.lzzsyx.cn/10001/20250315/f50bb99ccdfc9720060d952c5a926395.png" alt="">
            </div>
            <div class="item">
              <img @click="$router.push('/login')" src="https://cdn.lzzsyx.cn/10001/20250315/6b6c276976ea7803a019fa6214097f95.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { User, Hide } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
const form = reactive({
  username: '',
  password: '',
})

const submit = ()=> {
  ElMessageBox.alert('登录账号？', '提示', {
    confirmButtonText: '是的',
    callback: (action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}

</script>

<style lang="less">
html {
  height: 100%;
  margin: 0;
  padding: 0;
}
.el-card__body {
  height: 100%;
}
.el-card {
  border-radius: 30px;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: rgb(143, 189, 232);
  display: flex;
  align-items: center;
  justify-content: center;
  .card {
    width: 1200px;
    height: 700px;
    .car_con {
      padding: 0 60px;
      display: flex;
      height: 100%;
      // padding-top: 100px;
      align-items: center;
      .text {
        flex: 1;
        padding-bottom: 150px;
        .Register {
          color: rgb(68, 97, 242);
          font-weight: 500;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none;    /* Firefox */
          -ms-user-select: none;     /* IE 10+ */
          user-select: none;         /* Standard syntax */
          cursor: pointer;
        }
        .embellishment {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 200px;
          height: 200px;
          background: radial-gradient(
            circle at center,
            rgba(143, 189, 232, 0.8),
            rgba(143, 189, 232, 0.4) 50%,
            rgba(143, 189, 232, 0) 100%
          );
          border-radius: 999px;
          filter: blur(20px);
          transform: scale(1.2);
        }
        position: relative;
      }
      .bg {
        img {
          width: 300px;
          height: 300px;
        }
      }
      .form {
        width: 400px;
        .form_con {
          display: flex;
          justify-content: center;
          .LoginType {
            width: 100%;
            text-align: right;
            font-size: 14px;
            color: rgb(199, 199, 199);
            padding-bottom: 10px;
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none;    /* Firefox */
            -ms-user-select: none;     /* IE 10+ */
            user-select: none;         /* Standard syntax */
            cursor: pointer;
          }
          .submit {
            margin-top: 30px;
            width: 100%;
          }
        }
        .line_con {
          display: flex;
          align-items: center;
          margin: 0 auto;
          width: 260px;
          padding: 20px 0;
          .line {
            flex: 1;
            height: 1px;
            background: rgb(223, 223, 223);
          }
          .lint_text {
            color: rgb(119, 119, 119);
            padding: 0 10px;
            font-size: 12px;
          }
        }
        .login_method {
          margin: 0 auto;
          width: 260px;
          display: flex;
          justify-content: space-between;
          .item {
            font-size: 0;
            // border: 1px solid #999;
            border-radius: 8px;
            // padding: 0 20px;
            -webkit-user-select: none; /* Safari */
            -moz-user-select: none;    /* Firefox */
            -ms-user-select: none;     /* IE 10+ */
            user-select: none;         /* Standard syntax */
            cursor: pointer;
            img {
              width: 40px;
              height: 40px;
            }
          }
        }
      }
    }
  }
}
</style>