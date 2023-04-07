import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import AppView from '../views/AppView.vue'
import AboutView from '../views/AboutView.vue'
import UserRegisterView from '../views/UserRegister.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
      // component: () => import('../views/AboutView.vue')
    },
    {
      path: '/app/:appId',
      name: 'appDetail',
      component: AppView
    },
    {
      path: '/user/register',
      name: 'register',
      component: UserRegisterView
    },
    {
      path: '/user/login',
      name: 'login',
      component: AppView
    }
  ]
})

export default router
