<template>
  <div :class="{ hideSidebar: collapse }">
    <LeftMenu :collapse="collapse" />
    <div class="main-container">
      <NavBar @openOffMenu="openOffMenu" :collapse="collapse" />
      <Tabs />
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <keep-alive :max="20" :include="tabsStore.tabNames">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 依赖
import { onMounted, ref } from "vue";
import LeftMenu from "@/views/layout/components/LeftMenu.vue";
import NavBar from "@/views/layout/components/NavBar.vue";
import Tabs from "@/views/layout/components/Tabs.vue";
import { useTabsStore } from "@/stores/tabs";
// 参数
const collapse = ref(false);
const tabsStore = useTabsStore();
// 函数
const openOffMenu = () => {
  collapse.value = !collapse.value;
};
</script>

<style lang="scss" scoped>
.sidebar-container {
  transition: width 0.28s;
  width: 210px !important;
  background-color: #304156;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  overflow-y: auto;
}

.main-container {
  margin-left: 210px;
  height: 100%;
}

.app-main {
  height: calc(100vh - 87px);
  overflow: hidden;
  overflow-y: auto;
}

.hideSidebar {
  .main-container {
    margin-left: 64px;
  }
}
</style>
