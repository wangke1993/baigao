<template>
  <div>
    <div @click="copyStr">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    str: { type: String },
  },
  methods: {
    copyStr() {
      const data = this.str;
      const that = this;
      uni.setClipboardData({
        data,
        success: function () {
          that.alertInfo("已复制");
        },
        fail: function (e) {
          console.log("复制失败", { e });
        },
      });
    },
  },
};
</script>
