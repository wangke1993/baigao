<template>
  <div>
    <div @click="call">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    phone: { type: String },
  },
  methods: {
    call() {
      uni.makePhoneCall({
        phoneNumber: this.phone,
      });
    },
  },
};
</script>
