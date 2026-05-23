<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import youtubeLogoBase64 from '../img/youtubelogo.txt?raw'

const query = ref('')
const router = useRouter()

onMounted(() => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})

function search() {
  if (!query.value.trim()) return
  router.push(`/results?search_query=${encodeURIComponent(query.value)}`)
}
</script>

<template>
  <header class="h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 bg-white text-black z-50 select-none">
    
    <div class="flex items-center gap-4">
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors">
        <span class="material-symbols-outlined text-[24px]">menu</span>
      </button>
      
      <a href="/" class="flex items-center cursor-pointer" style="height: 40px;">
        <img 
          :src="youtubeLogoBase64.trim().startsWith('data:') ? youtubeLogoBase64.trim() : 'data:image/jpeg;base64,' + youtubeLogoBase64.replace(/\s/g, '')" 
          alt="YouTube Logo" 
          class="h-full object-contain"
        />
      </a>
    </div>

    <div class="flex flex-1 max-w-[732px] items-center gap-4 mx-4">
      <div class="flex flex-1 items-center">
        <div class="flex flex-1 bg-white border border-zinc-300 rounded-l-full px-4 h-10 items-center focus-within:border-blue-500 focus-within:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
          <input
            v-model="query"
            class="w-full bg-transparent outline-none text-base text-black placeholder-zinc-400"
            placeholder="検索"
            @keyup.enter="search"
          />
          <button 
            v-if="query" 
            @click="query = ''" 
            class="text-zinc-500 hover:text-black mr-1"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <button
          @click="search"
          class="w-[64px] h-10 bg-zinc-50 border border-l-0 border-zinc-300 rounded-r-full flex items-center justify-center hover:bg-zinc-100 transition-colors"
          title="検索"
        >
          <span class="material-symbols-outlined text-[22px] text-zinc-700">search</span>
        </button>
      </div>

      <button class="w-10 h-10 bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 rounded-full flex items-center justify-center transition-colors" title="音声で検索">
        <span class="material-symbols-outlined text-[24px]">mic</span>
      </button>
    </div>

    <div class="flex items-center gap-2">
      
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 relative transition-colors" title="通知">
        <span class="material-symbols-outlined text-[24px]">notifications</span>
        <span class="absolute top-1 right-1 bg-red-600 text-[10px] font-medium text-white px-1 rounded-full min-w-[16px] text-center">
          9+
        </span>
      </button>
      
    </div>

  </header>
</template>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}
</style>
