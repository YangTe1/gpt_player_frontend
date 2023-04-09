<template>
  <div>
    <center>
      <h1>{{ appData.name }}</h1>
    </center>
    <center>
      <h1>{{ appData.description }}</h1>
    </center>
    <a-textarea v-model="example" showCount :maxlength="1500" :rows="4" />
    <a-button type="primary" @click="onSubmit">运行</a-button>
  </div>
  <div>
    <center><h1>这是回复</h1></center>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

const router = useRouter()
const token = localStorage.getItem('token')

export default defineComponent({
  //   mounted() {
  //     console.log(this.$route.params.appId); // 打印当前路由信息
  //   },
  async setup() {
    if (!token) {
      router.push({ path: '/' })
    }

    const route = useRoute()
    const appId = route.params.appId
    console.log(appId)

    const client = newClient(token as string)
    const appData = await client.appDetail(appId as string)
    // const appData = {
    //   name: 'nnn',
    //   description: 'dddd',
    //   id: 'iiii',
    //   example: 'eeeee'
    // }
    const example = ref<string>(appData.data.example)

    const onSubmit = async () => {
      // const data = await client.appCreate(name.value ,desc.value, prompt.value, example.value)
      console.log('运行了')
      console.log(example.value)

      return
    }
    return {
      appData,
      example,
      onSubmit
    }
  }
})
</script>
