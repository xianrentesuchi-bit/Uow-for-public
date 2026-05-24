<template>    
  <aside class="sidebar" :class="sidebarClass">    
    <nav class="sidebar-nav">    
      <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="sidebar-item">    
        <span class="material-symbols-outlined">{{ item.icon }}</span>    
    
        <span v-if="!isCompact" class="sidebar-label">    
          {{ item.label }}    
        </span>    
      </router-link>    
    
      <button type="button" class="sidebar-item sidebar-button" @click="$emit('open-settings')">    
        <span class="material-symbols-outlined">settings</span>    
    
        <span v-if="!isCompact" class="sidebar-label">    
          設定    
        </span>    
      </button>    
    </nav>    
  </aside>    
</template>    
    
<script setup>    
import { computed } from 'vue';    
    
const props = defineProps({    
  isOpen: { type: Boolean, default: true },    
  isCompact: { type: Boolean, default: false }    
});    
    
defineEmits(['open-settings']);    
    
const menuItems = [    
  { path: '/', label: 'ホーム', icon: 'home' },    
  { path: '/subscribers', label: '登録チャンネル', icon: 'subscriptions' },    
  { path: '/playlist', label: '再生リスト', icon: 'playlist_play' },    
  { path: '/history', label: '履歴', icon: 'history' }    
];    
    
const sidebarClass = computed(() => ({    
  'is-compact': props.isCompact,    
  'is-hidden': !props.isOpen    
}));    
</script>    
    
<style scoped>    
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');    
    
.sidebar {    
  position: fixed;    
  top: 56px;    
  left: 0;    
  width: 250px;    
  height: calc(100vh - 56px);    
  background: #fff;    
  border-right: 1px solid #e5e5e5;    
  transition: width 0.3s ease;    
  overflow-y: auto;    
  z-index: 100;    
}    
    
.sidebar.is-compact {    
  width: 70px;    
}    
    
.sidebar.is-hidden {    
  transform: translateX(-100%);    
}    
    
.sidebar-nav {    
  display: flex;    
  flex-direction: column;    
  padding: 12px 0;    
}    
    
.sidebar-item {    
  display: flex;    
  align-items: center;    
  padding: 12px 24px;    
  text-decoration: none;    
  color: #0f0f0f;    
  gap: 24px;    
}    
    
.sidebar-button {    
  background: none;    
  border: none;    
  cursor: pointer;    
  width: 100%;    
  text-align: left;    
}    
    
.is-compact .sidebar-item {    
  justify-content: center;    
  padding: 16px 0;    
}    

.is-compact .material-symbols-outlined {
  font-size: 1.5rem;
}
    
.sidebar-item:hover {    
  background: #f2f2f2;    
}    
    
.sidebar-item.router-link-active {    
  font-weight: bold;    
  color: #cc0000;    
}    
    
.material-symbols-outlined {    
  font-size: 24px;    
}    
</style>
