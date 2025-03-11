import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory, RouterView } from 'vue-router'
import FoglalasView from '@/views/FoglalasView.vue'
import UrlapView from '@/views/UrlapView.vue'

describe('Foglalas and Urlap Views', () => {
  let router

  beforeEach(() => {
    setActivePinia(createPinia())

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/foglalas', component: FoglalasView },
        { path: '/urlap', component: UrlapView },
      ],
    })
  })

  it('should load FoglalasView first and then switch to UrlapView', async () => {
    const wrapper = mount(RouterView, {
      global: {
        plugins: [router],
      },
    })

    await router.push('/foglalas')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Időpontfoglalás')
    
    await router.push('/urlap')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('megerősítése')
    expect(wrapper.text()).not.toContain('Időpontfoglalás')
  })
})