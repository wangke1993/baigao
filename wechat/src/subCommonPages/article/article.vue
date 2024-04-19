<template>
  <view class="page-view">
    <view class="content-box">
      <u-parse :content="content"></u-parse>
    </view>
  </view>
</template>

<script>
import { ArticleManagementControllerGetReleaseDetailByArticleId } from "@/api/ArticleManagementControllerApi.js";
import { BASE_URL } from "@/utils/request.js";
export default {
  data() {
    return {
      content: "",
      id: "",
      title: "",
    };
  },
  onLoad(query) {
    const { id, title } = query;
    this.id = id;
    this.title = title;
    if (id) {
      this.init();
    }

    if (title) {
      console.log("标题1", typeof title);
      this.setTitle();
    }
  },
  methods: {
    async init() {
      uni.showLoading({ title: "加载中" });
      let {
        data: { status, message, data },
      } = await ArticleManagementControllerGetReleaseDetailByArticleId(this.id);
      uni.hideLoading();
      if (status === 1) {
        let content = data.content;
        if (!this.title) {
          this.title = data.articleName;
          console.log("标题", data.articleName);
          this.setTitle();
        }
        this.content = content
          .replaceAll('src="/api', `src="${BASE_URL}`)
          .replaceAll('data-href="/api', `data-href="${BASE_URL}`);
      } else {
        this.alertInfo(message);
      }
    },
    setTitle() {
      uni.setNavigationBarTitle({
        title: this.title,
        success: async () => {
          console.log("修改标题成功");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-view {
  height: 100vh;
  .content-box {
    background: #fff;
    padding: 20rpx 10rpx;
    border-radius: 8rpx;
  }
}
</style>
