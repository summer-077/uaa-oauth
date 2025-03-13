import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import guards from './guards.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/logout',
    //   component: () => import(/* webpackChunkName: "logout" */ '../views/Logout.vue'),
    // },
    // {
    //   path: '/forbidden',
    //   component: () => import(/* webpackChunkName: "forbidden" */ '../views/Forbidden.vue'),
    // },
    {
      path: '/',
      component: HomeView,
      meta: {
        breadcrumb: [{ to: '/', label: '首页' }],
      },
      children: [
        {
          path: '',
          redirect: '/users',
        },
        {
          path: 'users',
          name: 'users',
          component: () => import(/* webpackChunkName: "users" */ '../views/users/Users.vue'),
          meta: {
            breadcrumb: [
              { to: '/', label: '首页' },
              { to: '', label: '用户管理' },
            ],
          },
          // children: [
          //   {
          //     path: ':username',
          //     component: () =>
          //       import(/* webpackChunkName: "user-roles" */ '../views/users/UserRoles.vue'),
          //     meta: {
          //       breadcrumb: [
          //         { to: '/', label: '首页' },
          //         { to: '/users', label: '用户管理' },
          //         { to: '', label: '分配角色' },
          //       ],
          //     },
          //   },
          // ],
        },
        {
          path: 'roles',
          component: () => import(/* webpackChunkName: "roles" */ '../views/roles/Roles.vue'),
          meta: {
            breadcrumb: [
              { to: '/', label: '首页' },
              { to: '', label: '角色管理' },
            ],
          },
          // children: [
          //   {
          //     path: ':roleId',
          //     component: () =>
          //       import(
          //         /* webpackChunkName: "role-permissions" */ '../views/roles/RolePermissions.vue'
          //       ),
          //     meta: {
          //       breadcrumb: [
          //         { to: '/', label: '首页' },
          //         { to: '/users', label: '角色管理' },
          //         { to: '', label: '分配权限' },
          //       ],
          //     },
          //   },
          // ],
        },
        {
          path: 'permissions',
          component: () =>
            import(/* webpackChunkName: "permissions" */ '../views/permissions/Permissions.vue'),
          meta: {
            breadcrumb: [
              { to: '/', label: '首页' },
              { to: '', label: '权限管理' },
            ],
          },
        },
        {
          path: 'clients',
          component: () =>
            import(/* webpackChunkName: "permissions" */ '../views/clients/Clients.vue'),
          meta: {
            breadcrumb: [
              { to: '/', label: '首页' },
              { to: '', label: 'OAuth2 客户端管理' },
            ],
          },
        },
      ],
      meta: {
        requiresAuth: true,
        requiredPermissions: ['ROLE_STAFF'],
        breadcrumb: ['首页'],
      },
    },
    // {
    //   path: 'about',
    //   name: 'About',
    //   // 路由懒加载，提供路由级别的代码分割
    //   // 为这个路由生成一个单独的 chunk (about.[hash].js)
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    //   meta: {
    //     breadcrumb: [
    //       { to: '/', label: '首页' },
    //       { to: '', label: '关于' },
    //     ],
    //   },
    // },
  ],
})

// 全局守卫
router.beforeEach(guards.globalGuard)
export default router
