import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import AppView from '../views/AppView2.vue'
import AppCreateView from '../views/AppCreateView.vue'
import UserLogoutView from '../views/UserLogout.vue'
import PaymentView from '../views/PaymentView.vue'
import OrderHistoryView from '../views/OrderHistoryView.vue'
import AliLoginView from '../views/AliLoginView.vue'
import FakeLoginView from '../views/FakeLoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: AboutView
    //   // component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/app/:appId',
      name: 'appDetail',
      component: AppView
    },
    {
      path: '/app/create',
      name: 'appCreate',
      component: AppCreateView
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: UserRegisterView
    // },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: UserLoginView
    // },
    {
      path: '/logout',
      name: 'logout',
      component: UserLogoutView
    },
    {
      path: '/order',
      name: 'orderList',
      component: OrderHistoryView
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentView
    },
    {
      path: '/login',
      name: 'login',
      component: AliLoginView
    },
    {
      path: '/fake_login',
      name: 'fakeLogin',
      component: FakeLoginView
    }
  ]
})

export default router
