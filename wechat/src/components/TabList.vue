<template>
  <z-paging-swiper :safe-area-inset-bottom="true">
    <template #top>
      <slot name="top"></slot>
    </template>
    <div class="tab-box">
      <u-sticky zIndex="9999" bgColor="#FFF">
        <u-tabs
          lineWidth="25rpx"
          lineColor="#0D5AD3"
          :activeStyle="{
            color: '#1D2541',
            fontWeight: '700',
            transform: 'scale(1.05)',
          }"
          :inactiveStyle="{ color: '#9598A4', transform: 'scale(1)' }"
          itemStyle="width:20%; height: 68rpx;"
          :list="tabList"
          keyName="name"
          :current="current"
          @click="handleTabsClick"
        ></u-tabs>
      </u-sticky>
    </div>
    <swiper
      class="swiper"
      :style="{ 'background-color': listBoxBgColor }"
      :current="current"
      @animationfinish="swiperAnimationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in tabList"
        :key="index"
        @query="queryList"
      >
        <z-paging-swiper-item
          ref="swiperItem"
          :tabIndex="index"
          :currentIndex="current"
          @query="queryList"
          @updateList="updateList"
        >
          <div class="list-box">
            <slot
              name="list"
              v-bind:list="dataList[current]"
              v-bind:expend="expend"
            ></slot>
          </div>
          <view slot="loadingMoreNoMore">
            <div class="no-more">没有更多了~</div>
          </view>
        </z-paging-swiper-item>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>
<script>
export default {
  props: {
    tabList: { type: Array },
    listBoxBgColor: { type: String, default: "#f0f2f5" },
    expend: { type: Object },
  },
  emit: ["queryList"],
  data() {
    return {
      page: {
        pageIndex: 1,
        keyWord: "",
      },
      dataList: [],
      current: 0,
      target: { id: "" },
    };
  },
  watch: {
    current(v) {},
  },
  mounted() {
    if (this.tabList.length > 0) {
      this.target.id = this.tabList[0].id;
    }
  },
  methods: {
    reload(loading = false) {
      this.$refs.swiperItem[this.current].reload(loading);
    },
    swiperAnimationfinish(e) {
      console.log("切换tab结束", e);

      this.current = e.detail.current;
      this.target = this.tabList[this.current];
      // 再次刷新
      // this.$refs.swiperItem[this.current].reload(true);
    },
    handleTabsClick(target) {
      console.log("点击了tab", target);
      this.current = target.index;
      this.target = this.tabList[this.current];
    },
    queryList(pageNo, pageSize) {
      this.$emit("queryList", { pageNo, pageSize, target: this.target });
      console.log("查询分页列表");
    },
    queryRes(data) {
      this.$refs.swiperItem[this.current].complete(data);
    },
    updateList(data) {
      console.log("刷新列表", { data, current: this.current });
      this.$set(this.dataList, this.current, data);
    },
  },
};
</script>

<style lang="scss" scoped>
.swiper {
  height: 100%;
  background-color: #f0f2f5;
  box-sizing: border-box;
}
.tab-box {
  padding: 20rpx 0;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0px 3px #ccc;
  z-index: 99999;
  position: relative;
}
.no-more {
  text-align: center;
  color: #a4a4a4;
  font-size: 24rpx;
  padding-bottom: 320rpx;
}
.list-box {
  padding-bottom: 68rpx;
}
</style>
