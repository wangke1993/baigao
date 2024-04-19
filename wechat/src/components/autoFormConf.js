/**
 * 预定义表单结构
 * 表单项
 *  input：普通输入框
 *  textarea: 文本域
 *  money：金额输入
 *  num：数字输入框
 *  date：时间选择器
 */
export default {
  referee: [
    {
      dom: "input",
      field: "name",
      label: "姓名",
      default: "",
      rule: [
        {
          required: true,
          message: "请输入介绍人姓名",
          trigger: ["change", "blur"],
        },
      ],
    },
    {
      dom: "input",
      field: "phone",
      default: "",
      label: "手机号",
      rule: [
        {
          required: true,
          message: "请输入介绍人联系电话",
          trigger: ["change", "blur"],
        },
        {
          validator: (rule, value, callback) => {
            return this.$u.test.mobile(value);
          },
          message: "请输入正确的手机号",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  // 请输入服务单价
  serviceUnitPrice: [
    {
      dom: "money",
      field: "serviceUnitPrice",
      default: 0,
      label: "服务单价",
      rule: [
        {
          required: true,
          message: "请输入服务单价",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  // 服务订单服务开始时间
  orderStartTime: [
    {
      dom: "date",
      field: "serviceStartDate",
      default: "",
      label: "开始日期",
      type: "date",
      rule: [
        {
          required: true,
          message: "请选择服务开始日期",
          trigger: ["change", "blur"],
        },
      ],
    },
    {
      dom: "time",
      field: "serviceStartTime",
      default: "",
      label: "开始时间",
      type: "all",
      rule: [
        {
          required: true,
          message: "请选择服务开始时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  // 服务订单服务开始时间
  orderMonthStartTime: [
    {
      dom: "date",
      field: "serviceStartDate",
      default: "",
      label: "服务开始时间",
      hideSecond: true,
      type: "date",
      rule: [
        {
          required: true,
          message: "请输入服务开始时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  resumePauseTime: [
    {
      dom: "dateStr",
      field: "startTime",
      label: "开始时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    {
      dom: "dateStr",
      field: "openingTime",
      label: "期初时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    {
      dom: "dateStr",
      field: "pauseTime",
      label: "暂停时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    {
      dom: "date",
      field: "date",
      default: new Date(),
      label: "日期",
      type: "date",
      rule: [
        {
          required: true,
          message: "选择日期",
          trigger: ["change", "blur"],
        },
      ],
    },
    {
      dom: "time",
      field: "time",
      hideSecond: true,
      label: "时间",
      type: "all",
      rule: [
        {
          required: true,
          message: "选择时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  resumePauseTimeMount: [
    {
      dom: "dateStr",
      field: "startTime",
      label: "开始时间",
      type: "yyyy年MM月dd日",
    },
    {
      dom: "dateStr",
      field: "openingTime",
      label: "期初时间",
      type: "yyyy年MM月dd日",
    },
    {
      dom: "dateStr",
      field: "pauseTime",
      label: "暂停时间",
      type: "yyyy年MM月dd日",
    },
    {
      dom: "date",
      field: "date",
      default: new Date(),
      hideSecond: true,
      label: "",
      type: "date",
      rule: [
        {
          required: true,
          message: "选择时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  onTime: [
    {
      dom: "time",
      field: "onTime",
      hideSecond: true,
      label: "",
      type: "all",
      rule: [
        {
          required: true,
          message: "选择时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  endOfHourlyOrder: [
    {
      dom: "dateStr",
      field: "startTime",
      label: "开始时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    {
      dom: "dateStr",
      field: "openingTime",
      label: "期初时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    {
      dom: "dateStr",
      field: "pauseTime",
      label: "暂停时间",
      type: "yyyy年MM月dd日 hh点mm分",
    },
    
    {
      dom: "date",
      field: "date",
      default: new Date(),
      hideSecond: true,
      label: "结束日期",
      type: "date",
      rule: [
        {
          required: true,
          message: "选择日期",
          trigger: ["change", "blur"],
        },
      ],
    },
    {
      dom: "time",
      field: "time",
      label: "结束时间",
      type: "all",
      rule: [
        {
          required: true,
          message: "选择时间",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  serviceRecipientInformation: [
    {
      dom: "textarea",
      field: "serviceRecipientInformation",
      label: "",
      default: "",
      rule: [
        {
          required: true,
          message: "请输入服务对象",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
  monthlyRestDays: [
    {
      dom: "num",
      field: "monthlyRestDays",
      label: "",
      default: "",
      rule: [
        {
          required: true,
          message: "请输月休天数",
          trigger: ["change", "blur"],
        },
      ],
    },
  ],
};
