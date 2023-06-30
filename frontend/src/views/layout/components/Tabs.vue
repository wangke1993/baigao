<template>
  <div @wheel="wheel" id="tags-scrollbar" class="tags-view-container">
    <el-scrollbar ref="scrollbarRef" @scroll="scroll">
      <ul class="tags-box" ref="innerRef">
        <li class="tags-item" :class="{ active: route.path === tabsStore.userIndex.url }">
          <router-link :to="{ path: tabsStore.userIndex.url }" class="tabs-link">
            首页
          </router-link>
        </li>
        <li class="tags-item" :class="{ active: route.path === view.path }" v-for="view, k in tabsStore.tabs" :key="k">
          <router-link :to="view" class="tabs-link">
            {{ view.meta.title }}
            <el-icon @click="closeTabs(k.toString())" class="close" v-if="route.path === view.path">
              <Close />
            </el-icon>
          </router-link>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
// 依赖
import { ref, watch } from "vue";
import { ElScrollbar } from "element-plus";
import { useRoute, useRouter, type RouteLocationNormalized } from "vue-router";
import { useTabsStore } from "@/stores/tabs";

// 参数
const tabsStore = useTabsStore();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const innerRef = ref<HTMLDivElement>();
let scrollLeft = ref(0);
const route = useRoute();
const router = useRouter();
// 函数
const wheel = (event: any) => {
  scrollbarRef.value!.setScrollLeft(scrollLeft.value + event.deltaY);
};
const scroll = (s: any) => {
  scrollLeft.value = s.scrollLeft;
};
const closeTabs = (key: string) => {
  tabsStore.remove(Number(key));
  const lastView: RouteLocationNormalized | undefined = tabsStore.tabs.slice(-1)[0];
  if (lastView) {
    setTimeout(() => {
      router.push(lastView);
    })
  } else {
    setTimeout(() => {
      router.push(tabsStore.userIndex.url);
    })
  }
}
watch(() => router.currentRoute.value, (newValue) => {
  if (newValue.path !== tabsStore.userIndex.url && newValue.path !== '/default') {
    tabsStore.add(newValue);
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 36px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  white-space: nowrap;
  overflow-x: auto;

  .tags-box {
    display: flex;
    align-items: center;
    height: 36px;
    font-size: 0.9em;

    .tags-item {
      height: 100%;

      .tabs-link {
        cursor: pointer;
        padding: 0 18px;
        display: flex;
        align-items: center;
        justify-items: center;
        height: 100%;
        color: #222;
      }
    }

    .active {
      background: #47a0fa;

      .tabs-link {
        color: #fff;
      }
    }

    .close {
      margin-left: 8px;
      margin-top: 2px;
      font-size: 16px;
      border-radius: 50%;
      padding: 2px;
    }

    .close:hover {
      // background: #389b6e;
      background: #1b8cfd;
    }
  }
}
</style>