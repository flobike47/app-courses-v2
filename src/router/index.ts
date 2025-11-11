import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import TabsPage from '../components/NavigationComponent.vue'
import {UserService} from "@/services/UserService";
import RegisterPage from "@/views/RegisterPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import CirclePage from "@/views/CirclePage.vue";
import {CircleService} from "@/services/CircleService";
import {NetworkService} from "@/services/NetworkService";
import eventBus from "@/services/EventBus";
import {StorageCommands} from "@/models/eventCommand/StorageCommands";

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
      if (NetworkService.networkAvailable) {
          await userService.finishGoogleLogin(session)
      }
    next()
  }
}

async function beforeHome(to, from, next) {
    const storageKey = "USER_CIRCLE_LOADED"

    if (NetworkService.networkAvailable) await setUserCircleLoadedInStorage(storageKey)

    eventBus.emit(StorageCommands.OFFLINE_GET, storageKey)

    await new Promise((resolve) => {
        eventBus.on(storageKey, (value) => {
            eventBus.off(storageKey)

            if (!value) {
                resolve(next('/circle'))
            } else {
                resolve(next())
            }
        })
    })
}

async function setUserCircleLoadedInStorage(storageKey: string) {
    const circle = await circleService.getUserCircle()
    if (circle) {
        await eventBus.emit(StorageCommands.OFFLINE_SAVE, {key: storageKey, value: true})
    }
}

export default router
