<template>
  <!-- <div>{{ relDate }}</div> -->
  <uni-dateformat :date="relDate(date).toISOString()" :format="format"></uni-dateformat>
</template>
<script>
export default {
  props: {
    format: { type: String, default: "yyyy年MM月dd日 hh点mm分" },
    date: { type: String },
  },
  data() {
    return {};
  },
};
</script>
