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
      <!-- <p class="text-lg" v-else>{{ responseMsg }}</p> -->
      <MarkdownIt :source="responseMsg" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newClient, IAppDetail, IChat } from '../utils/httpClient'
import { message } from 'ant-design-vue'
import MarkdownIt from 'vue3-markdown-it'

export default defineComponent({
  components: {
    MarkdownIt
  },
  setup() {
    const router = useRouter()
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
    const client = newClient(token as string)
    // let resp: IAppDetail
    client
      .appDetail(appId as string)
      .then((resp) => {
        appData.example = resp.example
        appData.name = resp.name
        appData.description = resp.description
        appData.id = resp.id
        example.value = resp.example
      })
      .catch((err) => {
        console.log(err)
        if (err?.status == 401) {
          localStorage.removeItem('token')
          message.error('登录过期，请重新登录')
          router.push({ path: '/login' })
          return
        }
        if (err?.msg) {
          message.error('应用不存在, 请刷新页面')
        }
        message.error('应用不存在, 请刷新页面')
        router.push({ path: '/' })
        return
      })
    // console.log(`data: ${JSON.stringify(resp)}`)
    console.log(`data: ${JSON.stringify(appData)}`)
    // onMounted(async () => {
    //     const client = newClient(token as string)
    //     let resp: IAppDetail
    //     try {
    //         resp = await client.appDetail(appId as string)
    //     } catch (err) {
    //         console.log(err)
    //         if (err?.msg) {
    //             message.error("应用不存在, 请刷新页面")
    //         }
    //         message.error("应用不存在, 请刷新页面")
    //         router.push({ path: '/' })
    //         return
    //     }
    //     // console.log(`data: ${JSON.stringify(resp)}`)
    //     appData.example = resp.example
    //     appData.name = resp.name
    //     appData.description = resp.description
    //     appData.id = resp.id
    //     example.value = resp.example
    //     console.log(`data: ${JSON.stringify(appData)}`)
    // })

    const onSubmit = async () => {
      isLoading.value = true
      console.log('运行了')
      const client = newClient(token as string)
      let data: IChat
      try {
        data = await client.chat(appData.id, example.value)
        console.log('data: ', data)
        isLoading.value = false
        responseMsg.value = data.message
        // responseMsg.value =
        //   '很抱歉，我不能完成这个任务。因为这句话并没有委婉的表达方式。可以尝试以下的重写方式：\n\n- 很抱歉，我目前无法承担这项任务。\n- 我不确定我是否有能力完成这个任务。\n- 我需要更多的时间来考虑这个问题。\n- 我希望你能理解我现在的处境，我暂时无法应对这项任务。\n- 我需要更多的信息和资源来完成这个任务。'
      } catch (err) {
        if (err?.msg) {
          message.error(`发送失败，请稍后重试${err.msg}`)
        } else {
          message.error('发送失败，请稍后重试')
        }
      }
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
