<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import Index from './components/IndexView.vue'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <a-layout>
    <a-layout-header>Header</a-layout-header>
    <a-layout-content>
      <div>
        <h1>Content</h1>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
      <RouterView />
    </a-layout-content>
    <a-layout-footer>Footer</a-layout-footer>
  </a-layout>
</template>

<style>
#components-layout-demo-basic .code-box-demo {
  text-align: center;
}

#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  color: #fff;
  background: #7dbcea;
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-header {
  background: #6aa0c7;
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-footer {
  background: #6aa0c7;
}

#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}

#components-layout-demo-basic .ant-layout-sider {
  color: #fff;
  line-height: 120px;
  background: #3ba0e9;
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-sider {
  background: #3499ec;
}

#components-layout-demo-basic .ant-layout-content {
  min-height: 120px;
  color: #fff;
  line-height: 120px;
  background: rgba(16, 142, 233, 1);
}

[data-theme='dark'] #components-layout-demo-basic .ant-layout-content {
  background: #107bcb;
}

#components-layout-demo-basic > .code-box-demo > .ant-layout + .ant-layout {
  margin-top: 48px;
}
</style>
