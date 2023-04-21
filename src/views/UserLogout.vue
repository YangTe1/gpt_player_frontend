<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
localStorage.removeItem('token')
const router = useRouter()
router.replace({
  path: '/'
})

message.info('您已退出登录，请刷新页面')
</script>
