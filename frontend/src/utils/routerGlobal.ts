import router from '@/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import type { RouteLocationNormalized, RouteLocationRaw, RouteRecordRaw } from 'vue-router';
import { tokenIsOk } from './authTokenUtil';
import { usePermissionStore } from '@/stores/permission';
import routers from '@/router/extend/index';
import { useTabsStore } from '@/stores/tabs';
NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/404'];
const routerStatic = routers;
let load = false;
let permissionRouters: RouteRecordRaw[] = [];

router.beforeEach(async (to: RouteLocationNormalized, from, next) => {
    NProgress.start();
    document.title = `${to.meta.title}`;
    if (tokenIsOk()) {
        const tabsStore = useTabsStore();
        if (tabsStore.userIndex.url === '') {
            tabsStore.Init();
        }
        if (to.path === tabsStore.userIndex.url) {
            document.title = '首页';
        }
        if (to.path === '/login') {
            next({ path: tabsStore.userIndex.url })
            NProgress.done()
        } else {
            if (!load) {
                const permissionStore = usePermissionStore();
                if (permissionStore.menuTree.length < 1) {
                    await permissionStore.getMenuTree();
                }
                if (permissionStore.oneLevelRoute.length < 1) {
                    await permissionStore.getRouters();
                }
                permissionRouters = [];
                routerStatic.forEach((r: any) => {
                    if (permissionStore.oneLevelRoute.includes(r?.path) || r.path === '/') {
                        let tempR: RouteRecordRaw = { ...r };
                        if (r.children.length > 0) {
                            let tempC: RouteRecordRaw[] = [];
                            r.children.forEach((c: RouteRecordRaw) => {
                                if (permissionStore.twoLevelRoute.includes(c.path)) {
                                    tempC.push({ ...c });
                                }
                            })
                            tempR.children = tempC;
                        }
                        permissionRouters.push(tempR);
                    }
                });
                const routeNotFount: RouteRecordRaw = { path: '/:catchAll(.*)', redirect: '/404', name: 'notFount' };
                permissionRouters.push(routeNotFount);
                permissionRouters.forEach(r => router.addRoute(r));
                load = true;
                next({ ...to, replace: true });
            } else {
                next();
            }
        }
    } else {
        load = false;
        permissionRouters.forEach(r => {
            const routeName = r.name;
            if (routeName) {
                router.removeRoute(routeName);
            }
        });
        const permissionStore = usePermissionStore();
        permissionStore.clean();
        const tabsStore = useTabsStore();
        tabsStore.clean();
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})
router.afterEach(() => {
    NProgress.done()
})
