<template>
  <div>
    <uni-popup type="dialog" ref="popup" background-color="#fff">
      <uni-popup-dialog
        mode="input"
        :duration="2000"
        :title="title"
        :before-close="true"
        @close="close"
        @confirm="confirm"
      >
        <AutoForm
          v-if="value"
          ref="autoFormRef"
          :disabled="disabled"
          :conf="conf"
          :data="data"
          @submit="submit"
        ></AutoForm>
      </uni-popup-dialog>
    </uni-popup>
  </div>
</template>
<script>
import AutoForm from "components/AutoForm";
/**
 * 确定回调
 * 取消回调
 */
export default {
  components: { AutoForm },
  props: {
    value: { type: Boolean, default: false },
    title: { type: String, default: "表单弹窗" },
    conf: { type: Array, default: [] },
    data: { type: Object, default: {} },
    disabled: { type: Boolean, default: false },
  },
  emits: ["confirm"],
  data() {
    return {};
  },
  watch: {
    value(v) {
      if (v === true) {
        this.open();
      } else if (v === false) {
        this.close();
      }
    },
  },
  mounted() {
    if (this.value === true) {
      this.open();
    }
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      if (this.value) {
        this.$emit("input", false);
      }
      this.$refs.popup.close();
    },
    confirm() {
      // console.log("确定");
      this.$refs.autoFormRef.submit();
    },
    submit(form) {
      this.$emit("confirm", form);
    },
  },
};
</script>
