<script lang="ts">
    import { LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
    import { defineComponent } from 'vue'
    import { newClient } from '../utils/httpClient'

    const token = ""
    const client = newClient(token)
    export default defineComponent({
        components: {
            LikeOutlined,
            MessageOutlined
        },
        data () {
            return {
                currentDate: new Date(),
                items: [
                    {
                        name: 'n1',
                        description: 'd1',
                        example: 'e1'
                    },
                    {
                        name: 'n2',
                        description: 'd2',
                        example: 'e2'
                    },
                    {
                        name: 'n3',
                        description: 'd3',
                        example: 'e3'
                    },
                    {
                        name: 'n4',
                        description: 'd4',
                        example: 'e4'
                    }
                ]
            }
        }
    })
</script>

<template>
    <a-row :gutter="16">
        <a-col :span="6" v-for="(item, index) in items" :key="item" :offset="index > 0 ? 1 : 1">
            <a-card hoverable style="width: 300px">
                <template #cover>
                    <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
                </template>
                <template #actions>
                    <like-outlined key="like" />
                    <message-outlined />
                    <!-- <ellipsis-outlined key="ellipsis" /> -->
                </template>
                <h1>{{item.name}}</h1>
                <h1>{{item.description}}</h1>
                <!-- <a-card-meta title="item.name" description="This is the description">
                    <template #avatar>
                        <a-avatar src="https://joeschmoe.io/api/v1/random" />
                    </template>
                </a-card-meta> -->
            </a-card>
        </a-col>
    </a-row>
</template>