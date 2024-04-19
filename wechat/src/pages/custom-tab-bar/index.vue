<template>
  <view v-if="isLogin" class="tab-bar">
    <view class="tab-bar-border"></view>
    <view
      v-for="(item, index) in list[userPort]"
      :key="index"
      class="tab-bar-item"
      @click="switchTab(item.pagePath)"
    >
      <image
        class="tab-bar-item-image"
        :src="
          selected === item.pagePath ? item.selectedIconPath : item.iconPath
        "
      ></image>
      <view
        class="tab-bar-item-view"
        :style="{ color: selected === item.pagePath ? selectedColor : color }"
      >
        {{ item.text }}
      </view>
    </view>
  </view>
</template>
<script>
import store from "@/store/index.js";
import { tabBarList } from "@/tabBarList.js";
export default {
  data() {
    return {
      color: "#7983A7",
      selectedColor: "#0D5AD3",
      list: tabBarList,
    };
  },
  computed: {
    selected() {
      return store.state.selected;
    },
    userPort() {
      return store.state.userPort;
    },
  },
  methods: {
    switchTab(url) {
      uni.switchTab({ url });
      store.commit("setSelected", url);
    },
  },
};
</script>
<style scoped>
.tab-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: white;
  display: flex;
  flex-direction: row;
  padding-bottom: env(safe-area-inset-bottom);
  pointer-events: auto;
}

.tab-bar-border {
  background-color: rgba(0, 0, 0, 0.33);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item-image {
  width: 24px;
  height: 25.33px;
  margin-bottom: 2px;
}

.tab-bar-item-view {
  font-size: 10px;
}
</style>
