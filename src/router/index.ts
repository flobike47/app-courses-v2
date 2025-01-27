import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/NavigationPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/ListPage.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/SettingsPage.vue')
      },
      {
        path: '/articles',
        component: () => import('@/views/ArticlePage.vue'),
      },
    ]
  },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const canAccess = true
  if (!canAccess) return '/login'
})

export default router
