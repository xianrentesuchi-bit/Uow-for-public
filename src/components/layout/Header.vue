<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const router = useRouter()

function search() {
  router.push(`/results?search_query=${query.value}`)
}
</script>

<template>
  <header class="h-14 flex items-center px-4 border-b border-zinc-800 fixed top-0 left-0 right-0 bg-[#0f0f0f] z-50">

    <div class="text-2xl font-bold text-red-500 mr-8">
      Tube
    </div>

    <div class="flex flex-1 justify-center">
      <div class="flex w-full max-w-2xl">
        <input
          v-model="query"
          class="flex-1 bg-zinc-900 border border-zinc-700 rounded-l-full px-5 h-10"
          placeholder="Search"
          @keyup.enter="search"
        />

        <button
          @click="search"
          class="w-20 bg-zinc-800 border border-zinc-700 rounded-r-full"
        >
          🔍
        </button>
      </div>
    </div>

    <div class="flex gap-4 ml-4">
      <button>🎤</button>
      <button>🔔</button>
      <button>👤</button>
    </div>
  </header>
</template>
