<template>
  <div class="parent-container">
    <div class="child-container">
      <div class="text-center">
        <p class="text-lg">{{ appData.name }}</p>
        <p class="text-md">{{ appData.description }}</p>

        <a-textarea v-model:value="example" showCount :maxlength="1500" :rows="4" />
        <div style="float: right; margin-top: 30px">
          <a-tooltip>
            <template #title>开发中</template>
            <a-radio :checked="false" :disabled="true">携带历史消息</a-radio>
          </a-tooltip>
        </div>
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
import { newClient } from '../utils/httpClient'
import { IAppDetail, IChat } from '../utils/httpSchema'
import { message } from 'ant-design-vue'
import MarkdownIt from 'vue3-markdown-it'
import { backendDomain } from '../utils/consts'
import { v4 } from 'uuid'

export default defineComponent({
  components: {
    MarkdownIt
  },
  beforeRouteUpdate(to, from, next) {
    // 强制刷新组件
    this.$forceUpdate()
    next()
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
    const sid = v4()
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

    const onSubmit = async () => {
      isLoading.value = true
      console.log('运行了')
      let data: any
      try {
        let response: any
        if (appData.id == '1' || appData.id == '11') {
          response = await fetch(`${backendDomain}/api/v1/chat/task/stream`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sid: sid,
              app_id: appData.id,
              query: example.value
            })
          })
        } else {
          response = await fetch(`${backendDomain}/api/v1/chat/stream`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              app_id: appData.id,
              query: example.value
            })
          })
        }
        const reader = response.body.getReader()

        let content = ''
        isLoading.value = false
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            break
          }

          content += new TextDecoder().decode(value)
          //   console.log(content)

          // 动态更新组件中展示的文本
          responseMsg.value = content
        }

        console.log('data: ', content)
        const client = newClient(token as string)
        try {
          await client.chatLogSave(sid, appData.id, appData.name, content)
          console.log('save history')
        } catch (err) {
          console.log('save history error')
          console.log(err)
        }
        // isLoading.value = false
        // responseMsg.value = data.message
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
  width: 60%;
  margin-top: 100px;
  text-align: center;
}
</style>
