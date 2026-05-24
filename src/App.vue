<template>
  <Header @toggle-sidebar="isSidebarOpen = $event" />

  <Sidebar :isOpen="isSidebarOpen" />

  <router-view />
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

const isSidebarOpen = ref(false)
</script>
