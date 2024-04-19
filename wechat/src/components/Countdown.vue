<template>
  <!-- 循环计时器 -->
  <div>
    <slot v-bind:num="temp"></slot>
  </div>
</template>
<script>
export default {
  emits: ["complete"],
  props: {
    /**
     * 时长 s
     */
    len: { type: Number, default: 60 },
    /**
     * 是否循环
     */
    loop: { type: Boolean, default: true },
  },
  data() {
    return {
      temp: 0,
      timer: null,
    };
  },
  watch: {
    max(n) {
      this.temp = this.len;
    },
  },
  mounted() {
    this.temp = this.len;
    this.init();
  },
  methods: {
    reset() {
      this.temp = this.len;
    },
    init() {
      this.timer = setInterval(() => {
        this.temp--;
        if (this.temp == 0) {
          this.$emit("complete");
          if (this.loop) {
            this.reset();
          } else {
            clearInterval(this.timer);
          }
        }
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.timer);
    console.log("销毁计时器timer:", this.timer);
  },
};
</script>
