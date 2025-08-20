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
      children: [
        {
          path: ':id',
          name: 'boardDetail',
          component: () => import('../views/BoardDetail.vue'),
          props: true
        },
        {
          path: 'write',
          name: 'boardWrite',
          component: () => import('../components/BoardWriteEdit.vue')
        },
        {
          path: 'edit/:id',
          name: 'boardEdit',
          component: () => import('../components/BoardWriteEdit.vue'),
          props: true
        }
      ]
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: () => import('../views/ShoppingList.vue'),
      /* children: [
        {
          path:
        }
      ] */
    },
  ],
})

export default router
