<template>
  <div class="center-button">
    <a-spin size="large" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { domain } from '../utils/consts'
import { newClient, LoginResp } from '../utils/httpClient'
import { message } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const router = useRouter()
    const searchParams = new URLSearchParams(window.location.search)
    const auth_code = searchParams.get('auth_code')
    const client = newClient('')
    client
      .fakeLogin(auth_code)
      .then((resp) => {
        if (resp?.token) {
          localStorage.setItem('token', resp.token)
          router.push({
            path: '/'
          })
          return
        } else {
          message.error('登录失败')
          router.push({
            path: '/login'
          })
          return
        }
      })
      .catch((err) => {
        console.log(err)
        if (err?.msg) {
          message.error(`登录失败: ${err.msg}`)
        } else {
          message.error(`登录失败，请检查信息`)
        }
        router.push({
          path: '/login'
        })
        return
      })
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
