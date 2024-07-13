<template>
  <div class="sidebar-container">
    <el-menu class="el-menu-vertical-demo" active-text-color="#47a0fa" background-color="#304156" text-color="#fff"
      :collapse="collapse" :default-openeds="permissionStore.defaultOpeneds" :router="true" :unique-opened="true"
      @open="menuOpen">
      <template v-for="menu in menuTree" :key="menu._id">
        <el-sub-menu :index="menu._id" v-if="menu.children.length > 0 && menu.isShow === '1'">
          <template #title>
            <el-icon>
              <component :is="menu.menuIcon" />
            </el-icon>
            <span>{{ menu.menuName }}</span>
          </template>
          <template v-for="twoMenu in menu.children" :key="twoMenu._id">
            <el-sub-menu :index="twoMenu._id" v-if="twoMenu.children.length > 0 && twoMenu.isShow === '1'">
              <template #title>
                <span>{{ twoMenu.menuName }}</span>
              </template>
              <template v-for="threeMenu in twoMenu.children">
                <el-menu-item v-if="threeMenu.isShow === '1'" :index="threeMenu.menuActive" :key="threeMenu._id">
                  {{ threeMenu.menuName }}
                </el-menu-item>
              </template>
            </el-sub-menu>
            <el-menu-item v-else-if="twoMenu.isShow === '1'" :index="twoMenu.menuActive">
              {{ twoMenu.menuName }}
            </el-menu-item>
          </template>
        </el-sub-menu>
        <el-menu-item v-else-if="menu.isShow === '1'" :index="menu.menuActive">{{ menu.menuName }}</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { usePermissionStore } from "@/stores/permission";
import { ref, watch } from 'vue';

const props = defineProps({
  collapse: {
    type: Boolean,
    required: false,
  },
});
const permissionStore = usePermissionStore();
const menuTree = ref();
menuTree.value = permissionStore.menuTree;
permissionStore.setDefaultOpeneds();
const menuOpen = (index: string, indexPath: string[]) => {
  permissionStore.defaultOpeneds = indexPath;
}
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: none;
}

.hideSidebar {
  .sidebar-container {
    width: 64px !important;
  }
}
</style>