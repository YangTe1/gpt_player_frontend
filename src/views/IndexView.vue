<script lang="ts">
import Index from '../components/Index.vue'
import { defineComponent } from 'vue'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    PlusCircleOutlined,
    Index
  },

  setup() {
    const router = useRouter()
    const onClick = () => {
      router.push({
        path: '/app/create'
      })
      return
    }
    return {
      onClick
    }
  }
})
</script>

<template>
  <div class="text-center" style="min-height: 200px; margin-bottom: 100px">
    <p class="text-hg">GPT-IN-LIFE</p>
    <p class="text-lg">使用现有的应用，或者花几秒钟来创建你的应用</p>
    <a-button type="primary" shape="round" @click="onClick">
      <template #icon>
        <PlusCircleOutlined />
      </template>
      添加应用
    </a-button>
  </div>
  <Index />
</template>
