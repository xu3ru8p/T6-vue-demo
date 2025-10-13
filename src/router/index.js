import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from '../WelcomeScreen.vue'
import GameBoard from '../GameBoard.vue'
import GameResults from '../GameResults.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeScreen
    },
    {
      path: '/game',
      name: 'game',
      component: GameBoard
    },
    {
      path: '/results',
      name: 'results',
      component: GameResults
    }
  ]
})

export default router