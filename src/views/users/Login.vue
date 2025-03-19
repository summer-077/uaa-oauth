<template>
  <div class="login">
    <el-card class="login_card flex flex-col justify-center">
      <div class="car_con flex flex-row justify-center">
        <div class="text">
          <div class="bg_circle top_circle absolute"></div>
          <div class="bg_circle bottom_circle absolute bottom-10 right-10 w-10"></div>
          <div class="login_text absolute flex flex-col justify-center z-2">
            <span>请登录</span>
            <span>以授权访问</span>
          </div>
          <div class="register_text absolute flex flex-col justify-center bottom-20 z-2">
            <div>没有账户？</div>
            <div>
              <span @click="$router.push('/registered')" class="Register">点击这里注册！</span>
            </div>
          </div>
        </div>
        <div class="bg">
          <img src="../../assets/svg/login_person.svg" alt="" />
        </div>
        <div class="form">
          <div class="form_con">
            <el-form :model="form" label-width="0" style="width: 260px">
              <el-form-item>
                <el-input
                  v-model="form.username"
                  :placeholder="placeholder.username"
                  clearable
                  :suffix-icon="User"
                />
              </el-form-item>
              <el-form-item v-if="type == 2">
                <el-input v-model="form.code" placeholder="请输入验证码" clearable>
                  <template #append
                    ><el-button @click="useVerificationCode">{{ text }}</el-button></template
                  >
                </el-input>
                <div style="height: 30px; width: 100%"></div>
              </el-form-item>
              <el-form-item v-if="type != 2">
                <el-input
                  v-model="form.password"
                  type="password"
                  :placeholder="placeholder.password"
                  clearable
                  :suffix-icon="Hide"
                />
                <div @click="$router.push('/registered')" class="LoginType">忘记密码？</div>
              </el-form-item>

              <el-form-item>
                <el-button @click="submit" type="primary" class="submit">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="line_con">
            <div class="line"></div>
            <div class="lint_text">Or continue with</div>
            <div class="line"></div>
          </div>
          <div class="login_method">
            <div class="item">
              <img
                src="https://cdn.lzzsyx.cn/10001/20250315/5c2a52bc80636628a78e02585835b741.png"
                alt=""
              />
            </div>
            <div @click="checkLoginType(3)" class="item">
              <img
                src="https://cdn.lzzsyx.cn/10001/20250315/f50bb99ccdfc9720060d952c5a926395.png"
                alt=""
              />
            </div>
            <div @click="checkLoginType(2)" class="item">
              <img
                src="https://cdn.lzzsyx.cn/10001/20250315/6b6c276976ea7803a019fa6214097f95.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { User, Hide } from '@element-plus/icons-vue'
import { reactive, ref, toRefs } from 'vue'
import { OAUTH_AXIOS } from '@/core/http-client/oauth'
const placeholder = reactive({
  username: '请输入账号',
  password: '请输入密码',
})

// 1:用户名密码登录，2：手机号验证码登录，3：邮箱登录，4：微信登录
const type = ref(1)
let timer = null
const text = ref('获取验证码')

const placeholderMap = {
  1: { username: '请输入用户名', password: '请输入密码' },
  2: { username: '请输入手机号码', password: '请输入验证码' },
  3: { username: '请输入邮箱', password: '请输入密码' },
}

const checkLoginType = (t) => {
  type.value = t === 2 ? (type.value === 2 ? 1 : 2) : t

  const placeholders = placeholderMap[type.value] || { username: '', password: '' }
  placeholder.username = placeholders.username
  placeholder.password = placeholders.password
}

const useVerificationCode = () => {
  if (!timer) {
    let countdown = 60
    timer = setInterval(() => {
      if (countdown < 1) {
        text.value = '获取验证码'
        clearInterval(timer)
        timer = null
      } else {
        countdown--
        text.value = countdown + 's后重试'
      }
    }, 1000)
  }
}
const form = reactive({
  username: '',
  password: '',
  code: '',
})
const { username, password } = toRefs(form)
const submit = () => {
  OAUTH_AXIOS.post('/login', { username: username.value, password: password.value })
    .then((response) => {
      // 1. 如果浏览器自动处理了 302 重定向
      if (response.request.responseURL) {
        window.location.href = response.request.responseURL
      } else {
        // 2. 手动获取 Location 头部进行跳转
        const location = response.headers.location
        if (location) {
          window.location.href = location
        } else {
          console.error('No Location header found')
        }
      }
    })
    .catch((error) => console.error('Login error:', error))
}
</script>

<style scoped lang="less">
::v-deep .el-input__wrapper {
  background-color: #eaf0f7;
  box-shadow: 0 0 0 0;
  height: 40px;
  border-radius: 10px;
}
::v-deep .el-card {
  border-radius: 20px;
}
::v-deep .el-button {
  font-weight: 900;
  background-color: #4461f2;
  border-radius: 10px;
  height: 40px;
}
.login {
  margin: 0;
  padding: 0;
  height: 100%;
  background: rgb(143, 189, 232);
  display: flex;
  align-items: center;
  justify-content: center;
  .login_card {
    width: 1200px;
    height: 600px;

    .car_con {
      padding: 0 auto;
      height: 100%;
      > * {
        width: 300px;
      }
      .text {
        padding-bottom: 150px;
        position: relative;
        .bg_circle {
          border-radius: 50%;
          backdrop-filter: blur(10px); /* 整个层模糊 */
          opacity: 0.3;
          z-index: 1;
        }
        .top_circle {
          background-color: #f3e1b8;
          width: 100px;
          height: 100px;
          box-shadow: 0 0 50px 50px rgba(243, 225, 184, 1);
        }
        .bottom_circle {
          background-color: #9ba7e9;
          width: 150px;
          height: 150px;
          box-shadow: 0 0 50px 50px #9ba7e9;
        }
        .login_text {
          font-size: 48px;
        }
        .Register {
          color: rgb(68, 97, 242);
          font-weight: 500;
          -webkit-user-select: none; /* Safari */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* IE 10+ */
          user-select: none; /* Standard syntax */
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
        margin-left: 30px;
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
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE 10+ */
            user-select: none; /* Standard syntax */
            cursor: pointer;
          }
          .submit {
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
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE 10+ */
            user-select: none; /* Standard syntax */
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
