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
  <div>
    <h1>This is an index page</h1>
    <center>
      <a-button type="primary" shape="circle" @click="onClick">
        <template #icon>
          <PlusCircleOutlined />
        </template>
      </a-button>
      <h3>创建应用</h3>
    </center>
  </div>
  <Index />
</template>
