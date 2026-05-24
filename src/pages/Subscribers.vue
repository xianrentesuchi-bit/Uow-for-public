<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Layout from '../components/layout/Layout.vue'

const subscribers = ref<any[]>([])

function loadSubscribers() {
  subscribers.value = JSON.parse(
    localStorage.getItem('subscribers') || '[]'
  )
}

function removeSubscriber(authorId: string) {
  const updated = subscribers.value.filter(
    (channel: any) => channel.authorId !== authorId
  )

  subscribers.value = updated

  localStorage.setItem(
    'subscribers',
    JSON.stringify(updated)
  )
}

onMounted(loadSubscribers)
</script>

<template>
  <Layout>
    <div class="bg-white text-black min-h-screen">
      <div class="max-w-[1400px] mx-auto p-6">

        <h1 class="text-3xl font-bold mb-8">
          登録チャンネル
        </h1>

        <div
          v-if="subscribers.length"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >

          <div
            v-for="channel in subscribers"
            :key="channel.authorId"
            class="border border-zinc-200 rounded-3xl p-5 flex items-center justify-between gap-4"
          >

            <div class="flex items-center gap-4 min-w-0">

              <img
                :src="channel.authorThumbnail"
                class="w-16 h-16 rounded-full object-cover"
              >

              <div class="min-w-0">
                <div class="font-bold text-lg truncate">
                  {{ channel.author }}
                </div>

                <div class="text-sm text-zinc-500 mt-1">
                  {{ channel.subCountText }}
                </div>
              </div>

            </div>

            <button
              class="bg-black text-white px-4 h-10 rounded-full font-semibold hover:bg-zinc-800 transition shrink-0"
              @click="removeSubscriber(channel.authorId)"
            >
              登録解除
            </button>

          </div>

        </div>

        <div
          v-else
          class="text-zinc-500 text-lg"
        >
          登録チャンネルがありません
        </div>

      </div>
    </div>
  </Layout>
</template>
