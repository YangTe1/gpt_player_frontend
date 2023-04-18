<template>
  <div>
    <a-button type="primary" @click="loginWithAlipay">使用支付宝登录</a-button>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import Qrcode from 'qrcode'

export default defineComponent({
  name: 'AlipayLogin',
  setup() {
    // 获取 canvas 元素的引用
    const canvasRef = ref<HTMLCanvasElement | null>(null)

    onMounted(() => {
      // 组件挂载后，获取真实的canvas元素并更新ref的值
      canvasRef.value = document.querySelector('canvas')
    })

    const loginWithAlipay = () => {
      const appId = '2021003189677158'
      const redirectUri = encodeURIComponent('http://test.gpt:5173?a=b')

      const url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appId}&redirect_uri=${redirectUri}&scope=auth_user`
      const canvasEl = canvasRef.value // 通过value属性获取真实的canvas元素
      // https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021003189677158&scope=auth_user&redirect_uri=http%3A%2F%2Ftest.gpt%3A5173%3Fa%3Db&state=init
      console.log(canvasEl)
      if (canvasEl) {
        Qrcode.toCanvas(canvasEl, url, {
          errorCorrectionLevel: 'H',
          width: 256
        }).then(() => {
          console.log('erweima')
          message.success('请打开支付宝扫描二维码登录')
        })
      }

      const checkAuthStatus = setInterval(() => {
        axios
          .get('/api/checkAuth')
          .then((res) => {
            if (res.data.success) {
              clearInterval(checkAuthStatus)
              message.success('授权成功')
            } else if (res.data.message === 'expired') {
              clearInterval(checkAuthStatus)
              message.error('授权失败：二维码已过期，请刷新页面重试')
            }
          })
          .catch(() => {
            clearInterval(checkAuthStatus)
            message.error('授权失败，请刷新页面重试')
          })
      }, 3000)
    }

    return {
      canvasRef,
      loginWithAlipay
    }
  }
})
</script>
