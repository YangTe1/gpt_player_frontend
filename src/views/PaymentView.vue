<template>
  <div class="text-center" style="min-height: 200px; margin-bottom: 100px">
    <p class="text-sm">当前剩余次数：{{ leftTime }}</p>
    <p class="text-hg">充值(限时优惠)</p>
    <p class="text-md">每天首次登录获得3次免费次数，超出使用次数请购买次数</p>
    <p class="text-sm">使用须知：</p>
    <p class="text-sm">
      老板们理性消费，如遇到不可抗因素（如被openai限流封号等原因）导致网站永久关停等可以向下方邮箱发送邮件申请退款
    </p>
    <p class="text-sm">一切应用创建需遵守法律法规，如有违规行为管理员有权删除应用对账号封停</p>
  </div>
  <div class="text-center">
    <a-radio-group v-model:value="value">
      <a-radio :style="radioStyle" :value="1">
        <span class="text-lg">￥1</span><span class="text-md">3次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="10">
        <span class="text-lg">￥10</span><span class="text-md">50次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="30">
        <span class="text-lg">￥30</span><span class="text-md">180次</span>
      </a-radio>
      <a-radio :style="radioStyle" :value="50">
        <span class="text-lg">￥50</span><span class="text-md">400次</span>
      </a-radio>
      <a-button type="primary" @click="onSubmit(value)" style="margin-top: 30px">充值</a-button>
      <a-modal v-model:visible="visible" title="请用支付宝扫码" @ok="handleOk">
        <img :src="qrCode" alt="支付宝二维码" />
      </a-modal>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'
import { QrCodeResp } from '../utils/httpSchema'
import { message } from 'ant-design-vue'
import qrcode from 'qrcode'

export default defineComponent({
  setup() {
    const value = ref<number>(1)
    const leftTime = ref<string>('0')
    const radioStyle = reactive({
      display: 'flex',
      height: '30px',
      lineHeight: '30px'
    })
    const router = useRouter()

    const requestLeft = async () => {
      const token = localStorage.getItem('token')
      const client = newClient(token)
      let a: any
      try {
        a = await client.left()
      } catch (err) {
        console.log(err)

        if (err?.status == 401) {
          localStorage.removeItem('token')
          message.error('登录过期，请重新登录')
          router.push({ path: '/login' })
          return
        }
        if (err?.msg) {
          a = `信息获取异常: ${err.msg}`
        } else {
          a = '信息获取异常'
        }
      }
      console.log(a)
      leftTime.value = a
    }

    const onSubmit = async (payment) => {
      console.log(payment)
      const token = localStorage.getItem('token')
      if (!token) {
        router.push({ path: '/login' })
      }
      const client = newClient(token)
      let preOrder: QrCodeResp

      try {
        preOrder = await client.pre_order(payment)
      } catch (err) {
        console.log(err)

        if (err?.status == 401) {
          localStorage.removeItem('token')
          message.error('登录过期，请重新登录')
          router.push({ path: '/login' })
          return
        }
        if (err?.msg) {
          message.error(`充值失败，请重试: ${err.msg}`)
          return
        }
        message.error('充值失败，请重试')
        return
      }
      console.log(preOrder)
      visible.value = true
      // TODO: 展示二维码
      const dataUrl = await qrcode.toDataURL(preOrder.qr_code)
      qrCode.value = dataUrl
      return
    }

    const visible = ref<boolean>(false)
    const qrCode = ref<string>('')
    const qrCodeUrl = ref<string>('')

    const handleOk = (e) => {
      const router = useRouter()
      console.log(e)
      visible.value = false
      router.go(0)
    }

    const token = localStorage.getItem('token')
    if (!token) {
      leftTime.value = '-'
    } else {
      console.log('left time: ')
      requestLeft()
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    return {
      value,
      radioStyle,
      onSubmit,
      visible,
      handleOk,
      qrCode,
      leftTime
    }
  }
})
</script>
