<template>
  <div class="box">
    <uni-data-picker
      :localdata="list"
      :map="{
        text: labelKey,
        value: valueKey,
      }"
      :popup-title="title"
      @change="onChange"
      @nodeclick="onNodeClick"
      v-model="domValue"
    >
      <template v-slot:default="{ data, error }">
        <view v-if="error" class="error">
          <text>{{ error }}</text>
        </view>
        <view v-else-if="selectText" class="selected">
          {{ selectText }}
        </view>
        <view v-else>
          <text>请选择</text>
        </view>
      </template>
    </uni-data-picker>
  </div>
</template>
<script>
import uniDataPicker from "uni-data-picker/components/uni-data-picker/uni-data-picker";
export default {
  emit: ["change"],
  components: { uniDataPicker },
  props: {
    value: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "请选择",
    },
    labelKey: { type: String, default: "name" },
    valueKey: { type: String, default: "UUID" },
    text: { type: String, default: "" },
    list: { type: Array, default: [] },
  },
  data() {
    return {
      selectText: "",
      selectValue: "",
      domValue: "",
      node: {},
    };
  },
  watch: {
    selectValue(n) {
      this.$emit("input", n);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.text) {
        if (this.value) {
          if (this.list.length > 0) {
            this.domValue = this.value;
            const item = this.list
              .filter((item) => item[this.valueKey] == this.value)
              .pop();
            if (item) {
              this.selectText = item[this.labelKey];
            }
          }
        } else {
          if (this.list.length > 0) {
            this.onNodeClick(this.list[0]);
          }
        }
      } else {
        this.selectText = this.text;
        this.domValue = this.value;
      }
    },
    getText() {
      return this.selectText;
    },
    onNodeClick(node) {
      // console.log("点击", { node });
      this.selectText = node[this.labelKey];
      this.selectValue = node[this.valueKey];
      this.domValue = node[this.valueKey];
    },
    onChange(e) {
      this.$emit("change", e.detail.value.pop());
      // console.log("-----------变化-----------", { e });
    },
  },
};
</script>
<style lang="scss" scope>
.box {
  min-height: 30rpx;
}
</style>
