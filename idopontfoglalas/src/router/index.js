import { createRouter, createWebHistory } from 'vue-router'
import FoglalasView from '../views/FoglalasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'foglalas',
      component: FoglalasView
    }
  ],
})

export default router
