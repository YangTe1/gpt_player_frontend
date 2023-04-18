<script lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { ref, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
// import Index from './components/IndexView.vue'
// import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  components: {
    UserOutlined
  },
  setup() {
    const token = localStorage.getItem('token')
    let navs = []
    if (token) {
      navs = [
        { key: '1', label: '首页', name: 'index' },
        { key: '2', label: '退出登录', name: 'logout' }
      ]
    } else {
      navs = [
        { key: '1', label: '首页', name: 'index' },
        // { key: '2', label: '注册', name: 'register' },
        { key: '2', label: '登录', name: 'login' }
      ]
    }
    const router = useRouter()
    const selectedKeys1 = ref<string[]>(['1'])
    const jump = (name: string) => {
      router.push({
        name,
        query: {}
      })
    }
    return {
      token,
      jump,
      navs
    }
  }
})
</script>

<template>
  <!-- <a-layout> -->
  <a-layout-header>
    <div className="logo">
      <p class="text-sm">GPT-IN-LIFE</p>
    </div>
    <a-menu
      v-model:selectedKeys="selectedKeys1"
      theme="dark"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
    >
      <a-menu-item v-for="nav in navs" :key="nav.key" @click="jump(nav.name)">
        <span class="text-sm">{{ nav.label }}</span>

        <!-- <RouterLink :to="nav.router">{{ nav.label }}</RouterLink> -->
      </a-menu-item>
      <a-menu-item v-if="token" @click="jump('payment')">
        <UserOutlined />
      </a-menu-item>
    </a-menu>
  </a-layout-header>
  <a-layout-content style="padding-top: 50px; min-height: calc(100% - 64px)">
    <RouterView />
  </a-layout-content>
  <a-divider />
  <a-layout-footer>
    <div class="text-center">
      <p class="text-md">遇到问题或有更好的使用建议欢迎发送邮件</p>
      <span class="text-md">manbugv@163.com</span>
    </div>
  </a-layout-footer>
  <!-- </a-layout> -->
</template>

<style lang="scss">
.ant-layout-header .logo {
  float: left;
  width: 120px;
  height: 31px;
  line-height: 31px;
  color: #fff;
  margin: 16px 24px 16px 0;
  /* background: rgba(255, 255, 255, 0.3); */
  /* background: #c1cbd7; */
}

#components-layout-demo-basic .code-box-demo {
  text-align: center;
}

#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  color: #fff;
  /* background: #7dbcea; */
  background: #c1cbd7;
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-header {
  background: #6aa0c7;
  /* background: #c1cbd7; */
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-footer {
  background: #6aa0c7;
}

#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}

/* #components-layout-demo-basic .ant-layout-sider {
        color: #fff;
        line-height: 120px;
        background: #3ba0e9;
    }

    [data-theme='dark'] #components-layout-demo-basic .ant-layout-sider {
        background: #3499ec;
    } */

#components-layout-demo-basic .ant-layout-content {
  min-height: 120px;
  color: #fff;
  line-height: 120px;
  background: rgba(16, 142, 233, 1);
}

/* [data-theme='dark'] #components-layout-demo-basic .ant-layout-content {
        background: #107bcb;
    } */

#components-layout-demo-basic > .code-box-demo > .ant-layout + .ant-layout {
  margin-top: 48px;
}

.ant-layout-footer {
  background: #f6f6f6;
  min-height: 120px;
}
</style>
