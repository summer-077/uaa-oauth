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
            <el-form :model="form" label-width="0" style="margin-top: 20px">
              <!-- 错误信息 -->
              <el-form-item>
                <el-alert
                  v-show="authStore.loginErrMsg"
                  class="fixed top-0"
                  :title="authStore.loginErrMsg"
                  type="error"
                  :closable="false"
                />
              </el-form-item>

              <el-form-item>
                <el-input
                  v-model="form.username"
                  :placeholder="placeholder.username"
                  clearable
                  :suffix-icon="User"
                />
              </el-form-item>
              <el-form-item v-if="type !== 1">
                <el-input
                  :class="isDisabled ? 'input-append-disabled' : 'input-append'"
                  v-model="form.code"
                  placeholder="请输入验证码"
                  clearable
                >
                  <!-- 验证码按钮 -->
                  <template #append
                    ><el-button
                      :disabled="isDisabled"
                      type="primary"
                      @click="useVerificationCode"
                      >{{ text }}</el-button
                    ></template
                  >
                </el-input>
                <div style="height: 42px; width: 100%"></div>
              </el-form-item>
              <el-form-item v-if="type == 1">
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
            <div
              v-for="(method, index) in loginMethods"
              :key="index"
              @click="checkLoginType(method.type)"
              class="item"
            >
              <img :src="getImagePath(method.icon)" :alt="method.alt" />
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
import AUTH_AXIOS from '@/services/auth.service'
// import OAUTH_AXIOS from '@/services/oauth.service'
import { useAuthStore } from '@/store'
const placeholder = reactive({
  username: '请输入账号',
  password: '请输入密码',
})
const loginMethods = ref([
  { type: 1, icon: 'wechat', alt: 'WeChat Login' },
  { type: 2, icon: 'email', alt: 'Email Login' },
  { type: 3, icon: 'phone', alt: 'Phone Login' },
])

const getImagePath = (iconName) => {
  return new URL(`../../assets/svg/${iconName}.png`, import.meta.url).href
}
const type = ref(1)
let timer = null
const text = ref('获取验证码')

const placeholderMap = {
  1: { username: '请输入用户名', password: '请输入密码' },
  2: { username: '请输入邮箱', password: '请输入验证码' },
  3: { username: '请输入手机号码', password: '请输入验证码' },
}

const checkLoginType = (t) => {
  type.value = t
  const placeholders = placeholderMap[t] || { username: '', password: '' }
  placeholder.username = placeholders.username
  placeholder.password = placeholders.password
}
const isDisabled = ref(false)
const authStore = useAuthStore()
const form = reactive({
  username: '',
  password: '',
  code: '',
})
const { username, password, code } = toRefs(form)

//发送验证码流程
const useVerificationCode = async () => {
  if (!timer) {
    await authStore.sendMfa(type.value === 2 ? '1' : '0', username.value)
    if (!authStore.loginErrMsg) {
      let countdown = 60
      isDisabled.value = true
      timer = setInterval(() => {
        if (countdown < 1) {
          text.value = '获取验证码'
          clearInterval(timer)
          timer = null
          isDisabled.value = false
        } else {
          countdown--
          text.value = countdown + 's后重试'
        }
      }, 1000)
    }
  }
}

const submit = async () => {
  //用户名密码登录流程
  // authStore.login(username.value, password.value, type.value)
  if (type.value === 1) {
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
  } else {
    const res = await authStore.verifyMfa(code.value)

    window.location.href = res
  }
}
</script>

<style scoped lang="less">
::v-deep .el-input__wrapper {
  background-color: #eaf0f7;
  box-shadow: 0 0 0 0;
  height: 40px;
  border-radius: var(--button-border-radius);
}
::v-deep .el-card {
  border-radius: var(--card-border-radius);
}
::v-deep .el-button {
  font-weight: 900;
  background-color: var(--theme-button-color);
  border-radius: 10px;
  height: 40px;
}
//覆盖input-append样式
// ::v-deep .el-input-group__append {
//   color: red;
// }
::v-deep .el-input-group__append {
  color: #fff;
  border-radius: var(--button-border-radius);
  margin-left: 10px;
}
.input-append-disabled ::v-deep .el-input-group__append {
  background-color: var(--theme-button-forbid-color);
}
::v-deep .input-append .el-input-group__append {
  background-color: var(--theme-button-color);
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
