<template>
  <div>
    <a-button type="primary" @click="loginWithAlipay">使用支付宝登录</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { message } from "ant-design-vue"
import axios from "axios"
import Qrcode from "qrcode"

export default defineComponent({
  name: "AlipayLogin",
  data() {
    return {
      appId: "your_app_id_here",
      redirectUri: "https://www.example.com/callback"
    };
  },
  methods: {
    loginWithAlipay() {
      const url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${this.appId}&redirect_uri=${this.redirectUri}&scope=auth_user`;

      const qrcodeContainer = document.createElement("div");
      document.body.appendChild(qrcodeContainer);

      Qrcode.toCanvas(qrcodeContainer, url, {
        errorCorrectionLevel: "H",
        width: 256
      }).then(() => {
        message.success("请打开支付宝扫描二维码登录");
      });

      const checkAuthStatus = setInterval(() => {
        axios
          .get("/api/checkAuth")
          .then(res => {
            if (res.data.success) {
              clearInterval(checkAuthStatus);
              message.success("授权成功");
            } else if (res.data.message === "expired") {
              clearInterval(checkAuthStatus);
              message.error("授权失败：二维码已过期，请刷新页面重试");
            }
          })
          .catch(() => {
            clearInterval(checkAuthStatus);
            message.error("授权失败，请刷新页面重试");
          });
      }, 3000);
    }
  }
});
</script>