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
        path: '/commodity',
        name: 'commodity',
        component: layout,
        meta: {
            title: '业务管理'
        },
        children: [
            {
                path: 'member',
                component: () => import('@/views/member/Index.vue'),
                name: 'member',
                meta: { title: '会员管理' }
            },
        ]
    }]
export default rotes;