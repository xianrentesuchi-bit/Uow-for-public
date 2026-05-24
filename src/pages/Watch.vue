<!-- pages/Watch.vue -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import Layout from '../components/layout/Layout.vue'
import VideoPlayer from '../components/video/VideoPlayer.vue'
import Loading from '../components/layout/Loading.vue'

import {
  getComments,
  getVideo,
  searchVideos
} from '../api/invidious'

const route = useRoute()

const video = ref<any>(null)
const comments = ref<any[]>([])
const relatedVideos = ref<any[]>([])
const loading = ref(true)

const selectedStream = ref('youtube-nocookie')

async function loadVideo() {
  loading.value = true

  try {
    const id = route.params.id as string

    video.value = await getVideo(id)

    const commentsData = await getComments(id)

    comments.value =
      commentsData.comments?.map((comment: any) => ({
        ...comment,
        authorThumbnail:
          comment.authorThumbnails?.[1]?.url ||
          comment.authorThumbnails?.[0]?.url ||
          `https://yt3.ggpht.com/ytc/default-user=s88-c-k-c0x00ffffff-no-rj`
      })) || []

    const related = await searchVideos(video.value.title)

    relatedVideos.value = related
      .filter((v: any) => v.videoId !== id)
      .slice(0, 20)
      .map((v: any) => ({
        ...v,
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`
      }))
  } finally {
    loading.value = false
  }
}

onMounted(loadVideo)

watch(
  () => route.params.id,
  async () => {
    await loadVideo()
  }
)
</script>

<template>
  <Layout>
    <Loading v-if="loading" />

    <div
      v-else
      class="bg-white text-black min-h-screen"
    >
      <div
        class="p-6 max-w-[1700px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8"
      >

        <!-- LEFT -->
        <div>

          <VideoPlayer
            :key="`${selectedStream}-${video?.videoId}`"
            :id="video?.videoId"
            :stream="selectedStream"
            :format-streams="video?.formatStreams"
          />

          <!-- STREAM SELECT -->
          <div class="mt-4 flex items-center gap-3">
            <div class="font-semibold text-sm text-zinc-600">
              Player
            </div>

            <select
              v-model="selectedStream"
              class="border border-zinc-300 rounded-xl px-4 h-10 bg-white"
            >
              <option value="youtube-nocookie">
                youtube-nocookie.com
              </option>

              <option value="youtube">
                youtube.com
              </option>

              <option value="stream">
                Invidious Stream
              </option>
            </select>
          </div>

          <!-- TITLE -->
          <h1 class="text-2xl font-bold mt-4 leading-tight">
            {{ video?.title }}
          </h1>

          <!-- ACTION BAR -->
          <div class="flex items-center justify-between mt-5 flex-wrap gap-4">

            <!-- CHANNEL -->
            <div class="flex items-center gap-4">

              <img
                :src="video?.authorThumbnails?.[2]?.url"
                class="w-11 h-11 rounded-full object-cover"
              >

              <div>
                <div class="font-semibold text-[15px]">
                  {{ video?.author }}
                </div>

                <div class="text-sm text-zinc-500">
                  {{ video?.subCountText || 'YouTube Channel' }}
                </div>
              </div>

              <button
                class="bg-black text-white px-5 h-9 rounded-full font-semibold hover:bg-zinc-800 transition"
              >
                Subscribe
              </button>
            </div>

            <!-- BUTTONS -->
            <div class="flex items-center gap-2 flex-wrap">

              <button
                class="bg-zinc-100 hover:bg-zinc-200 transition px-5 h-10 rounded-full font-semibold flex items-center gap-2"
              >
                👍
                <span>
                  {{
                    video?.likeCount
                      ? Intl.NumberFormat().format(video.likeCount)
                      : '0'
                  }}
                </span>
              </button>

              <button
                class="bg-zinc-100 hover:bg-zinc-200 transition px-5 h-10 rounded-full font-semibold"
              >
                Share
              </button>

            </div>
          </div>

          <!-- STATS -->
          <div
            class="bg-zinc-100 rounded-2xl p-4 mt-6"
          >
            <div class="font-semibold text-sm">
              {{
                Intl.NumberFormat().format(video?.viewCount || 0)
              }}
              views
            </div>

            <div class="mt-3 whitespace-pre-wrap text-[15px] leading-7">
              {{ video?.description }}
            </div>
          </div>

          <!-- COMMENTS -->
          <div class="mt-8">

            <h2 class="text-xl font-bold mb-6">
              Comments
              ({{ comments.length }})
            </h2>

            <div
              v-for="comment in comments"
              :key="comment.commentId"
              class="flex gap-4 mb-8"
            >

              <img
                :src="comment.authorThumbnail"
                class="w-10 h-10 rounded-full object-cover"
              >

              <div class="flex-1">

                <div class="flex items-center gap-2">
                  <div class="font-semibold text-sm">
                    {{ comment.author }}
                  </div>

                  <div class="text-xs text-zinc-500">
                    {{ comment.publishedText }}
                  </div>
                </div>

                <div class="mt-2 text-[15px] text-zinc-700 whitespace-pre-wrap leading-7">
                  {{ comment.content }}
                </div>

                <div class="mt-3 text-sm text-zinc-500 flex items-center gap-4">

                  <div class="flex items-center gap-1">
                    👍
                    {{
                      comment.likeCount
                        ? Intl.NumberFormat().format(comment.likeCount)
                        : 0
                    }}
                  </div>

                  <button class="hover:text-black">
                    Reply
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div>

          <div class="space-y-4">

            <RouterLink
              v-for="related in relatedVideos"
              :key="related.videoId"
              :to="`/watch/${related.videoId}`"
              class="flex gap-3 group"
            >

              <img
                :src="related.thumbnail"
                class="w-44 aspect-video object-cover rounded-xl"
              >

              <div class="flex-1 min-w-0">

                <div
                  class="font-semibold text-[15px] leading-5 line-clamp-2 group-hover:text-zinc-700"
                >
                  {{ related.title }}
                </div>

                <div class="text-sm text-zinc-500 mt-2">
                  {{ related.author }}
                </div>

                <div class="text-sm text-zinc-500 mt-1">
                  {{
                    Intl.NumberFormat().format(
                      related.viewCount || 0
                    )
                  }}
                  views
                </div>

                <div class="text-sm text-zinc-500 mt-1">
                  {{ related.publishedText }}
                </div>

              </div>

            </RouterLink>

          </div>

        </div>

      </div>
    </div>
  </Layout>
</template>
