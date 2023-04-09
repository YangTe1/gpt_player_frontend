<script lang="ts">
import { LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'

const token = ''
const client = newClient(token)
// const appList = await client.appList()
export default defineComponent({
  components: {
    LikeOutlined,
    MessageOutlined
  },
  setup() {
    const router = useRouter()
    const currentDate = new Date()
    const items = [
      {
        id: 'i1',
        name: 'n1',
        description: 'd1',
        example: 'e1'
      },
      {
        id: 'i2',
        name: 'n2',
        description: 'd2',
        example: 'e2'
      },
      {
        id: 'i3',
        name: 'n3',
        description: 'd3',
        example: 'e3'
      },
      {
        id: 'i4',
        name: 'n4',
        description: 'd4',
        example: 'e4'
      }
    ]

    const onClick = (itemId: string) => {
      router.push({
        path: `/app/${itemId}`
      })
      return
    }

    return {
      onClick,
      currentDate,
      items
    }
  }
})
</script>

<template>
  <a-row>
    <a-col :span="6" v-for="(item, index) in items" :key="item" :offset="index > 0 ? 1 : 1">
      <a-card hoverable style="width: 300px" @click="onClick(item.id)">
        <template #cover>
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        </template>
        <template #actions>
          <like-outlined key="like" />
          <message-outlined />
          <!-- <ellipsis-outlined key="ellipsis" /> -->
        </template>
        <h1>{{ item.name }}</h1>
        <h1>{{ item.description }}</h1>
        <!-- <a-card-meta title="item.name" description="This is the description">
                    <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                    </template>
                </a-card-meta> -->
      </a-card>
    </a-col>
  </a-row>
</template>
