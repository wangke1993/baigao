/* eslint-disable prettier/prettier */
/**
 * 内容管理
 * 约定：
 *  1.后台页面路由最大两级。
 *  2.第一级命名规范：/path，不允许：/path/.../...。
 *  3.第二级命名规范：path2/.../...,不允许以“/”开头。
 */
const layout = () => import('@/views/layout/Index.vue');
const rotes = [
    {
        path: '/content',
        name: 'content',
        component: layout,
        meta: {
            title: '内容管理'
        },
        children: [
            {
                path: 'article',
                component: () => import('@/views/article/Index.vue'),
                name: 'article',
                meta: { title: '文章管理' }
            },
            {
                path: 'advertisement',
                component: () => import('@/views/advertisement/Index.vue'),
                name: 'advertisement',
                meta: { title: '广告管理' }
            },
            {
                path: 'collectionAccountManagement',
                component: () => import('@/views/collectionAccountManagement/Index.vue'),
                name: 'collectionAccountManagement',
                meta: { title: '账号管理' }
            },
            {
                path: 'treeClassManagement',
                component: () => import('@/views/treeClassManagement/Index.vue'),
                name: 'treeClassManagement',
                meta: { title: '树形分类管理' }
            },
        ]
    }]
export default rotes;