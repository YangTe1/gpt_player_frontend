<script lang="ts">
import { LikeOutlined, MessageOutlined, MehTwoTone } from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
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
    const searchValue = ref<string>('')
    const totalAmount = ref<number>(0)
    let items = ref([])

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

    const pageIndex = reactive({
      value: 1,
      onChange: (newValue) => {
        pageIndex.value = newValue
      }
    })
    const pageSize = ref(12)

    const loadData = async () => {
      console.log(`pageIndex: ${pageIndex.value}`)
      console.log(`pageSize: ${pageSize.value}`)
      try {
        const token = ''
        const client = newClient(token)
        const appListData = await client.appList(
          pageIndex.value - 1,
          pageSize.value,
          searchValue.value
        )
        // console.log(appList.data)
        items.value = appListData.data.data || []
        totalAmount.value = appListData.data.total
      } catch (err) {
        console.log(err)
        if (err?.msg) {
          message.error(`服务器异常，请稍后刷新重试: ${err.msg}`)
        } else {
          message.error(`服务器异常，请稍后刷新重试`)
        }
        return
      }
    }

    const handleSearch = async function () {
      console.log('search:', searchValue.value)
      pageIndex.value = 1
      try {
        const token = ''
        const client = newClient(token)
        const appListData = await client.appList(
          pageIndex.value - 1,
          pageSize.value,
          searchValue.value
        )
        console.log(appListData.data)
        items.value = appListData.data.data || []
        totalAmount.value = appListData.data.total
      } catch (err) {
        console.log(err)
        if (err?.msg) {
          message.error(`服务器异常，请稍后刷新重试: ${err.msg}`)
        } else {
          message.error(`服务器异常，请稍后刷新重试`)
        }
        return
      }
    }

    onMounted(loadData)

    const pagination = computed(() => ({
      current: pageIndex.value,
      pageSize: pageSize.value
    }))

    return {
      onClick,
      items,
      cardHeight,
      searchValue,
      handleSearch,

      totalAmount,
      pageIndex,
      pageSize,
      loadData,
      pagination
    }
  }
})
</script>

<template>
  <div style="background-color: #ececea; padding-top: 50px; padding-bottom: 50px">
    <div class="search-wrapper">
      <a-input
        v-model:value="searchValue"
        placeholder="搜索"
        style="width: 20%"
        @keydown.enter="handleSearch"
      />
    </div>
    <div class="card-wrapper">
      <a-row>
        <a-col
          :span="4"
          v-for="(item, index) in items"
          :key="item"
          :offset="index % 4 == 0 ? 3 : 1"
        >
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
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pageIndex.value"
        :pageSize="pageSize"
        :total="totalAmount"
        @change="loadData"
        :showSizeChanger="false"
      />
    </div>
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

.ant-pagination {
  float: right;
  padding-right: 50px;
}

.wrapper {
  background-color: #ececea;
}

.search-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 50px;
}

.cards-wrapper {
  padding-left: 50px;
  padding-right: 50px;
}

.pagination-wrapper {
  margin-top: 30px;
  margin-bottom: 50px;
}
</style>
