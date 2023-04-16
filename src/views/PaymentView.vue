<template>
  <div class="text-center" style="min-height: 200px; margin-bottom: 100px">
    <p class="text-sm">当前剩余次数：</p>
    <p class="text-hg">充值</p>
    <p class="text-md">每天首次登录获得3次免费次数，超出使用次数请购买次数</p>
  </div>
  <div class="text-center">
    <a-radio-group v-model:value="value">
      <a-radio :style="radioStyle" :value="1">
        <span class="text-lg">￥1</span><span class="text-md">3次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="10">
        <span class="text-lg">￥10</span><span class="text-md">40次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="30">
        <span class="text-lg">￥30</span><span class="text-md">150次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="50">
        <span class="text-lg">￥50</span><span class="text-md">300次</span>
      </a-radio>
      <a-button type="primary" @click="onSubmit(value)" style="margin-top: 30px">充值</a-button>
    </a-radio-group>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

export default defineComponent({
  setup() {
    const value = ref < Number > 1
    const radioStyle = reactive({
      display: 'flex',
      height: '30px',
      lineHeight: '30px'
    })

    const onSubmit = async (payment) => {
      console.log(payment)
      const token = localStorage.getItem('token')
      const router = useRouter()
      if (!token) {
        router.push({ path: '/login' })
      }
      const client = newClient(token)

      try {
        app = await client.pre_order(payment)
      } catch (err) {
        console.log(err)
        if (err?.msg) {
          message.error(`充值失败，请重试: ${err.msg}`)
          return
        }
        message.error('充值失败，请重试')
        return
      }
      // TODO: 展示二维码
      return
    }

    return {
      value,
      radioStyle,
      onSubmit
    }
  }
})
</script>
