import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Watch from '../pages/Watch.vue'
import Search from '../pages/Search.vue'
import Shorts from '../pages/Shorts.vue'
import Channel from '../pages/Channel.vue'
import Subscribers from '../pages/Subscribers.vue'
import History from '../pages/History.vue'
import Playlist from '../pages/Playlist.vue'
import html from '../pages/html.vue'

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
    {
      path: '/playlist',
      component: Playlist,
　　 },
    {
      path: '/tools',
      component: html,
　　 },
  ],
})

export default router
