import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import TabsPage from '../components/NavigationComponent.vue'
import {UserService} from "@/services/UserService";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import CirclePage from "@/views/CirclePage.vue";
import {CircleService} from "@/services/CircleService";

const userService = new UserService()
const circleService = new CircleService()
const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/register',
    component: RegisterPage,
  },
  {
    path: '/circle',
    component: CirclePage,
    beforeEnter:[beforeEach],
  },
  {
    path: '/tabs/',
    component: TabsPage,
    beforeEnter:[beforeEach,beforeHome],
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

async function beforeEach(to, from, next)  {

  const {data: { session },
  } = await userService.getUserSession()

  if (!session ) {
    return next('/login')
  }else {
    await userService.finishGoogleLogin(session)
    next()
  }
}

async function beforeHome(to, from, next)  {

  const circle = await circleService.getUserCircle()

  if (!circle ) {
    return next('/circle')
  }else {
    next()
  }
}

export default router
