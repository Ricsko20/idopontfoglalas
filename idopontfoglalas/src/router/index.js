import { createRouter, createWebHistory } from 'vue-router'
import FoglalasView from '../views/FoglalasView.vue'
import UrlapView from '../views/UrlapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'foglalas',
      component: FoglalasView
    },
    {
      path: '/urlap',
      name: 'urlap',
      component: UrlapView
    }
  ],
})

export default router