<template>
  <div class="box">
    <u-form
      v-if="show"
      :model="form"
      ref="uForm"
      label-position="top"
      :label-style="{ fontSize: '32rpx', fontWeight: 'bold', color: '#1D2541' }"
      label-width="100%"
    >
      <u-form-item
        :key="index"
        v-for="(item, index) in conf"
        :label="item.label"
        :prop="item.field"
        borderBottom="true"
        v-if="
          item.dom !== 'dateStr' || (item.dom === 'dateStr' && form[item.field])
        "
      >
        <Dateformat
          :date="form[item.field]"
          :format="item.type ? item.type : 'yyyy年MM月dd日 hh点mm分'"
          v-if="item.dom === 'dateStr' && form[item.field]"
        ></Dateformat>
        <u-input
          v-if="item.dom === 'input'"
          v-model="form[item.field]"
          :border="false"
          :disabled="disabled"
        />
        <u-input
          v-if="item.dom === 'textarea'"
          v-model="form[item.field]"
          type="textarea"
          :border="false"
          :disabled="disabled"
        />
        <u-input
          v-if="item.dom === 'money'"
          v-model="form[item.field]"
          @input="limitNum(form[item.field], item.field)"
          :border="false"
          :disabled="disabled"
        />
        <u-input
          v-if="item.dom === 'num'"
          v-model="form[item.field]"
          @input="isNum(form[item.field], item.field)"
          :border="false"
          :disabled="disabled"
        />
        <uni-datetime-picker
          v-if="item.dom === 'date'"
          v-model="form[item.field]"
          :disabled="disabled"
          :hideSecond="item.hideSecond"
          :type="item.type ? item.type : 'datetime'"
        />
        <SimpleTime
          v-if="item.dom === 'time'"
          :disabled="disabled"
          v-model="form[item.field]"
          :minType="item.type ? item.type : 'all'"
        ></SimpleTime>

        <!-- <div @click="selectTime(item.field)">
          <u-input
            v-if="item.dom === 'time'"
            disabled="true"
            v-model="form[item.field]"
            :border="false"
          />
        </div>
        <u-datetime-picker
          v-if="item.dom === 'time'"
          :show="timeShow[item.field]"
          @cancel="closeAppointmentTime(item.field)"
          @confirm="closeAppointmentTime(item.field)"
          :title="item.label"
          mode="time"
          v-model="form[item.field]"
        /> -->
      </u-form-item>
    </u-form>
    <div class="button" @click="submit">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import uniDatetimePicker from "uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker";
import SimpleTime from "./SimpleTime";
import Dateformat from "components/Dateformat";
export default {
  components: {
    uniDatetimePicker,
    SimpleTime,
    Dateformat,
  },
  props: {
    conf: { type: Array },
    data: { type: Object },
    disabled: { type: Boolean, default: false },
  },
  emits: ["submit"],
  data() {
    return {
      empty: {},
      form: {},
      rules: {},
      show: false,
      timeShow: {},
    };
  },
  created() {},
  onReady() {
    this.show = false;
    this.conf.map((item) => {
      // from
      this.$set(this.form, item.field, item.default);
      if (item.select == true) {
        this.$set(this.form, `${item.field}Text`, item.default);
      }
      // rules
      this.$set(this.rules, item.field, item.rule);
    });
    if (this.data) {
      // init
      this.init(this.data);
    }
    console.log({ data: this.data, form: this.form, rules: this.rules });
    this.show = true;
    setTimeout(() => {
      // console.log("设置规则");
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    selectTime(field) {
      this.$set(this.timeShow, field, true);
    },
    closeAppointmentTime(field) {
      this.$set(this.timeShow, field, false);
    },
    isNum(amount, field) {
      amount = amount.replace(/\D/g, ""); //只能输入数字
      // 如果第一位是0，第二位必须大于0或者小数点
      if (amount.substring(0, 1) == 0) {
        if (amount.substring(1, 2) > 0) {
          amount = amount.substring(1, 2);
        } else if (
          amount.substring(1, 2) === 0 ||
          amount.substring(1, 2) === "0"
        ) {
          amount = "0";
        }
      }
      setTimeout(() => {
        this.form[field] = amount;
      });
    },
    limitNum(amount, field) {
      amount = amount
        .replace(/[^\d.]/g, "") //只能输入数字
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3") //只能输入两个小数
        .replace(/\.{2,}/g, "."); //出现多个点时只保留第一个
      // 第一位不让输小数点
      if (amount == ".") {
        amount = "";
      }
      // 如果第一位是0，第二位必须大于0或者小数点
      if (amount.substring(0, 1) == 0) {
        if (amount.substring(1, 2) > 0) {
          amount = amount.substring(1, 2);
        } else if (
          amount.substring(1, 2) === 0 ||
          amount.substring(1, 2) === "0"
        ) {
          amount = "0";
        }
      } else {
        // 如果第一位数字大于0（不等于0肯定就大于0），仅需考虑第二位是小数点的情况
        if (amount.indexOf(".") !== -1) {
          if (amount.substring(0, 1) > 0) {
            // console.log("第一位大于0");
          } else {
            // console.log("第一位等于0");
            if (amount.substring(2, 3) > 0) {
              // console.log("小数点后第一位大于0");
            } else {
              // console.log("小数点后第一位等于0");
              amount = "0.";
            }
          }
        } else {
          // console.log("没有小数点，正常输入");
        }
      }
      setTimeout(() => {
        this.form[field] = amount;
      });
    },
    init(data) {
      this.form = { ...data };
    },
    async submit() {
      this.conf.map((item) => {
        if (item.select == true) {
          // console.log({ item });
          const field = item.field;
          // console.log(this.$refs[`${field}Ref`]);
          this.form[`${field}Text`] = this.$refs[`${field}Ref`].pop().getText();
        }
      });
      // console.log({ form: this.form });
      const res = await this.$refs.uForm.validate();
      if (res == true) {
        this.$emit("submit", this.form);
      } else {
        // console.log("验证失败", { form: this.form });
      }
    },
  },
};
</script>
<style lang="scss" scope>
.box {
  width: 428rpx;
}
</style>
