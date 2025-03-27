import { useAuthStore } from '@/store'
import UTIL from '@/core/util'
import OAUTH_API from '@/services/oauth.service'
export default {
  globalGuard: (to, from, next) => {
    // 我们在路由的配置中使用一个元数据 meta.requiresAuth 来标识是否需要认证
    const authStore = useAuthStore()
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // 如果路由需要认证，则检查是否已经登录，如果没有，导航到登录页面
      if (!authStore.isLogin) {
        const codePattern = /code=([\w-.]+)/
        const codeMatched = codePattern.exec(window.location.href)
        const statePattern = /state=([\w-.]+)/
        const stateMatched = statePattern.exec(window.location.href)

        if (codeMatched && codeMatched.length > 1 && statePattern && stateMatched.length > 1) {
          authStore
            .login({
              code: codeMatched[1],
              oauthState: stateMatched[1],
            })
            .then(() => {
              window.location.href = '/'
              next()
            })
            .catch((err) => {
              console.error(err)
              next(err)
            })
        } else {
          // 没有 code 就导航到授权服务器开始授权码流程
          OAUTH_API.getUrl()
          next(new Error('尚未登录'))
        }
      } else if (
        // 这里的约定是
        // 首先检查路由定义的元数据中是否包含 requiredPermissions
        // 如果不包含则放行
        // 如果包含，则检查是否用户的权限名称可以匹配到该路由所需的权限名称
        // 是则放行
        // 否则导航到无权查看页面
        to.matched.some(
          (record) =>
            record.meta.requiredPermissions &&
            !UTIL.hasPermissionIn(record.meta.requiredPermissions),
        )
      ) {
        next({
          path: '/forbidden',
        })
      } else {
        next()
      }
    } else {
      next() // 确保在其他情况下调用 next()!
    }
  },
}
