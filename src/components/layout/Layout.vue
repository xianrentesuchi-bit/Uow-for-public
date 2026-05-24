<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'

const isCompact = ref(true)

function toggleSidebar() {
  isCompact.value = !isCompact.value
}

const sidebarWidth = computed(() => {
  return isCompact.value ? '70px' : '250px'
})
</script>

<template>
  <div class="layout-container">
    <Header @toggle-sidebar="toggleSidebar" />

    <Sidebar
      :is-open="true"
      :is-compact="isCompact"
    />

    <main
      class="main-content"
      :style="{ marginLeft: sidebarWidth }"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 4rem;
  transition: margin-left 0.3s ease;
}
</style>
