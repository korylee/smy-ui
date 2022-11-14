export const props = {
  show: Boolean,
  title: String,
  dynamic: Boolean,
  columns: {
    type: Array,
    default: () => [],
  },
  textKey: {
    type: String,
    default: "text",
  },
  optionHeight: {
    type: [Number, String],
    default: 44,
  },
  optionCount: {
    type: [Number, String],
    default: 6,
  },
  confirmButtonText: {
    type: String,
    default: "确认",
  },
  cancelButtonText: {
    type: String,
    default: "取消",
  },
  confirmButtonTextColor: {
    type: String,
  },
  cancelButtonTextColor: {
    type: String,
  },
  toolbar: {
    type: Boolean,
    default: true,
  },
  textFormatter: {
    type: Function,
    default: (text) => text,
  },
};
