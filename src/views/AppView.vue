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
    <center>
      <h1>这是回复</h1>
    </center>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

const router = useRouter()

export default defineComponent({
  //   mounted() {
  //     console.log(this.$route.params.appId); // 打印当前路由信息
  //   },
  setup() {
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) {
      router.push({ path: '/' })
    }
    console.log('1111111111111111111')
    const appData = ref<any>({})
    const route = useRoute()
    const appId = route.params.appId
    console.log(appId)
    // onBeforeMount(async () => {
    //     const client = newClient(token as string)
    //     appData = await client.appDetail(appId as string)
    // })
    console.log(`data: ${appData}`)

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
