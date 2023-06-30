import { AdminMenuControllerGetTree, AdminMenuControllerGetTreeByMenuType } from '@/api/AdminMenuControllerApi';
import { alertWarning } from '@/utils/message';
import { defineStore } from 'pinia';
import routers from '@/router/extend/index'
import { deleteToken } from '@/utils/authTokenUtil';
import router from '@/router';
const sessionStorageKey = 'baigao_permission';
interface AutoObject {
    [propname: string]: any,
}
const menuDeepObject: AutoObject = {};
export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        permissionData: new Array<any>(),
        menuTree: new Array<any>(),
        buttonList: new Array<string>(),
        oneLevelRoute: new Array<string>(),
        twoLevelRoute: new Array<string>(),
        menuDeep: menuDeepObject,
        menuList: new Array<AutoObject>(),
        defaultOpeneds: new Array<string>(),
    }),
    actions: {
        async getRouters() {
            const permissionDataTemp = this.permissionData;
            if (permissionDataTemp.length > 0) {
                const getRouteConf = async (menuArr: any[]) => menuArr.forEach((m: any) => {
                    if (m?.menuType === 1) {
                        if (m?.menuActive) {
                            const temp = m?.menuActive.substring(1, m?.menuActive.length);
                            const tempIndex = temp.indexOf('/');
                            this.oneLevelRoute.push(`/${temp.substring(0, tempIndex)}`);
                            this.twoLevelRoute.push(temp.substring(tempIndex + 1, temp.length));
                        }
                        if (m?.children.length > 0) {
                            getRouteConf(m?.children)
                        }
                    }
                    if (m?.menuType === 2) {
                        this.buttonList.push(m?.menuPowerTag);
                    }
                });
                getRouteConf(permissionDataTemp);
            }
        },
        async getMenuTree() {
            let res;
            try {
                const { data } = await AdminMenuControllerGetTree();
                res = data;
            } catch (error) {
                const { response: { status } } = error as any;
                if (status === 401) {
                    deleteToken();
                    this.clean();
                    router.replace('/login');
                }
            }
            if (res.status === 1) {
                this.permissionData = res.data;
            } else {
                alertWarning(res.message);
            }
            const { data: res2 } = await AdminMenuControllerGetTreeByMenuType('1');
            const setMenuDeep = async () => {
                const tempMenuTree = this.menuTree;
                let menuDeep: any = {};
                let menuList: any[] = [];
                const setChildren = (children: any, parentName: string[]) => {
                    children.forEach((m: any) => {
                        if (m?.children.length > 0) {
                            setChildren(m?.children, [...parentName, m.menuName]);
                        } else {
                            menuDeep[m?.menuActive] = [...parentName, m.menuName];
                            menuList.push({ ...m, 'value': menuDeep[m?.menuActive].join('/') });
                        }
                    });
                }
                if (tempMenuTree) {
                    tempMenuTree.forEach((m: any) => {
                        if (m?.children.length > 0) {
                            setChildren(m?.children, [m.menuName]);
                        } else {
                            menuDeep[m?.menuActive] = [m.menuName];
                            menuList.push({ ...m, 'value': menuDeep[m?.menuActive].join('/') });
                        }
                    });
                }
                this.menuDeep = menuDeep;
                this.menuList = menuList;
            }
            if (res.status === 1) {
                this.menuTree = res2.data;
                await setMenuDeep();
            } else {
                alertWarning(res.message);
            }
        },
        setDefaultOpeneds() {
            if (this.defaultOpeneds.length < 1) {
                this.defaultOpeneds.push(this.menuTree[0]._id);
            }
        },
        clean() {
            this.menuTree = [];
            this.buttonList = [];
            this.oneLevelRoute = [];
            this.twoLevelRoute = [];
            this.menuDeep = {};
            this.menuList = [];
            this.permissionData = []
            sessionStorage.removeItem(sessionStorageKey);
        }
    },
    persist: {
        enabled: true, // 开启数据缓存
        strategies: [
            {
                key: sessionStorageKey,
                storage: sessionStorage // 默认是sessionStorage
            }
        ],
    }
})
