/* eslint-disable prettier/prettier */
/**
 * 
 * 约定：
 *  1.后台页面路由最大两级。
 *  2.第一级命名规范：/path，不允许：/path/.../...。
 *  3.第二级命名规范：path2/.../...,不允许以“/”开头。
 */
const layout = () => import('@/views/layout/Index.vue');
const rotes = [
    {
        path: '/business',
        name: 'business',
        component: layout,
        meta: {
            title: '业务管理'
        },
        children: [
            {
                path: 'member',
                component: () => import('@/views/memberManagement/Index.vue'),
                name: 'member',
                meta: { title: '会员管理' }
            },
            {
                path: 'memberAddress',
                component: () => import('@/views/memberAddress/Index.vue'),
                name: 'memberAddress',
                meta: { title: '收货地址管理' }
            },
            
            {
                path: 'walletManagement',
                component: () => import('@/views/walletManagement/Index.vue'),
                name: 'walletManagement',
                meta: { title: '钱包管理' }
            },
            {
                path: 'walletLog',
                component: () => import('@/views/walletLog/Index.vue'),
                name: 'walletLog',
                meta: { title: '钱包流水' }
            },
            {
                path: 'withdrawalManagement',
                component: () => import('@/views/withdrawalManagement/Index.vue'),
                name: 'withdrawalManagement',
                meta: { title: '提现管理' }
            },
        ]
    }]
export default rotes;