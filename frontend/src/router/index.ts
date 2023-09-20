import { createRouter, createWebHistory } from 'vue-router';
import layout from '@/views/layout/Index.vue';
// import index from '@/router/extend/index'

/**
 * 约定：
 *  1.后台页面路由最大两级。
 *  2.第一级命名规范：/path，不允许：/path/.../...。
 *  3.第二级命名规范：path2/.../...,不允许以“/”开头。
 */
const defaultRoutes = [
  {
    path: '/',
    name: 'home',
    component: layout,
    redirect: '/default',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'default',
        component: () => import('@/views/Default.vue'),
        name: 'default',
        meta: { title: '默认首页' }
      }
    ]
  },
  {
    path: '/documentView',
    name: 'documentView',
    meta: {
      title: '查看文档'
    },
    component: () => import('@/views/DocumentView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/login/Login.vue'),
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404'
    },
    component: () => import('@/views/404.vue'),
  },
  {
    path: '/dev',
    component: layout,
    name: 'dev',
    meta: { title: '开发工具' },
    children: [
      {
        path: 'autoCode',
        component: () => import('@/views/dev/AutoCode.vue'),
        name: 'autoCode',
        meta: { title: '开发工具' }
      },
    ]
  }
  // ...index
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: defaultRoutes
})
export default router
