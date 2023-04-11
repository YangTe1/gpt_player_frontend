<template>
  <div>
    <center>
      <h1>{{ appData.name }}</h1>
    </center>
    <center>
      <h1>{{ appData.description }}</h1>
    </center>
    <a-textarea v-model:value="example" showCount :maxlength="1500" :rows="4" />
    <p>
      <a-button type="primary" @click="onSubmit" style="float: right; margin: 10px">运行</a-button>
    </p>
  </div>
  <div>
    <h1>{{ responseMsg }}</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

const router = useRouter()

export default defineComponent({
  setup() {
    const example = ref<string>('')
    const responseMsg = ref<string>('')
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) {
      router.push({ path: '/' })
    }
    const appData = reactive({
      id: '',
      name: '',
      description: '',
      example: ''
    })
    const route = useRoute()
    const appId = route.params.appId
    console.log(appId)
    onMounted(async () => {
      const client = newClient(token as string)
      const resp = await client.appDetail(appId as string)
      // console.log(`data: ${JSON.stringify(resp)}`)
      appData.example = resp.example
      appData.name = resp.name
      appData.description = resp.description
      appData.id = resp.id
      example.value = resp.example
      console.log(`data: ${JSON.stringify(appData)}`)
    })

    const onSubmit = async () => {
      console.log('运行了')
      const client = newClient(token as string)
      const data = await client.chat(appData.id, example.value)
      console.log('data: ', data)
      responseMsg.value = data.message
      return
    }
    return {
      example,
      responseMsg,
      appData,
      onSubmit
    }
  }
})
</script>
