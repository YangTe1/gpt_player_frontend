<script setup lang="ts">
import { useRouter } from 'vue-router'
localStorage.removeItem('token')
const router = useRouter()
router.replace({
  path: '/'
})
</script>
