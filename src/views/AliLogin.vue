<template>
  <div>
    <alipay-login />
  </div>
</template>

<script>
import AlipayLogin from "../components/AlipayLogin.vue";

export default {
  name: "App",
  components: {
    AlipayLogin
  }
};
</script>