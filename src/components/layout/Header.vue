<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// テキストファイルとしてrawインポート
import youtubeLogoBase64 from '../img/youtubelogo.txt?raw'

const query = ref('')
const router = useRouter()

// マテリアルフォントを動的に読み込む処理を追加
onMounted(() => {
  const link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})

function search() {
  // 空文字の場合は検索しない（本家の挙動）
  if (!query.value.trim()) return
  router.push(`/results?search_query=${encodeURIComponent(query.value)}`)
}
</script>

<template>
  <header class="h-14 flex items-center justify-between px-4 fixed top-0 left-0 right-0 bg-[#0f0f0f] text-white z-50 select-none">
    
    <!-- 左側：メニューとロゴ -->
    <div class="flex items-center gap-4">
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 active:bg-zinc-700 transition-colors">
        <span class="material-symbols-outlined text-[24px]">menu</span>
      </button>
      
      <!-- YouTube ロゴ（Base64の画像データを使用 - JPEG形式に対応） -->
      <a href="/" class="flex items-center cursor-pointer" style="height: 20px;">
        <img 
          :src="'data:image/jpeg;base64,' + youtubeLogoBase64.replace(/\s/g, '')" 
          alt="YouTube Logo" 
          class="h-full object-contain"
        />
      </a>
    </div>

    <!-- 中央：検索バーエリア -->
    <div class="flex flex-1 max-w-[732px] items-center gap-4 mx-4">
      <div class="flex flex-1 items-center">
        <!-- 検索入力欄 -->
        <div class="flex flex-1 bg-[#121212] border border-zinc-700 rounded-l-full px-4 h-10 items-center focus-within:border-blue-500 focus-within:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          <!-- 本家風：フォーカス時に左側に検索アイコンを出す場合はここに追加可能 -->
          <input
            v-model="query"
            class="w-full bg-transparent outline-none text-base text-white placeholder-zinc-500"
            placeholder="検索"
            @keyup.enter="search"
          />
          <!-- 入力文字消去ボタン（文字がある時だけ表示） -->
          <button 
            v-if="query" 
            @click="query = ''" 
            class="text-zinc-400 hover:text-white mr-1"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- 検索ボタン -->
        <button
          @click="search"
          class="w-[64px] h-10 bg-zinc-800 border border-l-0 border-zinc-700 rounded-r-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
          title="検索"
        >
          <span class="material-symbols-outlined text-[22px] text-zinc-300">search</span>
        </button>
      </div>

      <!-- 音声検索ボタン -->
      <button class="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-full flex items-center justify-center transition-colors" title="音声で検索">
        <span class="material-symbols-outlined text-[24px]">mic</span>
      </button>
    </div>

    <!-- 右側：各種アクション（作成ボタンとユーザーアイコンを削除） -->
    <div class="flex items-center gap-2">
      
      <!-- 通知ボタン -->
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 relative transition-colors" title="通知">
        <span class="material-symbols-outlined text-[24px]">notifications</span>
        <!-- 通知バッジ（本家風：赤丸に数字） -->
        <span class="absolute top-1 right-1 bg-red-600 text-[10px] font-medium text-white px-1 rounded-full min-w-[16px] text-center">
          9+
        </span>
      </button>
      
    </div>

  </header>
</template>

<style scoped>
/* Material Symbols の細かな微調整（FILLプロパティの有効化など） */
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
