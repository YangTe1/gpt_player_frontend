<script lang="ts">
import { LikeOutlined, MessageOutlined, MehTwoTone } from '@ant-design/icons-vue'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { newClient } from '../utils/httpClient'
import { message } from 'ant-design-vue'

export default defineComponent({
  components: {
    LikeOutlined,
    MessageOutlined,
    MehTwoTone
  },
  setup() {
    const router = useRouter()
    const token = ''
    const client = newClient(token)
    let items = reactive([])
    client
      .appList(0, 20, '')
      .then((appList) => {
        for (const app of appList.data) {
          items.push(app)
        }
        console.log(items)
      })
      .catch((err) => {
        console.log(err)
        if (err?.msg) {
          message.error(`服务器异常，请稍后刷新重试: ${err.msg}`)
        } else {
          message.error(`服务器异常，请稍后刷新重试`)
        }
        return
      })

    const onClick = (itemId: string) => {
      router.push({
        path: `/app/${itemId}`
      })
      return
    }
    function calcCardHeight() {
      const screenWidth = window.innerWidth
      console.log('screenWidth')
      console.log(screenWidth)
      if (screenWidth >= 1200) {
        return 360
      } else if (screenWidth >= 768) {
        return 280
      } else {
        return 200
      }
    }
    const cardHeight = calcCardHeight()

    return {
      onClick,
      items,
      cardHeight
    }
  }
})
</script>

<template>
  <div style="background-color: #ececea; padding-top: 50px">
    <a-row>
      <a-col :span="4" v-for="(item, index) in items" :key="item" :offset="index % 4 == 0 ? 3 : 1">
        <div class="text-center" style="margin-bottom: 20px; background-color: #f6f6f6">
          <a-card
            hoverable
            :style="{ width: '100%', height: cardHeight + 'px', background: '#f6f6f6' }"
            @click="onClick(item.id)"
          >
            <template #cover>
              <meh-two-tone
                :style="{ fontSize: '50px', marginTop: '50px', marginBottom: '30px' }"
              />
            </template>

            <p class="text-lg">{{ item.name }}</p>
            <p class="text-sm">{{ item.description }}</p>
            <template class="icon-bottom" #actions>
              <like-outlined key="like" />
              <message-outlined key="run" />
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style>
.ant-card-actions {
  background: #f6f6f6;
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px;
}
</style>
