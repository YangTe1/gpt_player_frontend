<template>
  <div class="parent-container">
    <div class="child-container">
      <div class="text-center">
        <p class="text-lg">{{ appData.name }}</p>
        <p class="text-md">{{ appData.description }}</p>

        <a-textarea v-model:value="example" showCount :maxlength="1500" :rows="4" />
        <a-button
          type="primary"
          @click="onSubmit"
          style="float: right; margin: 5px; margin-top: 30px"
          >运行</a-button
        >
      </div>
    </div>
  </div>
  <div class="parent-container">
    <div class="box2">
      <a-spin v-if="isLoading" tip="正在输入...">
        <a-alert message="正在输入"></a-alert>
      </a-spin>
      <p class="text-lg" v-else>{{ responseMsg }}</p>
    </div>
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
    const isLoading = ref<boolean>(false)
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
      isLoading.value = true
      console.log('运行了')
      const client = newClient(token as string)
      const data = await client.chat(appData.id, example.value)
      console.log('data: ', data)
      isLoading.value = false
      responseMsg.value = data.message
      return
    }
    return {
      isLoading,
      example,
      responseMsg,
      appData,
      onSubmit
    }
  }
})
</script>
<style>
.parent-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  margin-bottom: 20px;
}

.child-container {
  width: 30%;
  height: 50%;
}

.text-md {
  padding: 25px;
  margin: 10px;
}

.box2 {
  width: 30%;
  margin-top: 100px;
  text-align: center;
}
</style>
