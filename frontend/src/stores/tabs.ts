import { getUserInfoByToken } from '@/utils/authTokenUtil';
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router';
const sessionStorageKey = 'baigao_tabs';
export const useTabsStore = defineStore({
  id: 'tabs',
  state: () => ({
    tabs: new Array<RouteLocationNormalized>(),
    tabNames: new Array<any>(),
    userIndex: { name: '', url: '' }
  }),
  actions: {
    remove(index: number) {
      const nameIndex = this.tabNames.indexOf(this.tabs[index].name);
      this.tabs.splice(index, 1);
      if (this.tabNames.length > 1) {
        this.tabNames.splice(nameIndex, 1);
      }
    },
    add(view: RouteLocationNormalized) {
      if (this.tabs.some(v => v.path === view.path)) return;
      if (['/login', '/404'].includes(view.path)) return;
      this.tabs.push(view);
      this.tabNames.push(view.name);
    },
    Init() {
      const userInfo = getUserInfoByToken();
      console.log(userInfo.indexPath);
      if (userInfo.indexPath === '/' || !userInfo.indexPath) {
        this.userIndex = { name: 'default', url: '/default' };
      } else {
        const pathArr = userInfo.indexPath.split('/');
        this.userIndex = { name: pathArr[pathArr.length - 1], url: userInfo.indexPath };
      }
      this.tabNames.unshift(this.userIndex.name);
    },
    clean() {
      this.tabs = [];
      this.tabNames = [];
      this.userIndex = { name: '', url: '' };
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
