<template>
  <div>
    <picker
      @change="bindPickerChange"
      mode="multiSelector"
      :value="index"
      :range="array"
      v-if="!disabled"
    >
      <view style="font-size: 1.2em">{{ value }}</view>
    </picker>
    <view v-else style="font-size: 1.2em; color: #888">{{ value }}</view>
  </div>
</template>
<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: `${new Date().getHours().toString().padStart(2, "0")}:${
        new Date().getMinutes() >= 30 ? 30 : "00"
      }`,
    },
    /**
     * all:分钟可选00和30
     * zero:仅0分可选
     * half:仅可选30分
     */
    minType: {
      type: String,
      default: "all",
    },
  },
  watch: {
    value(n) {
      let [hours, min] = n.split(":");
      if (this.minType == "zero") {
        min = 0;
      }
      if (this.minType == "half") {
        min = 30;
      }
      this.index = [Number(hours), Number(min) >= 30 ? 1 : 0];
    },
  },
  mounted() {
    if (this.minType == "zero") {
      this.$set(this.array, 1, ["00"]);
    }
    if (this.minType == "half") {
      this.$set(this.array, 1, [30]);
    }
    if (this.minType == "all") {
      this.$set(this.array, 1, ["00", 30]);
    }
    if (!this.value) {
      const now = new Date();
      if (this.minType == "zero") {
        now.setMinutes(0);
      }
      if (this.minType == "half") {
        now.setMinutes(30);
      }
      if (this.minType == "all") {
        now.setMinutes(now.getMinutes() >= 30 ? 30 : 0);
      }
      const nowStr = `${now.getHours().toString().padStart(2, "0")}:${
        now.getMinutes() >= 30 ? 30 : "00"
      }`;
      this.$emit("input", nowStr);
    } else {
      let [hours, min] = this.value.split(":");
      if (this.minType == "zero") {
        min = 0;
      }
      if (this.minType == "half") {
        min = 30;
      }
      if (this.minType == "all") {
        min = min >= 30 ? 30 : 0;
      }
      this.index = [Number(hours), Number(min) >= 30 ? 1 : 0];
      const nowStr = `${hours.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`;
      this.$emit("input", nowStr);
    }
  },
  data() {
    return {
      index: [0, 0],
      array: [
        [
          "00",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
        ],
        ["00", 30],
      ],
    };
  },
  methods: {
    bindPickerChange(e) {
      // 绑定值变化
      const [h, m] = e.detail.value;
      this.$emit("input", `${this.array[0][h]}:${this.array[1][m]}`);
    },
  },
};
</script>
