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
import { newClient } from '../utils/httpClient'

interface FormState {
  username: string
  password: string
}
const client = newClient('')
export default defineComponent({
  setup() {
    const formState = reactive<FormState>({
      username: '',
      password: ''
    })
    const onFinish = async (values: any) => {
      console.log('Success:', values)
      const data = await client.login(values.username, values.password)
      console.log(data)
      if (data?.token) {
        localStorage.setItem('token', data.token)
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
