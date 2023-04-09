<template>
  <div>
    <h1>创建你的应用</h1>
  </div>
  <span>应用名称</span>
  <a-input v-model:value="name" placeholder="" />
  <span>应用描述</span>
  <a-textarea v-model:value="desc" showCount :maxlength="100" />
  <span>指令</span>
  <a-textarea v-model:value="prompt" showCount :maxlength="1500" />
  <span>示例输入</span>
  <a-textarea v-model:value="example" placeholder="Basic usage" :rows="4" />

  <a-button type="primary" @click="onCancel">取消</a-button>
  <!-- <a-button type="primary" @click="onTest">测试</a-button> -->
  <a-button type="primary" @click="onSubmit">创建</a-button>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

const router = useRouter()
export default defineComponent({
  setup() {
    const name = ref<string>('应用名称')
    const prompt = ref<string>(
      '现在你是一个训练师，向你的机器人预设指令。例如：你现在是一个普通的打工人，拒绝老板pua，把下面的理由用委婉的角度重写一下'
    )
    const example = ref<string>('这事我不做')
    const desc = ref<string>('打工人小助手，拒绝pua')
    const token = localStorage.getItem('token')
    const client = newClient(token as string)

    const onSubmit = async () => {
      const app = await client.appCreate(name.value, desc.value, prompt.value, example.value)
      console.log(app)
      router.push({ path: `/app/${app.data.id}` })
      return
    }
    return {
      prompt,
      example,
      desc,
      onSubmit
    }
  }
})
</script>
