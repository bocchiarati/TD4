import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/api/views/Home.vue'
import Profile from '@/api/views/Profile.vue'
import NewGame from '@/api/views/NewGame.vue'
import JoinGame from '@/api/views/JoinGame.vue'
import { RouteNames } from './constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.HOME,
      component: Home
    },
    {
      path: '/profile',
      name: RouteNames.PROFILE,
      component: Profile
    },
    {
      path: '/new-game',
      name: RouteNames.NEW_GAME,
      component: NewGame
    },
    {
      path: '/join-game',
      name: RouteNames.JOIN_GAME,
      component: JoinGame
    }
  ]
})

export default router
