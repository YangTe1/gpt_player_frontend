<template>
  <div class="parent-container">
    <div class="child-container">
      <p class="text-lg">创建你的应用</p>
      <p class="text-md">应用名称</p>
      <a-input v-model:value="name" placeholder="" />
      <p class="text-md">应用描述</p>
      <a-textarea v-model:value="desc" showCount :maxlength="100" />
      <p class="text-md">指令</p>
      <a-textarea v-model:value="prompt" showCount :maxlength="2500" />
      <p class="text-md">示例输入</p>
      <a-textarea v-model:value="example" placeholder="Basic usage" :rows="4" />
      <a-button type="primary" @click="onCancel" style="float: right; margin: 5px; margin-top: 10px"
        >取消</a-button
      >
      <!-- <a-button type="primary" @click="onTest">测试</a-button> -->
      <a-button type="primary" @click="onSubmit" style="float: right; margin: 5px; margin-top: 10px"
        >创建</a-button
      >
      <div style="float: right; margin-top: 30px">
        <a-tooltip>
          <template #title>开发中</template>
          <a-radio :checked="false" :disabled="true">高级模式</a-radio>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newClient, AppDetailResp } from '../utils/httpClient'
import { message } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const router = useRouter()
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({ path: '/login' })
    }
    const name = ref<string>('应用名称')
    const prompt = ref<string>(
      '现在你是一个训练师，向你的机器人预设指令。例如：你现在是一个普通的打工人，拒绝老板pua，把下面的理由用委婉的角度重写一下'
    )
    const example = ref<string>('这事我不做')
    const desc = ref<string>('打工人小助手，拒绝pua')
    const client = newClient(token as string)

    const onSubmit = async () => {
      let app: AppDetailResp
      try {
        app = await client.appCreate(name.value, desc.value, prompt.value, example.value)
      } catch (err) {
        if (err?.status == 401) {
          localStorage.removeItem('token')
          message.error('登录过期，请重新登录')
          router.push({ path: '/login' })
          return
        }
        console.log(err)
        if (err?.msg) {
          message.error(`创建失败: ${err.msg}`)
          return
        }
        message.error('创建失败，请稍后重试')
        return
      }
      console.log(app)
      router.push({ path: `/app/${app.data.id}` })
      return
    }

    const onCancel = async () => {
      router.push({ path: '/' })
      return
    }
    return {
      name,
      prompt,
      example,
      desc,
      onSubmit,
      onCancel
    }
  }
})
</script>
<style>
.parent-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.child-container {
  width: 40%;
  height: 70%;
}

.text-md {
  padding-top: 15px;
  margin: 10px;
}
</style>
