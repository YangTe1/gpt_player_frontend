<script setup lang="ts"></script>

<template>
  <div>
    <h1>用户登录</h1>
  </div>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">登录</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { newClient, LoginResp } from '../utils/httpClient'
import { message } from 'ant-design-vue'

interface FormState {
  username: string
  password: string
}
const client = newClient('')
export default defineComponent({
  setup() {
    const router = useRouter()
    const formState = reactive<FormState>({
      username: '',
      password: ''
    })
    const onFinish = async (values: any) => {
      console.log('Success:', values)
      let data: LoginResp
      try {
        data = await client.login(values.username, values.password)
        console.log(data)
        if (data?.token) {
          localStorage.setItem('token', data.token)
          router.push({
            path: '/'
          })
          return
        }
      } catch (err) {
        console.log(err)
        if (err?.msg) {
          message.error(`登录失败: ${err.msg}`)
        } else {
          message.error(`登录失败，请检查信息`)
        }
        return
      }
    }

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo)
      // TODO: 错误提示
    }
    return {
      formState,
      onFinish,
      onFinishFailed
    }
  }
})
</script>
