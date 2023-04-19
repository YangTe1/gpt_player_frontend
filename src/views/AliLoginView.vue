<template>
  <div class="center-button">
    <a-button type="primary" @click="redirectToAli">使用支付宝登录</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { domain } from '../utils/consts'

export default defineComponent({
  setup() {
    const appId = '2021003189677158'
    const redirectUrl = `${domain}/fake_login`
    const redirectToAli = () => {
      window.location.href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appId}&scope=auth_user&redirect_uri=${encodeURIComponent(
        redirectUrl
      )}&state=init`
    }
    return {
      redirectToAli
    }
  }
})
</script>
<style>
.center-button {
  display: flex;
  /* 使用 flex 布局 */
  justify-content: center;
  /* 使子元素在水平方向上居中 */
  align-items: center;
  /* 使子元素在垂直方向上居中 */
  height: 100vh;
  /* 设置高度以使容器占据整个视口 */
}
</style>
