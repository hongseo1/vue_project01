import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/board',
      name: 'board',
      component: () => import('../views/Board.vue'),
    },
    {
      path: '/boardWrite',
      name: 'boardWrite',
      component: () => import('../components/BoardWrite.vue')
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: () => import('../views/Shopping.vue')
    },
    /* component: () => import('../views/AboutView.vue'), */
  ],
})

export default router
