import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Watch from '../pages/Watch.vue'
import Search from '../pages/Search.vue'
import Shorts from '../pages/Shorts.vue'
import Channel from '../pages/Channel.vue'
import Subscribers from '../pages/Subscribers.vue'
import History from '../pages/History.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: Home,
    },

    {
      path: '/watch/:id',
      component: Watch,
    },

    {
      path: '/results',
      component: Search,
    },

    {
      path: '/shorts',
      component: Shorts,
    },

    {
      path: '/channel/:id',
      component: Channel,
    },

    {
      path: '/subscribers',
      component: Subscribers,
    },

    {
      path: '/history',
      component: History,
    },
  ],
})

export default router
