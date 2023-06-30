import { useTabsStore } from '@/stores/tabs';

/**
 * 约定：
 *  1.后台页面路由最大两级。
 *  2.第一级命名规范：/path，不允许：/path/.../...。
 *  3.第二级命名规范：path2/.../...,不允许以“/”开头。
 */
const layout = () => import('@/views/layout/Index.vue');
const rotes = [
    {
        path: '/system',
        name: 'system',
        component: layout,
        // redirect: '/default',
        meta: {
            title: '系统设置'
        },
        children: [
            {
                path: 'menuManage',
                component: () => import('@/views/menu/Index.vue'),
                name: 'menuManage',
                meta: { title: '菜单管理' }
            },
            {
                path: 'adminUser',
                component: () => import('@/views/adminUser/Index.vue'),
                name: 'adminUser',
                meta: { title: '用户管理' }
            },
            {
                path: 'role',
                component: () => import('@/views/role/Index.vue'),
                name: 'role',
                meta: { title: '角色管理' }
            },
            {
                path: 'log',
                component: () => import('@/views/log/index.vue'),
                name: 'log',
                meta: { title: '系统日志' }
            },
            {
                path: 'dictionary',
                component: () => import('@/views/dictionary/Index.vue'),
                name: 'dictionary',
                meta: { title: '数据字典' }
            },
            {
                path: 'parameter',
                component: () => import('@/views/parameter/Index.vue'),
                name: 'parameter',
                meta: { title: '参数设置' }
            }
        ]
    }]
export default rotes;