<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Layout from '../components/layout/Layout.vue'
import VideoPlayer from '../components/video/VideoPlayer.vue'

import { getComments, getVideo } from '../api/invidious'

const route = useRoute()

const video = ref<any>(null)
const comments = ref<any[]>([])

onMounted(async () => {
  const id = route.params.id as string

  video.value = await getVideo(id)

  const data = await getComments(id)

  comments.value = data.comments
})
</script>

<template>
  <Layout>
    <div class="p-6 max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">

      <div>
        <VideoPlayer :id="video?.videoId" />

        <h1 class="text-2xl font-bold mt-4">
          {{ video?.title }}
        </h1>

        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-zinc-700"></div>

            <div>
              <div class="font-semibold">
                {{ video?.author }}
              </div>

              <div class="text-sm text-zinc-400">
                subscribers
              </div>
            </div>

            <button class="bg-white text-black px-4 h-9 rounded-full font-semibold">
              Subscribe
            </button>
          </div>

          <div class="flex gap-2">
            <button class="bg-zinc-800 px-4 h-9 rounded-full">
              👍 Like
            </button>

            <button class="bg-zinc-800 px-4 h-9 rounded-full">
              Share
            </button>
          </div>
        </div>

        <div class="bg-zinc-900 rounded-2xl p-4 mt-6 whitespace-pre-wrap">
          {{ video?.description }}
        </div>

        <div class="mt-8">
          <h2 class="text-xl font-bold mb-4">
            Comments
          </h2>

          <div
            v-for="comment in comments"
            :key="comment.commentId"
            class="flex gap-4 mb-6"
          >
            <div class="w-10 h-10 rounded-full bg-zinc-700"></div>

            <div>
              <div class="font-semibold">
                {{ comment.author }}
              </div>

              <div class="mt-1 text-zinc-300">
                {{ comment.content }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="space-y-4">
          <div
            v-for="i in 20"
            :key="i"
            class="flex gap-3"
          >
            <div class="w-44 aspect-video bg-zinc-800 rounded-xl"></div>

            <div>
              <div class="font-semibold line-clamp-2">
                Recommended Video {{ i }}
              </div>

              <div class="text-sm text-zinc-400 mt-2">
                Channel Name
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>
