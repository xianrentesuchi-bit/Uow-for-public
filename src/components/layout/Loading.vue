<script setup lang="ts">
import { ref, computed } from 'vue'

import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Setting from './Setting.vue'

const isCompact = ref(true)
const isSettingsOpen = ref(false)

function toggleSidebar() {
  isCompact.value = !isCompact.value
}

function toggleSettings() {
  isSettingsOpen.value = !isSettingsOpen.value
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
      @open-settings="toggleSettings"
    />

    <div
      class="settings-drawer"
      :class="{ 'is-open': isSettingsOpen }"
      :style="{ left: sidebarWidth }"
    >
      <Setting @close="isSettingsOpen = false" />
    </div>

    <main
      class="main-content"
      :style="{ marginLeft: sidebarWidth }"
    >
      <!-- ローディングオーバーレイ -->
      <div class="fixed inset-0 z-[9999] bg-[#f9f9f9] flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="text-xl font-semibold text-zinc-900">
            動画読み込み中...
          </div>

          <div class="mt-2 text-zinc-500">
            動画検索やデータ取得をしています
          </div>
        </div>
      </div>

      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.settings-drawer {
  position: fixed;
  top: 56px;
  bottom: 0;
  width: 300px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  z-index: 90;

  transform: translateX(-100%);
  transition:
    transform 0.3s ease,
    left 0.3s ease;
}

.settings-drawer.is-open {
  transform: translateX(0);
}

.main-content {
  flex: 1;
  padding-top: 4rem;
  transition: margin-left 0.3s ease;
}
</style>
